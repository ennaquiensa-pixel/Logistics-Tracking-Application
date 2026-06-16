import type { CreateOrderRequest, GainResponse, OrderResponse, UpdateOrderStatusRequest, UpdatePaymentStatusRequest } from "../types/orderTypes/orderTypes";
import api from "./AuthService";


export const orderService = {
  // Créer une nouvelle commande
  createOrder: async (orderData: CreateOrderRequest): Promise<OrderResponse> => {
    try {
      const response = await api.post('/api/orders', orderData);
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la création de la commande");
    }
  },

  // Obtenir toutes les commandes
  getAllOrders: async (): Promise<OrderResponse[]> => {
    try {
      const response = await api.get('/api/orders');
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des commandes");
    }
  },

  // Obtenir une commande par ID
  getOrderById: async (id: number): Promise<OrderResponse> => {
    try {
      const response = await api.get(`/api/orders/${id}`);
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération de la commande");
    }
  },

  // Obtenir les commandes d'un utilisateur
  getOrdersByUser: async (userId: number): Promise<OrderResponse[]> => {
    try {
      const response = await api.get(`/api/orders/user/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des commandes de l'utilisateur");
    }
  },

  // Mettre à jour le statut d'une commande
  updateOrderStatus: async (id: number, statusData: UpdateOrderStatusRequest): Promise<OrderResponse> => {
    try {
      const response = await api.put(`/api/orders/${id}/status`, statusData);
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la mise à jour du statut de la commande");
    }
  },

  // Mettre à jour le statut de paiement
  updatePaymentStatus: async (id: number, paymentData: UpdatePaymentStatusRequest): Promise<OrderResponse> => {
    try {
      const response = await api.put(`/api/orders/${id}/payment`, paymentData);
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la mise à jour du statut de paiement");
    }
  },

  // Obtenir le gain total
  getTotalGain: async (): Promise<GainResponse> => {
    try {
      const response = await api.get('/api/orders/gain');
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération du gain total");
    }
  },

  // Obtenir le gain entre deux dates
  getGainBetween: async (start: string, end: string): Promise<GainResponse> => {
    try {
      const response = await api.get(`/api/orders/gain/range?start=${start}&end=${end}`);
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération du gain entre les dates");
    }
  },

  // Méthodes utilitaires pour les statistiques
  getOrderStats: async (): Promise<{
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    deliveredOrders: number;
  }> => {
    try {
      const [orders, gain] = await Promise.all([
        orderService.getAllOrders(),
        orderService.getTotalGain()
      ]);

      const pendingOrders = orders.filter(order => 
        order.status === 'PENDING' || order.status === 'PROCESSING'
      ).length;

      const deliveredOrders = orders.filter(order => 
        order.status === 'DELIVERED'
      ).length;

      return {
        totalOrders: orders.length,
        totalRevenue: gain.gain,
        pendingOrders,
        deliveredOrders
      };
    } catch (error) {
      throw new Error("Erreur lors de la récupération des statistiques des commandes");
    }
  },

  // Filtrer les commandes (côté client)
  filterOrders: async (filters: {
    status?: string;
    userId?: number;
    paymentStatus?: string;
    dateDebut?: string;
    dateFin?: string;
  }): Promise<OrderResponse[]> => {
    try {
      const allOrders = await orderService.getAllOrders();
      
      return allOrders.filter(order => {
        if (filters.status && order.status !== filters.status) return false;
        if (filters.userId && order.userId !== filters.userId) return false;
        if (filters.paymentStatus && order.paymentStatus !== filters.paymentStatus) return false;
        
        // Filtrage par date
        if (filters.dateDebut || filters.dateFin) {
          const orderDate = new Date(order.createdAt);
          
          if (filters.dateDebut && orderDate < new Date(filters.dateDebut)) return false;
          if (filters.dateFin && orderDate > new Date(filters.dateFin)) return false;
        }
        
        return true;
      });
    } catch (error) {
      throw new Error("Erreur lors du filtrage des commandes");
    }
  },

  // Rechercher des commandes par référence
  searchOrders: async (query: string): Promise<OrderResponse[]> => {
    try {
      const allOrders = await orderService.getAllOrders();
      return allOrders.filter(order => 
        order.reference.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      throw new Error("Erreur lors de la recherche des commandes");
    }
  }
};

export default orderService;