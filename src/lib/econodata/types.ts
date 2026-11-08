export const ECONODATA_CATEGORIES = {
  bars: { label: "Bares", cnae: "56.11-2" },
  restaurants: { label: "Restaurantes", cnae: "56.11-2" },
  beverage_stores: { label: "Lojas de bebidas", cnae: "47.23-7" },
  emporiums: { label: "Empórios", cnae: "47.23-7" },
  premium_markets: { label: "Mercados", cnae: "47.11-3" },
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
