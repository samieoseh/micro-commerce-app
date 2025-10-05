export interface Product {
  id: number;
  name: string;
  description: string;
  brand: string;
  category: string;
  price: string; 
  stock: number;
  imageUrl: string;
  imageUrl1: string | null;
  imageUrl2: string | null;
  imageUrl3: string | null;
  imageUrl4: string | null;
  createdAt: string; 
  updatedAt: string; 
}

export interface CreateProductPayload {
  name: string;
  description?: string;
  brand: string;
  category: string;
  price: string; // backend expects string
  stock: number;
  imageUrl: string;
  imageUrl1?: string | null;
  imageUrl2?: string | null;
  imageUrl3?: string | null;
  imageUrl4?: string | null;
}
