export type FermentableType = 'GRAIN' | 'SUGAR' | 'EXTRACT' | 'DRY_EXTRACT' | 'ADJUNCT' | 'OTHER';

export interface Fermentable {
  id: number;
  name: string;
  type: FermentableType;
  colorEbc: number;
  yieldPercentage: number;
  protein: number;
}

export interface Hop {
  id: number;
  name: string;
  alphaAcid: number;
  origin: string;
}

export type YeastType = 'ALE' | 'LAGER' | 'KVEIK' | 'BACTERIA' | 'BRETT' | 'WINE' | 'OTHER';

export interface Yeast {
  id: number;
  name: string;
  attenuationMin: number;
  attenuationMax: number;
  type: YeastType;
  alcoholTolerance: number;
}

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  last: boolean;
  first: boolean;
}

// @ts-ignore
const API_BASE_URL = window.ENV?.API_URL || import.meta.env.VITE_API_URL || "";

const fetchApi = async <T>(endpoint: string, params?: Record<string, string>): Promise<Page<T>> => {
  const url = new URL(endpoint, API_BASE_URL);
  if (params) {
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  }
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  return response.json();
};

const fetchOneApi = async <T>(endpoint: string): Promise<T> => {
  const url = new URL(endpoint, API_BASE_URL);
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  return response.json();
};

export const inventoryApi = {
  getFermentables: (name?: string, page = 0, size = 20) => 
    fetchApi<Fermentable>('/api/fermentables', { ...(name && { name }), page: String(page), size: String(size) }),
  getFermentableById: (id: number) => fetchOneApi<Fermentable>(`/api/fermentables/${id}`),
  getHops: (name?: string, page = 0, size = 20) => 
    fetchApi<Hop>('/api/hops', { ...(name && { name }), page: String(page), size: String(size) }),
  getHopById: (id: number) => fetchOneApi<Hop>(`/api/hops/${id}`),
  getYeasts: (name?: string, page = 0, size = 20) => 
    fetchApi<Yeast>('/api/yeasts', { ...(name && { name }), page: String(page), size: String(size) }),
  getYeastById: (id: number) => fetchOneApi<Yeast>(`/api/yeasts/${id}`),
};
