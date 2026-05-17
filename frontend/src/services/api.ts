export type FermentableType =
  | "GRAIN"
  | "SUGAR"
  | "EXTRACT"
  | "DRY_EXTRACT"
  | "ADJUNCT"
  | "OTHER";

export interface Fermentable {
  id: number;
  name: string;
  type: FermentableType;
  colorEbc: number;
  yieldPercentage: number;
  protein: number;
}

export interface FermentableDetail extends Fermentable {
  producer: string;
  origin: string;
  notes: string;
  moisture: number;
  diastaticPower: number;
  fan: number;
  betaGlucan: number;
}

export interface Hop {
  id: number;
  name: string;
  alphaAcid: number;
  origin: string;
}

export interface HopDetail extends Hop {
  betaAcid: number;
  notes: string;
  substitutes: string;
  totalOil: number;
  myrcene: number;
  humulene: number;
  cohumulone: number;
  caryophyllene: number;
  farnesene: number;
}

export type YeastType =
  | "ALE"
  | "LAGER"
  | "KVEIK"
  | "BACTERIA"
  | "BRETT"
  | "WINE"
  | "OTHER";

export interface Yeast {
  id: number;
  name: string;
  attenuationMin: number;
  attenuationMax: number;
  type: YeastType;
  alcoholTolerance: number;
}

export interface YeastDetail extends Yeast {
  producer: string;
  productId: string;
  flocculation: string;
  tempMin: number;
  tempMax: number;
  notes: string;
  bestFor: string;
}

export interface Style {
  id: number;
  name: string;
  category: string;
  styleId: string;
  ogMin: number;
  ogMax: number;
  fgMin: number;
  fgMax: number;
  ibuMin: number;
  ibuMax: number;
  ebcMin: number;
  ebcMax: number;
  abvMin: number;
  abvMax: number;
}

export interface StyleDetail extends Style {
  notes: string;
  aroma: string;
  appearance: string;
  flavor: string;
  mouthfeel: string;
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

declare global {
  interface Window {
    ENV?: {
      API_URL?: string;
    };
  }
}

const getApiBaseUrl = () => {
  const envUrl = window.ENV?.API_URL;
  if (envUrl && !envUrl.includes("${")) {
    return envUrl;
  }
  return import.meta.env.VITE_API_URL || "http://localhost:8080";
};

const API_BASE_URL = getApiBaseUrl();

const getAuthToken = () => localStorage.getItem('token');

const fetchApi = async <T>(
  endpoint: string,
  params?: Record<string, string>,
): Promise<Page<T>> => {
  const url = new URL(endpoint, API_BASE_URL);
  if (params) {
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key]),
    );
  }
  
  const token = getAuthToken();
  const response = await fetch(url.toString(), {
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` }),
    }
  });
  
  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  return response.json();
};

const fetchOneApi = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  const url = new URL(endpoint, API_BASE_URL);
  const token = getAuthToken();
  
  const response = await fetch(url.toString(), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options?.headers,
    },
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  return response.json();
};

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
}

export const authApi = {
  signup: (data: any) => fetchOneApi<AuthResponse>("/api/auth/signup", {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  login: (data: any) => fetchOneApi<AuthResponse>("/api/auth/login", {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

export interface Recipe {
  externalId?: string;
  name: string;
  description?: string;
  batchVolume: number;
  efficiency: number;
  og?: number;
  fg?: number;
  abv?: number;
  ibu?: number;
  ebc?: number;
  fermentables: RecipeFermentable[];
  hops: RecipeHop[];
  mashSteps: RecipeMashStep[];
  yeast?: RecipeYeast;
  styleId?: number;
}

export interface RecipeFermentable {
  id?: number;
  fermentableId: number;
  amount: number;
}

export interface RecipeHop {
  id?: number;
  hopId: number;
  amount: number;
  phase: "BOIL" | "HOPSTAND" | "DRY_HOP";
  duration: number;
}

export interface RecipeMashStep {
  id?: number;
  name: string;
  temperature: number;
  duration: number;
  stepOrder: number;
}

export interface RecipeYeast {
  id?: number;
  yeastId: number;
  amount: number;
}

export const recipeApi = {
  getRecipes: () => fetchOneApi<Recipe[]>("/api/recipes"),
  getRecipe: (externalId: string) => fetchOneApi<Recipe>(`/api/recipes/${externalId}`),
  createRecipe: async (recipe: Partial<Recipe>): Promise<Recipe> => {
    return fetchOneApi<Recipe>("/api/recipes", {
      method: 'POST',
      body: JSON.stringify(recipe),
    });
  },
  updateRecipe: async (externalId: string, recipe: Partial<Recipe>): Promise<Recipe> => {
    return fetchOneApi<Recipe>(`/api/recipes/${externalId}`, {
      method: 'PUT',
      body: JSON.stringify(recipe),
    });
  },
  addFermentable: (externalId: string, f: RecipeFermentable) => 
    fetchOneApi<Recipe>(`/api/recipes/${externalId}/fermentables`, { method: 'POST', body: JSON.stringify(f) }),
  updateFermentable: (externalId: string, id: number, f: Partial<RecipeFermentable>) => 
    fetchOneApi<Recipe>(`/api/recipes/${externalId}/fermentables/${id}`, { method: 'PUT', body: JSON.stringify(f) }),
  deleteFermentable: (externalId: string, id: number) => 
    fetchOneApi<Recipe>(`/api/recipes/${externalId}/fermentables/${id}`, { method: 'DELETE' }),
  
  addHop: (externalId: string, h: RecipeHop) => 
    fetchOneApi<Recipe>(`/api/recipes/${externalId}/hops`, { method: 'POST', body: JSON.stringify(h) }),
  updateHop: (externalId: string, id: number, h: Partial<RecipeHop>) => 
    fetchOneApi<Recipe>(`/api/recipes/${externalId}/hops/${id}`, { method: 'PUT', body: JSON.stringify(h) }),
  deleteHop: (externalId: string, id: number) => 
    fetchOneApi<Recipe>(`/api/recipes/${externalId}/hops/${id}`, { method: 'DELETE' }),
    
  addMashStep: (externalId: string, m: RecipeMashStep) => 
    fetchOneApi<Recipe>(`/api/recipes/${externalId}/mashsteps`, { method: 'POST', body: JSON.stringify(m) }),
  updateMashStep: (externalId: string, id: number, m: Partial<RecipeMashStep>) => 
    fetchOneApi<Recipe>(`/api/recipes/${externalId}/mashsteps/${id}`, { method: 'PUT', body: JSON.stringify(m) }),
  deleteMashStep: (externalId: string, id: number) => 
    fetchOneApi<Recipe>(`/api/recipes/${externalId}/mashsteps/${id}`, { method: 'DELETE' }),
    
  updateYeast: (externalId: string, y: RecipeYeast) => 
    fetchOneApi<Recipe>(`/api/recipes/${externalId}/yeast`, { method: 'PUT', body: JSON.stringify(y) }),
};

export const inventoryApi = {
  getFermentables: (name?: string, page = 0, size = 20) =>
    fetchApi<Fermentable>("/api/fermentables", {
      ...(name && { name }),
      page: String(page),
      size: String(size),
    }),
  getFermentableById: (id: number) =>
    fetchOneApi<FermentableDetail>(`/api/fermentables/${id}`),
  getHops: (name?: string, page = 0, size = 20) =>
    fetchApi<Hop>("/api/hops", {
      ...(name && { name }),
      page: String(page),
      size: String(size),
    }),
  getHopById: (id: number) => fetchOneApi<HopDetail>(`/api/hops/${id}`),
  getYeasts: (name?: string, page = 0, size = 20) =>
    fetchApi<Yeast>("/api/yeasts", {
      ...(name && { name }),
      page: String(page),
      size: String(size),
    }),
  getYeastById: (id: number) => fetchOneApi<YeastDetail>(`/api/yeasts/${id}`),
};

export const styleApi = {
  getStyles: (name?: string, page = 0, size = 20) =>
    fetchApi<Style>("/api/styles", {
      ...(name && { name }),
      page: String(page),
      size: String(size),
    }),
  getStyleById: (id: number) => fetchOneApi<StyleDetail>(`/api/styles/${id}`),
};

export type BrewingStatus = 
  | "PLANNED" | "MASHING" | "BOILING" | "FERMENTING" | "CONDITIONING" | "FINISHED" | "ABORTED";

export type BrewingTaskCategory = "PREPARATION" | "MASHING" | "BOILING" | "POST_BOIL";

export interface BrewingTask {
  id: number;
  label: string;
  completed: boolean;
  category: BrewingTaskCategory;
  orderIndex: number;
  duration?: number;
}

export interface FermentationReading {
  id: number;
  timestamp: string;
  gravity: number;
  temperature: number;
  notes?: string;
}

export interface BrewingSessionDetail {
  id: number;
  name: string;
  status: BrewingStatus;
  recipeId: number;
  plannedDate: string;
  brewDate?: string;
  bottlingDate?: string;
  preBoilVolume?: number;
  preBoilGravity?: number;
  batchVolume?: number;
  originalGravity?: number;
  finalGravity?: number;
  actualEfficiency?: number;
  actualAbv?: number;
  actualAttenuation?: number;
  targetOg?: number;
  targetFg?: number;
  targetIbu?: number;
  targetEbc?: number;
  targetAbv?: number;
  targetBatchSize?: number;
  targetBoilTime?: number;
  tasks: BrewingTask[];
  readings: FermentationReading[];
}

export const brewingApi = {
  startSession: (recipeExternalId: string) => 
    fetchOneApi<number>(`/api/brewing/start/${recipeExternalId}`, { method: 'POST' }),
  getSessions: () => fetchOneApi<any[]>("/api/brewing"),
  getSessionDetail: (id: number) => fetchOneApi<BrewingSessionDetail>(`/api/brewing/${id}`),
  toggleTask: (taskId: number) => fetchOneApi<void>(`/api/brewing/tasks/${taskId}/toggle`, { method: 'PATCH' }),
  addReading: (id: number, reading: Partial<FermentationReading>) => 
    fetchOneApi<void>(`/api/brewing/${id}/readings`, { method: 'POST', body: JSON.stringify(reading) }),
};
