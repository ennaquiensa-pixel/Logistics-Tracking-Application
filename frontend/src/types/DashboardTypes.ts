export interface DashboardStats {
  totalUsers?: number;
  totalClients?: number;
  totalLivreurs?: number;
  totalManagers?: number;
  totalAdmins?: number;
  activeUsers?: number;
  availableLivreurs?: number;
  totalLivraisonsInRegion?: number;
  pendingLivraisons?: number;
  completedLivraisons?: number;
  averageDeliveryTime?: number;
  teamSize?: number;
  region?: string ;
  monthlyUsers?: Record<string, number>;
}

export interface ChartData {
  name: string;
  value: number;
  fill?: string;
}

export interface RecentActivity {
  id: number;
  user: string;
  action: string;
  timestamp: string;
  type: 'success' | 'warning' | 'error' | 'info';
}