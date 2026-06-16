export interface ProductResponse {
  id?: number;
  sku: string;
  name: string;
  description?: string | null;
  price: number;
  quantity: number;
  weightKg?: number | null;
  imageUrl?: string | null;
  categoryId?: number | null;
  warehouseId?: number | null;
  active: boolean;
}


export interface CreateProductRequest {
  sku: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  weightKg?: number | null;
  imageUrl?: string | null;
  categoryId?: number | null;
  warehouseId?: number | null;
}