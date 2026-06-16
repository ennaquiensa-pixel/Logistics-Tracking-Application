// services/ProductService.ts
import type { CreateProductRequest, ProductResponse } from "../types/productTYpes/productResponse";
import api from "./AuthService";

export const productService = {
  getAllProducts: async (): Promise<ProductResponse[]> => {
    try {
      const res = await api.get('/api/products');
      return res.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw new Error("Error getting products");
    }
  },

  getProductDetails: async (id: number): Promise<ProductResponse> => {
    try {
      const res = await api.get(`/api/products/${id}`);
      return res.data;
    } catch (error) {
      console.error("Error fetching product details:", error);
      throw new Error("Error getting product details");
    }
  },

  createProduct: async (productData: CreateProductRequest): Promise<ProductResponse> => {
    try {
      const res = await api.post('/api/products', productData);
      return res.data;
    } catch (error: any) {
      console.error("Error creating product:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Error creating product");
    }
  },

  updateProduct: async (id: number, productData: CreateProductRequest): Promise<ProductResponse> => {
    try {
      const res = await api.put(`/api/products/${id}`, productData);
      return res.data;
    } catch (error: any) {
      console.error("Error updating product:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Error updating product");
    }
  },

  deleteProduct: async (id: number): Promise<string> => {
    try {
      const res = await api.delete(`/api/products/${id}`);
      return res.data;
    } catch (error: any) {
      console.error("Error deleting product:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Error deleting product");
    }
  }
};

export default productService;