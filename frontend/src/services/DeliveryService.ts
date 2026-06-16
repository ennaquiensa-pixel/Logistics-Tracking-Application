import type { AssignDriverRequest, EtatLivraison, LivraisonFilters, LivraisonRequest, LivraisonResponse, RecentActivityDTO, UpdateLivraisonStatusRequest, WeeklyPerformanceDTO } from "../types/deliveryTypes/deliveryTypes";
import api from "./AuthService";



export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // current page number (0-indexed)
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface PaginationParams {
  page?: number;
  size?: number;
}

export const deliveryService = {
  // Créer une nouvelle livraison
  createLivraison: async (livraisonData: LivraisonRequest): Promise<LivraisonResponse> => {
    try {
      const response = await api.post('/api/deliveries', livraisonData);
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la création de la livraison");
    }
  },

  // Obtenir une livraison par ID
  getLivraisonById: async (id: number): Promise<LivraisonResponse> => {
    try {
      const response = await api.get(`/api/deliveries/${id}`);
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération de la livraison");
    }
  },

  // Obtenir toutes les livraisons avec pagination (Admin/Manager)
  getAllLivraisons: async (params?: PaginationParams): Promise<PaginatedResponse<LivraisonResponse>> => {
    try {
      const response = await api.get('/api/deliveries', {
        params: {
          page: params?.page || 0,
          size: params?.size || 10
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des livraisons', error);
      throw error;
    }
  },

  // Obtenir le nombre total de livraisons
  getLivraisonCount: async (): Promise<number> => {
    try {
      const response = await api.get('/api/deliveries/number');
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors du comptage des livraisons");
    }
  },

  // Obtenir les livraisons d'un client
  getLivraisonsByClient: async (clientId: number): Promise<LivraisonResponse[]> => {
    try {
      const response = await api.get(`/api/deliveries/client/${clientId}`);
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des livraisons du client");
    }
  },

  // Obtenir les livraisons d'un livreur
  getLivraisonsByDriver: async (livreurId: number): Promise<LivraisonResponse[]> => {
    try {
      const response = await api.get(`/api/deliveries/driver/${livreurId}`);
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des livraisons du livreur");
    }
  },

  // Obtenir les livraisons par statut
  getLivraisonsByStatus: async (status: EtatLivraison): Promise<LivraisonResponse[]> => {
    try {
      const response = await api.get(`/api/deliveries/status/${status}`);
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des livraisons par statut");
    }
  },

  // Obtenir les livraisons actives
  getActiveLivraisons: async (): Promise<LivraisonResponse[]> => {
    try {
      const response = await api.get('/api/deliveries/active');
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des livraisons actives");
    }
  },

  // Assigner un chauffeur à une livraison
  assignDriver: async (assignData: AssignDriverRequest): Promise<LivraisonResponse> => {
    try {
      const response = await api.post('/api/deliveries/assign', assignData);
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de l'assignation du chauffeur");
    }
  },

  // Mettre à jour le statut d'une livraison
  updateStatus: async (id: number, statusData: UpdateLivraisonStatusRequest): Promise<LivraisonResponse> => {
    try {
      const response = await api.put(`/api/deliveries/${id}/status`, statusData);
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la mise à jour du statut");
    }
  },

  // Annuler une livraison
  cancelLivraison: async (id: number, reason: string): Promise<void> => {
    try {
      await api.delete(`/api/deliveries/${id}?reason=${encodeURIComponent(reason)}`);
    } catch (error) {
      throw new Error("Erreur lors de l'annulation de la livraison");
    }
  },

  getWeeklyPerformance: async (): Promise<WeeklyPerformanceDTO[]> => {
    try {
      const response = await api.get("/api/deliveries/weekly-performance");
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des performances hebdomadaires");
    }
  },

  // Récupérer les activités récentes
  getRecentActivities: async (): Promise<RecentActivityDTO[]> => {
    try {
      const response = await api.get("/api/deliveries/recent-activities");
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des activités récentes");
    }
  },

  // Méthodes utilitaires pour les filtres (à mettre à jour pour supporter la pagination si nécessaire)
  filterLivraisons: async (filters: LivraisonFilters, pagination?: PaginationParams): Promise<PaginatedResponse<LivraisonResponse>> => {
    try {
      // Note: Ce filtre fonctionne côté client, ce qui peut ne pas être optimal
      // pour de grandes quantités de données. Dans un cas réel, vous voudriez
      // probablement implémenter le filtrage côté serveur.
      const allLivraisonsResponse = await deliveryService.getAllLivraisons(pagination);
      
      // Filtrage côté client sur la page courante
      const filteredContent = allLivraisonsResponse.content.filter(livraison => {
        if (filters.status && livraison.etat !== filters.status) return false;
        if (filters.clientId && livraison.clientId !== filters.clientId) return false;
        if (filters.livreurId && livraison.livreurId !== filters.livreurId) return false;
        if (filters.type && livraison.type !== filters.type) return false;
        
        // Filtrage par date
        if (filters.dateDebut || filters.dateFin) {
          const livraisonDate = new Date(livraison.dateCreation);
          
          if (filters.dateDebut && livraisonDate < new Date(filters.dateDebut)) return false;
          if (filters.dateFin && livraisonDate > new Date(filters.dateFin)) return false;
        }
        
        return true;
      });
      
      // Retourner une réponse paginée avec le contenu filtré
      // Note: Les métadonnées de pagination ne seront pas exactes avec ce filtrage côté client
      return {
        ...allLivraisonsResponse,
        content: filteredContent,
        numberOfElements: filteredContent.length,
        empty: filteredContent.length === 0
      };
    } catch (error) {
      throw new Error("Erreur lors du filtrage des livraisons");
    }
  }
};

export default deliveryService;