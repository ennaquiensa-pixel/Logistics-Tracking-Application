import React, { useState, useEffect } from 'react';
import { 
  Truck, Package, CheckCircle, Clock, TrendingUp, 
  MapPin, Calendar, DollarSign, BarChart3,
  Download, Plus, MoreVertical, Eye, Navigation, TrendingDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import deliveryService from '../services/DeliveryService';
import { EtatLivraison, type LivraisonResponse } from '../types/deliveryTypes/deliveryTypes';

const DriverDashboard: React.FC = () => {
  const [driverDeliveries, setDriverDeliveries] = useState<LivraisonResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState<LivraisonResponse[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDriverData();
  }, []);

  const fetchDriverData = async () => {
    try {
      setLoading(true);
      if (user?.userId) {
        const deliveries = await deliveryService.getLivraisonsByDriver(user.userId);
        setDriverDeliveries(deliveries);
        setRecentActivities(deliveries.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching driver data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalShipments = driverDeliveries.length;
  const inTransit = driverDeliveries.filter(d => d.etat === EtatLivraison.EN_COURS).length;
  const delivered = driverDeliveries.filter(d => d.etat === EtatLivraison.LIVREE).length;
  
  const shipmentStats = [
    { month: 'Jan', shipments: 45 },
    { month: 'Feb', shipments: 52 },
    { month: 'Mar', shipments: 48 },
    { month: 'Apr', shipments: 60 },
    { month: 'May', shipments: 75 },
    { month: 'Jun', shipments: 82 },
    { month: 'Jul', shipments: 65 },
    { month: 'Aug', shipments: 70 }
  ];

  const getStatusColor = (status: EtatLivraison) => {
    switch (status) {
      case EtatLivraison.LIVREE: return 'bg-green-50 text-green-700 border border-green-200';
      case EtatLivraison.EN_COURS: return 'bg-blue-50 text-blue-700 border border-blue-200';
      case EtatLivraison.EN_ATTENTE: return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      case EtatLivraison.PLANIFIEE: return 'bg-purple-50 text-purple-700 border border-purple-200';
      default: return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Welcome back, {user?.nom || 'Driver'}</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                <Calendar className="h-4 w-4 inline mr-2" />
                Today
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Total Shipments */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Shipments</p>
                <p className="text-3xl font-semibold text-gray-900 mt-2">{totalShipments}</p>
              </div>
              <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600 font-medium">12%</span>
              <span className="text-gray-600 ml-2">vs last month</span>
            </div>
          </div>

          {/* In Transit */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Transit</p>
                <p className="text-3xl font-semibold text-gray-900 mt-2">{inTransit}</p>
              </div>
              <div className="h-12 w-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <Truck className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Clock className="h-4 w-4 text-orange-600 mr-1" />
              <span className="text-gray-600">Active deliveries</span>
            </div>
          </div>

          {/* Delivered */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-3xl font-semibold text-gray-900 mt-2">{delivered}</p>
              </div>
              <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600 font-medium">8%</span>
              <span className="text-gray-600 ml-2">vs last month</span>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-semibold text-gray-900 mt-2">$202K</p>
              </div>
              <div className="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600 font-medium">28%</span>
              <span className="text-gray-600 ml-2">vs last week</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Shipment Overview</h3>
                <p className="text-sm text-gray-500">Monthly delivery statistics</p>
              </div>
              <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Last 8 months</option>
                <option>Last 6 months</option>
                <option>Last 3 months</option>
              </select>
            </div>
            
            <div className="flex items-end justify-between h-64 gap-3">
              {shipmentStats.map((stat) => (
                <div key={stat.month} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col items-center justify-end" style={{ height: '200px' }}>
                    <div 
                      className="w-full bg-blue-600 rounded-t hover:bg-blue-700 transition-colors cursor-pointer relative group"
                      style={{ height: `${(stat.shipments / 100) * 100}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {stat.shipments} shipments
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 mt-3 font-medium">{stat.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Live Tracking */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Live Tracking</h3>
              <MapPin className="h-5 w-5 text-red-500" />
            </div>
            
            <div className="bg-gray-100 rounded-lg h-48 mb-4 flex items-center justify-center">
              <div className="text-center">
                <Navigation className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Map View</p>
              </div>
            </div>
            
            {driverDeliveries.find(d => d.etat === EtatLivraison.EN_COURS) ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Order ID</span>
                  <span className="text-sm font-semibold text-gray-900">
                    #{driverDeliveries.find(d => d.etat === EtatLivraison.EN_COURS)?.orderId}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Destination</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {driverDeliveries.find(d => d.etat === EtatLivraison.EN_COURS)?.adresseDestination.ville}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">ETA</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatDate(driverDeliveries.find(d => d.etat === EtatLivraison.EN_COURS)?.dateLivraisonPrevue || '')}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <Clock className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No active deliveries</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activities Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
                <p className="text-sm text-gray-500 mt-1">Your latest shipment updates</p>
              </div>
              <div className="flex space-x-3">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Download className="h-4 w-4 inline mr-2" />
                  Export
                </button>
                <button 
                  onClick={() => navigate('/driver/deliveries')}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  View All
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destination</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Arrival Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Distance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentActivities.map((delivery) => (
                  <tr key={delivery.idLivraison} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">#{delivery.orderId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{delivery.adresseDestination.ville}</div>
                      <div className="text-xs text-gray-500">{delivery.adresseDestination.rue}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{formatDate(delivery.dateLivraisonPrevue)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">
                        {delivery.adresseOrigine.ville} → {delivery.adresseDestination.ville}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {delivery.distanceKm ? `${delivery.distanceKm} km` : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getStatusColor(delivery.etat)}`}>
                        {delivery.etat}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => navigate(`/driver/deliveries/${delivery.idLivraison}`)}
                          className="p-1 text-gray-400 hover:text-blue-600"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {delivery.etat === EtatLivraison.EN_COURS && (
                          <button
                            onClick={() => navigate(`/driver/deliveries/${delivery.idLivraison}/track`)}
                            className="p-1 text-gray-400 hover:text-green-600"
                          >
                            <Navigation className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {recentActivities.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No recent activities</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;