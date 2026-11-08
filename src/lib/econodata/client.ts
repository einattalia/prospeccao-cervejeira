import {
  ECONODATA_CATEGORIES,
  type EconodataCategory,
  type EconodataProspect,
  type EconodataSearchResult,
} from "./types";

const API_BASE_URL = "https://api.econodata.com.br/v4";
const PAGE_RESULT_LIMIT = 25;
const MAX_CATEGORY_GROUPS = 3;

export class EconodataError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = "EconodataError";
  }
}

function stringValue(...values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
    if (value && typeof value === "object" && "descricao" in value) {
      const description = (value as { descricao?: unknown }).descricao;
      if (typeof description === "string" && description.trim()) return description.trim();
    }
  }
  return null;
}

function nestedRecord(value: unknown, ...keys: string[]): Record<string, unknown> {
  let current = value;
  for (const key of keys) {
    if (!current || typeof current !== "object") return {};
    current = (current as Record<string, unknown>)[key];
  }
  return current && typeof current === "object" ? current as Record<string, unknown> : {};
}

function firstPhone(value: unknown): string | null {
  const contacts = nestedRecord(value, "contatosBasicos");
  const phones = contacts.telefones ?? nestedRecord(value, "cadastro").telefones ?? nestedRecord(value, "contato").telefones ?? (value as Record<string, unknown>).telefones;
  if (Array.isArray(phones)) {
    const first = phones.find((entry) => typeof entry === "string" || (entry && typeof entry === "object"));
    if (typeof first === "string") return first;
    if (first && typeof first === "object") {
      const item = first as Record<string, unknown>;
      return stringValue(item.numero, item.telefone, item.valor, item.phone);
    }
  }
  return null;
}

function extractRows(payload: unknown): Record<string, unknown>[] {
  if (Array.isArray(payload)) return payload.filter((row): row is Record<string, unknown> => !!row && typeof row === "object");
  if (!payload || typeof payload !== "object") return [];
  const record = payload as Record<string, unknown>;
  for (const key of ["empresas", "companies", "resultados", "results", "items", "dados", "data", "content", "lista"]) {
    const value = record[key];
    if (Array.isArray(value)) return value.filter((row): row is Record<string, unknown> => !!row && typeof row === "object");
  }
  return [];
}

function normalizeProspect(row: Record<string, unknown>, checkedAt: string): EconodataProspect | null {
  const cadastro = nestedRecord(row, "cadastro");
  const address = nestedRecord(row, "endereco");
  const cnpj = stringValue(row.cnpj, cadastro.cnpj, row.documento);
  const name = stringValue(row.nomeFantasia, cadastro.nomeFantasia, row.razaoSocial, cadastro.razaoSocial, row.nome, row.name);
  if (!name) return null;

  const city = stringValue(row.cidade, cadastro.cidade, address.cidade, row.municipio) ?? "";
  const state = stringValue(row.uf, cadastro.uf, address.uf, row.estado) ?? "";
  const street = stringValue(row.logradouro, cadastro.logradouro, address.logradouro, row.enderecoCompleto);
  const number = stringValue(row.numero, cadastro.numero, address.numero);
  const neighborhood = stringValue(row.bairro, cadastro.bairro, address.bairro);
  const addressLine = [street, number, neighborhood, city, state].filter(Boolean).join(", ") || null;
  const cnae = stringValue(row.cnaePrimario, cadastro.cnaePrimario, row.cnae);

  return {
    id: cnpj ?? `${name.toLowerCase()}-${city.toLowerCase()}-${state.toLowerCase()}`,
    name,
    cnpj,
    category: cnae ?? "Estabelecimento",
    city,
    state,
    neighborhood,
    address: addressLine,
    phone: firstPhone(row),
    website: stringValue(row.website, row.site, nestedRecord(row, "cadastro").website),
    source: "Econodata",
    checkedAt,
  };
}

async function searchCnaeGroup(input: {
  city: string;
  state: string;
  cnae: string;
  apiKey: string;
  signal: AbortSignal;
}): Promise<{ rows: Record<string, unknown>[]; tokenEstimate: string | null }> {
  const response = await fetch(`${API_BASE_URL}/companies/search_list`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${input.apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      filtros: {
        uf: input.state,
        cidade: input.city,
        cnaePrimario: input.cnae,
      },
      incluir: ["cadastro", "contatosBasicos"],
    }),
    cache: "no-store",
    signal: input.signal,
  });

  if (!response.ok) {
    const messages: Record<number, string> = {
      401: "A chave da Econodata é inválida ou foi revogada.",
      402: "O saldo de tokens da Econodata acabou. Confira seu trial ou plano.",
      403: "A chave não tem permissão para segmentar empresas. Gere uma chave com escopo de leitura.",
      422: "A Econodata não aceitou os filtros enviados. Confira cidade, UF e CNAE.",
      429: "A Econodata limitou as consultas. Aguarde e tente novamente.",
      503: "A Econodata está temporariamente indisponível. Tente novamente mais tarde.",
    };
    throw new EconodataError(messages[response.status] ?? "Não foi possível consultar a Econodata.", response.status);
  }

  const payload: unknown = await response.json();
  return {
    rows: extractRows(payload),
    tokenEstimate: response.headers.get("X-Tokens-Charged"),
  };
}

export async function searchEconodata(input: {
  city: string;
  state: string;
  categories: EconodataCategory[];
}): Promise<EconodataSearchResult> {
  const apiKey = process.env.ECONODATA_API_KEY;
  if (!apiKey) throw new EconodataError("A chave ECONODATA_API_KEY ainda não está configurada no servidor.", 503);

  const cnaeGroups = [...new Set(input.categories.map((category) => ECONODATA_CATEGORIES[category].cnae))].slice(0, MAX_CATEGORY_GROUPS);
  if (cnaeGroups.length === 0) throw new EconodataError("Selecione pelo menos um tipo de estabelecimento.", 400);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  const checkedAt = new Date().toISOString();

  try {
    // One request per unique CNAE group; the page remains capped to keep pilot usage bounded.
    const pages = await Promise.all(cnaeGroups.map((cnae) => searchCnaeGroup({
      city: input.city,
      state: input.state,
      cnae,
      apiKey,
      signal: controller.signal,
    })));

    const prospectsById = new Map<string, EconodataProspect>();
    for (const page of pages) {
      for (const row of page.rows) {
        const prospect = normalizeProspect(row, checkedAt);
        if (prospect) prospectsById.set(prospect.id, prospect);
      }
    }

    return {
      prospects: [...prospectsById.values()].slice(0, PAGE_RESULT_LIMIT),
      tokenEstimate: pages.map((page) => page.tokenEstimate).filter(Boolean).join(" + ") || null,
    };
  } catch (error) {
    if (error instanceof EconodataError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new EconodataError("A busca excedeu o tempo limite. Tente novamente.", 504);
    }
    throw new EconodataError("Não foi possível conectar à Econodata. Tente novamente.", 502);
  } finally {
    clearTimeout(timeout);
  }
}
