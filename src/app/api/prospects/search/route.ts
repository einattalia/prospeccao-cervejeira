import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { EconodataError, searchEconodata } from "@/lib/econodata/client";
import { ECONODATA_CATEGORIES, type EconodataCategory } from "@/lib/econodata/types";

const validCategories = new Set(Object.keys(ECONODATA_CATEGORIES));

export async function POST(request: Request) {
  // Local development can use a trial key without exposing it to browser code.
  // Production fails closed unless Supabase Auth is configured and the caller is signed in.
  if (process.env.NODE_ENV === "production") {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
      return NextResponse.json({ error: "A busca comercial ainda não está habilitada neste ambiente." }, { status: 503 });
    }
    try {
      const supabase = await createClient();
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return NextResponse.json({ error: "Entre no app para fazer uma busca." }, { status: 401 });
    } catch {
      return NextResponse.json({ error: "Não foi possível validar o acesso à busca." }, { status: 503 });
    }
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Envie filtros de busca válidos." }, { status: 400 });
  }

  const input = body && typeof body === "object" ? body as Record<string, unknown> : {};
  const city = typeof input.city === "string" ? input.city.trim() : "";
  const state = typeof input.state === "string" ? input.state.trim().toUpperCase() : "";
  const categories = Array.isArray(input.categories)
    ? input.categories.filter((value): value is EconodataCategory => typeof value === "string" && validCategories.has(value))
    : [];

  if (!city || city.length > 80 || !/^[A-Z]{2}$/.test(state) || categories.length === 0) {
    return NextResponse.json({ error: "Informe uma cidade, a UF e ao menos uma categoria." }, { status: 400 });
  }

  try {
    const result = await searchEconodata({ city, state, categories });
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof EconodataError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Erro inesperado ao buscar estabelecimentos." }, { status: 500 });
  }
}
