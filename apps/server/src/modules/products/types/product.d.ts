export interface ProductPayload {
    name: string;
    description: string;
    price: string;
    category: string;
    imageUrl: string;
    stock?: number;  
    brand?: string;  
}

export interface ProductUpdatePayload {
  name?: string;
  description?: string;
  price?: string;      // still string because of Drizzle numeric
  category?: string;
  stock?: number;
  brand?: string;
}

interface SearchParams {
  q?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  page: number;
  limit: number;
}