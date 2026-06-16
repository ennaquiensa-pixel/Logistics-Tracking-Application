import type {
  WarehouseRequest,
  WareHouseResponse,
} from "../types/warehouseType/WarehouseResponse";
import api from "./AuthService";

export const wareHouseService = {
  getAllWareHouses: async (): Promise<WareHouseResponse[]> => {
    try {
      const response = await api.get("/api/warehouses");
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des entrepôts");
    }
  },
  createWareHouse: async (
    data: WarehouseRequest
  ): Promise<WareHouseResponse> => {
    try {
      const response = await api.post("/api/warehouses", data);
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la création de l'entrepôt");
    }
  },
};
