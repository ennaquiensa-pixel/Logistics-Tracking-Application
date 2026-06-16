import type { ActiveUsersReport, AddUserRequest, AdresseRequest, AdresseResponse, ClientResponse, DashboardResponse, LivreurResponse, ManagerDashboardResponse, ManagerResponse, OrderResponse, UpdateLivreurPositionRequest, UpdateUserRequest, UserResponse, UsersByRoleStats } from "../types/UserTypes";
import api from "./AuthService";


export const userService = {
  // ============ User Management ============
  
  getUserById: async (id: number): Promise<UserResponse> => {
    const response = await api.get<UserResponse>(`/api/users/${id}`);
    return response.data;
  },

  getUserByEmail: async (email: string): Promise<UserResponse> => {
    const response = await api.get<UserResponse>(`/api/users/email/${email}`);
    return response.data;
  },

  updateUser: async (id: number, request: UpdateUserRequest): Promise<UserResponse> => {
    const response = await api.put<UserResponse>(`/api/users/${id}`, request);
    return response.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/api/users/${id}`);
  },

  // ============ Admin Management ============
  getNumberOfLivraison: async (): Promise<number> => {
    const response = await api.get<{ count: number }>('/api/deliveries/number');
    return response.data.count;
  },
  getDashboard: async (): Promise<DashboardResponse> => {
    const response = await api.get<DashboardResponse>('/api/admin/dashboard');
    console.log(response.data);
    return response.data;
  },

  getAllUsers: async (): Promise<UserResponse[]> => {
    const response = await api.get<UserResponse[]>('/api/admin/users');
    return response.data;
  },

  addUserByAdmin: async (request: AddUserRequest): Promise<UserResponse> => {
    const response = await api.post<UserResponse>('/api/admin/users', request);
    return response.data;
  },

  activateUser: async (id: number): Promise<UserResponse> => {
    const response = await api.put<UserResponse>(`/api/admin/users/${id}/activate`);
    return response.data;
  },

  deactivateUser: async (id: number): Promise<UserResponse> => {
    const response = await api.put<UserResponse>(`/api/admin/users/${id}/deactivate`);
    return response.data;
  },

  deleteUserByAdmin: async (id: number): Promise<void> => {
    await api.delete(`/api/admin/users/${id}`);
  },

  getUsersByRole: async (): Promise<UsersByRoleStats> => {
    const response = await api.get<UsersByRoleStats>('/api/admin/reports/users-by-role');
    return response.data;
  },

  getActiveUsersReport: async (): Promise<ActiveUsersReport> => {
    const response = await api.get<ActiveUsersReport>('/api/admin/reports/active-users');
    return response.data;
  },
  getRecentUsers: async (limit: number): Promise<UserResponse[]> => {
  const response = await api.get<UserResponse[]>(`/api/admin/recent-users`, {
    params: { limit },
  });
  return response.data;
},



  // ============ Client Management ============
  
  getClientById: async (id: number): Promise<ClientResponse> => {
    const response = await api.get<ClientResponse>(`/api/users/clients/${id}`);
    return response.data;
  },

  getAllClients: async (): Promise<ClientResponse[]> => {
    const response = await api.get<ClientResponse[]>('/api/users/clients');
    return response.data;
  },

  addClientAdresse: async (clientId: number, request: AdresseRequest): Promise<AdresseResponse> => {
    const response = await api.post<AdresseResponse>(`/api/users/clients/${clientId}/adresses`, request);
    return response.data;
  },

  getClientAdresses: async (clientId: number): Promise<AdresseResponse[]> => {
    const response = await api.get<AdresseResponse[]>(`/api/users/clients/${clientId}/adresses`);
    return response.data;
  },

  getClientOrders: async (clientId: number): Promise<OrderResponse[]> => {
    const response = await api.get<OrderResponse[]>(`/api/users/clients/${clientId}/orders`);
    return response.data;
  },

  // ============ Livreur Management ============
  
  getLivreurById: async (id: number): Promise<LivreurResponse> => {
    const response = await api.get<LivreurResponse>(`/api/users/livreurs/${id}`);
    return response.data;
  },

  getAllLivreurs: async (): Promise<LivreurResponse[]> => {
    const response = await api.get<LivreurResponse[]>('/api/users/livreurs');
    return response.data;
  },

  getAvailableLivreurs: async (): Promise<LivreurResponse[]> => {
    const response = await api.get<LivreurResponse[]>('/api/users/livreurs/available');
    return response.data;
  },

  updateLivreurPosition: async (id: number, request: UpdateLivreurPositionRequest): Promise<LivreurResponse> => {
    const response = await api.put<LivreurResponse>(`/api/users/livreurs/${id}/position`, request);
    return response.data;
  },

  updateLivreurDisponibilite: async (id: number, disponibilite: boolean): Promise<LivreurResponse> => {
    const response = await api.put<LivreurResponse>(
      `/api/users/livreurs/${id}/disponibilite?disponibilite=${disponibilite}`
    );
    return response.data;
  },

  // ============ Manager Management ============
  
  getManagerById: async (id: number): Promise<ManagerResponse> => {
    const response = await api.get<ManagerResponse>(`/api/users/managers/${id}`);
    return response.data;
  },

  getAllManagers: async (): Promise<ManagerResponse[]> => {
    const response = await api.get<ManagerResponse[]>('/api/users/managers');
    return response.data;
  },

  getManagersByRegion: async (region: string): Promise<ManagerResponse[]> => {
    const response = await api.get<ManagerResponse[]>(`/api/users/managers/region/${region}`);
    return response.data;
  },

  updateManagerRegion: async (id: number, region: string): Promise<ManagerResponse> => {
    const response = await api.put<ManagerResponse>(`/api/users/managers/${id}/region?region=${region}`);
    return response.data;
  },

  updateManagerTeamSize: async (id: number, teamSize: number): Promise<ManagerResponse> => {
    const response = await api.put<ManagerResponse>(`/api/users/managers/${id}/team-size?teamSize=${teamSize}`);
    return response.data;
  },

  getManagerDashboard: async (id: number): Promise<ManagerDashboardResponse> => {
    const response = await api.get<ManagerDashboardResponse>(`/api/users/managers/${id}/dashboard`);
    return response.data;
  },

  // ============ Manager User Management ============
  
  addUserByManager: async (request: AddUserRequest): Promise<UserResponse> => {
    const response = await api.post<UserResponse>('/api/users/managers', request);
    return response.data;
  }
};

export default userService;