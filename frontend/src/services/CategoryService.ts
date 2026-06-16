import api from "./AuthService";

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export const categoryService = {
  getAllCategories: async (): Promise<Category[]> => {
    try {
      const res = await api.get('/api/categories');
      return res.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new Error("Failed to fetch categories");
    }
  },

  getCategoryById: async (id: number): Promise<Category> => {
    try {
      const res = await api.get(`/api/categories/${id}`);
      return res.data;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw new Error("Failed to fetch category");
    }
  },
};