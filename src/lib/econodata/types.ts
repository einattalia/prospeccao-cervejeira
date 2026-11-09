export const ECONODATA_CATEGORIES = {
  bars: { label: "Bares", cnaes: ["56.11-2/04", "56.11-2/05"] },
  restaurants: { label: "Restaurantes", cnaes: ["56.11-2/01"] },
  beverage_stores: { label: "Lojas de bebidas", cnaes: ["47.23-7"] },
  emporiums: { label: "Empórios", cnaes: ["47.23-7"] },
  premium_markets: { label: "Mercados", cnaes: ["47.11-3"] },
} as const;

export type EconodataCategory = keyof typeof ECONODATA_CATEGORIES;

export type EconodataProspect = {
  id: string;
  name: string;
  cnpj: string | null;
  category: string;
  city: string;
  state: string;
  neighborhood: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  source: "Econodata";
  checkedAt: string;
};

export type EconodataSearchResult = {
  prospects: EconodataProspect[];
  tokenEstimate: string | null;
};
