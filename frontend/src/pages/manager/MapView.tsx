import React, { useState, useEffect, useRef } from "react";
import { 
  Search, 
  Filter, 
  Layers, 
  Navigation, 
  Truck, 
  Warehouse, 
  MapPin, 
  Users, 
  ZoomIn, 
  ZoomOut, 
  RefreshCw, 
  Download,
  Phone,
  Mail,
  Star,
  Clock,
  Award,
  Package,
  BarChart3
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { LivreurResponse } from "../../types/UserTypes";
import userService from "../../services/UserService";
import { toast } from "react-toastify";
import { wareHouseService } from "../../services/WareHouseService";
import type { WareHouseResponse } from "../../types/warehouseType/WarehouseResponse";

// Fix leaflet default icon
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface DeliveryEntity {
  id: number;
  orderNumber: string;
  latitude: number;
  longitude: number;
  status: "pending" | "in_progress" | "delivered" | "cancelled";
  driverId?: number;
  customerName: string;
}

// Custom marker icon creator
const createCustomIcon = (type: "driver" | "warehouse" | "delivery", status?: string, active?: boolean) => {
  let bgColor = "";
  let iconText = "";
  
  switch (type) {
    case "driver":
      if (status === "delivering") {
        bgColor = "#EF4444";
        iconText = "🚚";
      } else if (active) {
        bgColor = "#10B981";
        iconText = "🚚";
      } else {
        bgColor = "#9CA3AF";
        iconText = "🚚";
      }
      break;
    case "warehouse":
      bgColor = "#3B82F6";
      iconText = "🏭";
      break;
    case "delivery":
      bgColor = status === "in_progress" ? "#F59E0B" : "#6366F1";
      iconText = "📦";
      break;
    default:
      bgColor = "#9CA3AF";
      iconText = "📍";
  }

  return L.divIcon({
    html: `
      <div style="
        background-color: ${bgColor};
        width: 44px;
        height: 44px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 22px;
        border: 3px solid white;
        box-shadow: 0 4px 20px ${bgColor}40;
        transition: all 0.3s ease;
      ">
        ${iconText}
        ${type === "driver" && status === "delivering" ? 
          '<div style="position: absolute; top: -5px; right: -5px; width: 14px; height: 14px; background-color: #DC2626; border-radius: 50%; border: 2px solid white; animation: pulse 1.5s infinite;"></div>' 
          : ''}
      </div>
      <style>
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
        }
      </style>
    `,
    className: "custom-marker",
    iconSize: [44, 44],
    iconAnchor: [22, 44],
    popupAnchor: [0, -44],
  });
};

const MapView: React.FC = () => {
  const [selectedLayer, setSelectedLayer] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [zoomLevel, setZoomLevel] = useState(10);
  const mapRef = useRef<any>(null);
  const [center] = useState<[number, number]>([33.5731, -7.5898]);
  const moroccoBounds: [[number, number], [number, number]] = [
    [20.75, -17.50],
    [36.0, -1.0],
  ];
  
  const [allDrivers, setAllDrivers] = useState<LivreurResponse[]>([]);
  const [warehouses, setWarehouses] = useState<WareHouseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [deliveries] = useState<DeliveryEntity[]>([
    {
      id: 1,
      orderNumber: "ORD-001",
      latitude: 33.5720,
      longitude: -7.5950,
      status: "in_progress",
      driverId: 1,
      customerName: "Mohammed Ali"
    },
    {
      id: 2,
      orderNumber: "ORD-002",
      latitude: 33.5600,
      longitude: -7.6150,
      status: "pending",
      customerName: "Fatima Zahra"
    },
    {
      id: 3,
      orderNumber: "ORD-003",
      latitude: 33.5500,
      longitude: -7.5850,
      status: "in_progress",
      driverId: 2,
      customerName: "Karim Ahmed"
    }
  ]);

  const roleColor = "#818CF8";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [driversResponse, warehousesResponse] = await Promise.all([
          userService.getAllLivreurs(),
          wareHouseService.getAllWareHouses()
        ]);
        setAllDrivers(driversResponse);
        setWarehouses(warehousesResponse);
      } catch (error) {
        toast.error("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const filteredDrivers = allDrivers.filter(driver => {
    const matchesSearch = 
      driver.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.telephone.includes(searchTerm) ||
      driver.active === true;
    
    const matchesLayer = selectedLayer === "all" || selectedLayer === "driver";
    const hasCoordinates = driver.latitudeActuelle && driver.longitudeActuelle;
    
    return matchesSearch && matchesLayer && hasCoordinates;
  });

  const filteredWarehouses = warehouses.filter(warehouse => {
    const matchesSearch = 
      warehouse.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLayer = selectedLayer === "all" || selectedLayer === "warehouse";
    
    return matchesSearch && matchesLayer;
  });

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = 
      delivery.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLayer = selectedLayer === "all" || selectedLayer === "delivery";
    
    return matchesSearch && matchesLayer;
  });

  const getDriverStatus = (driver: LivreurResponse) => {
    if (!driver.active) return "offline";
    if (driver.disponibilite) return "active";
    return "delivering";
  };

  const getDriverStatusColor = (driver: LivreurResponse) => {
    const status = getDriverStatus(driver);
    switch (status) {
      case "active":
        return "#10B981";
      case "delivering":
        return "#EF4444";
      case "offline":
        return "#9CA3AF";
      default:
        return "#818CF8";
    }
  };

  const getDriverStatusText = (driver: LivreurResponse) => {
    const status = getDriverStatus(driver);
    switch (status) {
      case "active":
        return "Disponible";
      case "delivering":
        return "En Livraison";
      case "offline":
        return "Hors ligne";
      default:
        return "Inconnu";
    }
  };

  const getDeliveryStatusColor = (status: string) => {
    switch (status) {
      case "in_progress":
        return "#F59E0B";
      case "pending":
        return "#818CF8";
      case "delivered":
        return "#10B981";
      case "cancelled":
        return "#EF4444";
      default:
        return "#9CA3AF";
    }
  };

  const getDeliveryStatusText = (status: string) => {
    switch (status) {
      case "in_progress":
        return "En Cours";
      case "pending":
        return "En Attente";
      case "delivered":
        return "Livré";
      case "cancelled":
        return "Annulé";
      default:
        return status;
    }
  };

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.setZoom(mapRef.current.getZoom() + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.setZoom(mapRef.current.getZoom() - 1);
    }
  };

  const handleCenterOnEntity = (latitude: number, longitude: number) => {
    if (mapRef.current) {
      mapRef.current.flyTo([latitude, longitude], 15, {
        duration: 1.5
      });
    }
  };

  const handleRefresh = () => {
    setSearchTerm("");
    if (mapRef.current) {
      mapRef.current.flyTo(center, zoomLevel);
    }
  };

  const stats = {
    totalDrivers: allDrivers.length,
    activeDrivers: allDrivers.filter(d => d.active && d.disponibilite).length,
    deliveringDrivers: allDrivers.filter(d => d.active && !d.disponibilite).length,
    warehouses: warehouses.length,
    activeDeliveries: deliveries.filter(d => d.status === "in_progress").length,
    totalEntities: filteredDrivers.length + filteredWarehouses.length + filteredDeliveries.length,
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E0E7FF]/5 via-white to-[#818CF8]/5"></div>
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-6" style={{ borderColor: roleColor }}></div>
          <p className="text-lg" style={{ color: '#6b7280' }}>Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E0E7FF]/5 via-white to-[#818CF8]/5"></div>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: Math.random() * 40 + 10 + 'px',
              height: Math.random() * 40 + 10 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              background: `radial-gradient(circle, ${['#E0E7FF', '#818CF8', '#6366F1'][i % 3]} 0%, transparent 70%)`,
              opacity: 0.1,
              filter: 'blur(15px)',
              animationDelay: `${i * 0.3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-3"
                 style={{
                   backgroundColor: `${roleColor}15`,
                   color: roleColor
                 }}>
              <MapPin className="h-3 w-3" />
              <span>Carte Logistique</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2" style={{ color: '#1f2937' }}>
              Carte en Temps Réel
            </h1>
            <p className="text-lg" style={{ color: '#6b7280' }}>
              Suivi des livreurs, entrepôts et livraisons à Casablanca
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(224, 231, 255, 0.5)',
                color: roleColor,
                boxShadow: '0 4px 20px rgba(129, 140, 248, 0.1)'
              }}
            >
              <RefreshCw className="h-4 w-4" />
              Actualiser
            </button>
            <button 
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: roleColor,
                color: '#FFFFFF',
                boxShadow: `0 4px 20px ${roleColor}40`
              }}
            >
              <Download className="h-4 w-4" />
              Exporter
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-8">
          {[
            { label: "Total Livreurs", value: stats.totalDrivers, icon: Users, color: roleColor },
            { label: "Disponibles", value: stats.activeDrivers, icon: Truck, color: "#10B981" },
            { label: "En Livraison", value: stats.deliveringDrivers, icon: Package, color: "#EF4444" },
            { label: "Entrepôts", value: stats.warehouses, icon: Warehouse, color: "#3B82F6" },
            { label: "Livraisons Actives", value: stats.activeDeliveries, icon: Clock, color: "#F59E0B" }
          ].map(({ icon: Icon, label, value, color }, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 transition-all duration-500 hover:scale-105 hover:shadow-xl group cursor-pointer"
              style={{
                border: '1px solid rgba(224, 231, 255, 0.5)',
                boxShadow: '0 10px 30px -10px rgba(129, 140, 248, 0.1)'
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                     style={{ backgroundColor: `${color}15` }}>
                  <Icon className="h-6 w-6" style={{ color }} />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: '#6b7280' }}>{label}</p>
                <h2 className="text-2xl font-bold transition-all duration-500 group-hover:scale-110" 
                     style={{ color: '#1f2937' }}>
                  {value}
                </h2>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Sidebar Controls */}
          <div className="xl:col-span-1 space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-2xl p-6"
                 style={{
                   border: '1px solid rgba(224, 231, 255, 0.5)',
                   boxShadow: '0 10px 30px -10px rgba(129, 140, 248, 0.1)'
                 }}>
              <h2 className="text-lg font-bold mb-6" style={{ color: '#1f2937' }}>
                Contrôles de la Carte
              </h2>
              
              {/* Search */}
              <div className="mb-6">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-hover:text-[#818CF8]" />
                  <input
                    type="text"
                    placeholder="Rechercher livreurs, entrepôts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#818CF8] focus:border-transparent group-hover:shadow-lg"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid rgba(224, 231, 255, 0.5)',
                      color: '#1f2937'
                    }}
                  />
                </div>
              </div>

              {/* Layers Filter */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Layers className="h-4 w-4" style={{ color: roleColor }} />
                  <label className="text-sm font-medium" style={{ color: '#6b7280' }}>
                    Couches de la Carte
                  </label>
                </div>
                <select
                  value={selectedLayer}
                  onChange={(e) => setSelectedLayer(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#818CF8] focus:border-transparent hover:shadow-lg"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid rgba(224, 231, 255, 0.5)',
                    color: '#1f2937'
                  }}
                >
                  <option value="all">Toutes les Entités</option>
                  <option value="driver">Livreurs Seulement</option>
                  <option value="warehouse">Entrepôts Seulement</option>
                  <option value="delivery">Livraisons Seulement</option>
                </select>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium" style={{ color: '#6b7280' }}>
                  Statistiques Rapides
                </h3>
                {[
                  { label: "Livreurs Disponibles", value: stats.activeDrivers, color: "#10B981", icon: Truck },
                  { label: "Entrepôts", value: stats.warehouses, color: "#3B82F6", icon: Warehouse },
                  { label: "En Livraison", value: stats.deliveringDrivers, color: "#EF4444", icon: Clock },
                  { label: "Entités Total", value: stats.totalEntities, color: roleColor, icon: Users }
                ].map((stat, index) => (
                  <div key={index} 
                       className="flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:scale-105 group cursor-pointer"
                       style={{
                         backgroundColor: 'rgba(255, 255, 255, 0.9)',
                         border: '1px solid rgba(224, 231, 255, 0.5)',
                         boxShadow: '0 4px 20px rgba(129, 140, 248, 0.1)'
                       }}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                           style={{ backgroundColor: `${stat.color}15` }}>
                        <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
                      </div>
                      <span className="text-sm font-medium" style={{ color: '#6b7280' }}>{stat.label}</span>
                    </div>
                    <span className="font-bold" style={{ color: '#1f2937' }}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Entities List */}
            <div className="bg-white rounded-2xl p-6"
                 style={{
                   border: '1px solid rgba(224, 231, 255, 0.5)',
                   boxShadow: '0 10px 30px -10px rgba(129, 140, 248, 0.1)'
                 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold" style={{ color: '#1f2937' }}>
                  Entités Actives
                </h2>
                <span className="text-sm font-medium px-3 py-1.5 rounded-full"
                      style={{
                        backgroundColor: `${roleColor}15`,
                        color: roleColor
                      }}>
                  {stats.totalEntities}
                </span>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {/* Drivers */}
                {filteredDrivers.map((driver) => (
                  <div
                    key={driver.idUser}
                    className="flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:scale-105 group cursor-pointer"
                    onClick={() => handleCenterOnEntity(driver.latitudeActuelle!, driver.longitudeActuelle!)}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid rgba(224, 231, 255, 0.5)',
                      boxShadow: '0 4px 20px rgba(129, 140, 248, 0.1)'
                    }}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110"
                           style={{ backgroundColor: getDriverStatusColor(driver) }}>
                        <Truck className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm truncate transition-colors duration-300 group-hover:text-[#818CF8]"
                           style={{ color: '#1f2937' }}>
                        {driver.nom}
                      </div>
                      <div className="flex items-center gap-2 text-xs mt-1">
                        <span className="font-medium px-2 py-1 rounded-full"
                              style={{
                                backgroundColor: `${getDriverStatusColor(driver)}15`,
                                color: getDriverStatusColor(driver)
                              }}>
                          {getDriverStatusText(driver)}
                        </span>
                        <span className="flex items-center gap-1" style={{ color: '#6b7280' }}>
                          <Star className="h-3 w-3" style={{ color: '#F59E0B' }} />
                          {driver.noteMoyenne.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <Navigation className="h-4 w-4 flex-shrink-0 transition-all duration-300 group-hover:scale-110" 
                               style={{ color: roleColor }} />
                  </div>
                ))}

                {/* Warehouses */}
                {filteredWarehouses.map((warehouse) => (
                  <div
                    key={warehouse.idEntrepot}
                    className="flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:scale-105 group cursor-pointer"
                    onClick={() => handleCenterOnEntity(warehouse.adresse.latitude, warehouse.adresse.longitude)}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid rgba(224, 231, 255, 0.5)',
                      boxShadow: '0 4px 20px rgba(129, 140, 248, 0.1)'
                    }}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110"
                           style={{ backgroundColor: "#3B82F6" }}>
                        <Warehouse className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm truncate transition-colors duration-300 group-hover:text-[#3B82F6]"
                           style={{ color: '#1f2937' }}>
                        {warehouse.nom}
                      </div>
                      <div className="text-xs mt-1" style={{ color: '#6b7280' }}>
                        {warehouse.capaciteDisponible.toLocaleString()} / {warehouse.capaciteActuelle.toLocaleString()} m²
                      </div>
                    </div>
                    <Navigation className="h-4 w-4 flex-shrink-0 transition-all duration-300 group-hover:scale-110" 
                               style={{ color: "#3B82F6" }} />
                  </div>
                ))}

                {/* Deliveries */}
                {filteredDeliveries.map((delivery) => (
                  <div
                    key={delivery.id}
                    className="flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:scale-105 group cursor-pointer"
                    onClick={() => handleCenterOnEntity(delivery.latitude, delivery.longitude)}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid rgba(224, 231, 255, 0.5)',
                      boxShadow: '0 4px 20px rgba(129, 140, 248, 0.1)'
                    }}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110"
                           style={{ backgroundColor: getDeliveryStatusColor(delivery.status) }}>
                        <MapPin className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm truncate transition-colors duration-300 group-hover:text-[#818CF8]"
                           style={{ color: '#1f2937' }}>
                        {delivery.orderNumber}
                      </div>
                      <div className="text-xs mt-1">
                        <span className="font-medium px-2 py-1 rounded-full mr-2"
                              style={{
                                backgroundColor: `${getDeliveryStatusColor(delivery.status)}15`,
                                color: getDeliveryStatusColor(delivery.status)
                              }}>
                          {getDeliveryStatusText(delivery.status)}
                        </span>
                        <span style={{ color: '#6b7280' }}>{delivery.customerName}</span>
                      </div>
                    </div>
                    <Navigation className="h-4 w-4 flex-shrink-0 transition-all duration-300 group-hover:scale-110" 
                               style={{ color: getDeliveryStatusColor(delivery.status) }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map Container */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-2xl p-6"
                 style={{
                   border: '1px solid rgba(224, 231, 255, 0.5)',
                   boxShadow: '0 10px 30px -10px rgba(129, 140, 248, 0.1)'
                 }}>
              {/* Map Header */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
                <div>
                  <h2 className="text-lg font-bold mb-2" style={{ color: '#1f2937' }}>
                    Réseau Logistique de Casablanca
                  </h2>
                  <p className="text-sm" style={{ color: '#6b7280' }}>
                    Suivi en temps réel de toutes les opérations logistiques
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 mt-4 lg:mt-0">
                  {[
                    { color: "#10B981", label: "Disponible" },
                    { color: "#EF4444", label: "En Livraison" },
                    { color: "#3B82F6", label: "Entrepôt" },
                    { color: "#F59E0B", label: "Livraison" },
                    { color: "#9CA3AF", label: "Hors ligne" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span style={{ color: '#6b7280' }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real Map */}
              <div className="relative rounded-xl h-[500px] lg:h-[600px] overflow-hidden">
                <div className="absolute inset-0 rounded-xl overflow-hidden border"
                     style={{ borderColor: 'rgba(224, 231, 255, 0.5)' }}>
                  <MapContainer
                    bounds={moroccoBounds}
                    center={center}
                    zoom={zoomLevel}
                    style={{ height: "100%", width: "100%" }}
                    scrollWheelZoom={true}
                    // whenCreated={(mapInstance) => {
                    //   mapRef.current = mapInstance;
                    // }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {/* Driver markers */}
                    {filteredDrivers.map((driver) => (
                      <Marker
                        key={`driver-${driver.idUser}`}
                        position={[driver.latitudeActuelle!, driver.longitudeActuelle!]}
                        icon={createCustomIcon("driver", getDriverStatus(driver), driver.active)}
                      >
                        <Popup className="custom-popup">
                          <div className="p-4 min-w-[240px]">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                                   style={{ backgroundColor: getDriverStatusColor(driver) }}>
                                <Truck className="w-6 h-6" />
                              </div>
                              <div>
                                <h3 className="font-bold text-lg" style={{ color: '#1f2937' }}>{driver.nom}</h3>
                                <span className="text-sm font-medium px-2 py-1 rounded-full"
                                      style={{
                                        backgroundColor: `${getDriverStatusColor(driver)}15`,
                                        color: getDriverStatusColor(driver)
                                      }}>
                                  {getDriverStatusText(driver)}
                                </span>
                              </div>
                            </div>
                            
                            <div className="space-y-3 text-sm">
                              <div className="flex items-center gap-2" style={{ color: '#6b7280' }}>
                                <Phone className="h-4 w-4" />
                                <span>{driver.telephone}</span>
                              </div>
                              <div className="flex items-center gap-2" style={{ color: '#6b7280' }}>
                                <Mail className="h-4 w-4" />
                                <span className="truncate">{driver.email}</span>
                              </div>
                              <div className="flex items-center gap-2" style={{ color: '#6b7280' }}>
                                <Star className="h-4 w-4" style={{ color: '#F59E0B' }} />
                                <span>Note: {driver.noteMoyenne.toFixed(1)}/5</span>
                              </div>
                              <div className="flex items-center gap-2" style={{ color: '#6b7280' }}>
                                <Award className="h-4 w-4" style={{ color: roleColor }} />
                                <span>Livraisons: {driver.nombreLivraisonsEffectuees}</span>
                              </div>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                    
                    {/* Warehouse markers */}
                    {filteredWarehouses.map((warehouse) => (
                      <Marker
                        key={`warehouse-${warehouse.idEntrepot}`}
                        position={[warehouse.adresse.latitude, warehouse.adresse.longitude]}
                        icon={createCustomIcon("warehouse")}
                      >
                        <Popup className="custom-popup">
                          <div className="p-4 min-w-[240px]">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                                   style={{ backgroundColor: "#3B82F6" }}>
                                <Warehouse className="w-6 h-6" />
                              </div>
                              <h3 className="font-bold text-lg" style={{ color: '#1f2937' }}>{warehouse.nom}</h3>
                            </div>
                            
                            <div className="space-y-3 text-sm">
                              <div className="text-sm" style={{ color: '#6b7280' }}>
                                <div className="font-medium mb-2">Capacité: {warehouse.capaciteDisponible.toLocaleString()} / {warehouse.capaciteActuelle.toLocaleString()} m²</div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div 
                                    className="h-2.5 rounded-full" 
                                    style={{ 
                                      width: `${(warehouse.capaciteMax / warehouse.capaciteActuelle) * 100}%`,
                                      backgroundColor: "#3B82F6"
                                    }}
                                  ></div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2" style={{ color: '#6b7280' }}>
                                <Phone className="h-4 w-4" />
                                <span>{warehouse.telephone}</span>
                              </div>
                              <div className="flex items-center gap-2" style={{ color: '#6b7280' }}>
                                <Mail className="h-4 w-4" />
                                <span className="truncate">{warehouse.email}</span>
                              </div>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                    
                    {/* Delivery markers */}
                    {filteredDeliveries.map((delivery) => (
                      <Marker
                        key={`delivery-${delivery.id}`}
                        position={[delivery.latitude, delivery.longitude]}
                        icon={createCustomIcon("delivery", delivery.status)}
                      >
                        <Popup className="custom-popup">
                          <div className="p-4 min-w-[240px]">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                                   style={{ backgroundColor: getDeliveryStatusColor(delivery.status) }}>
                                <MapPin className="w-6 h-6" />
                              </div>
                              <div>
                                <h3 className="font-bold text-lg" style={{ color: '#1f2937' }}>{delivery.orderNumber}</h3>
                                <span className="text-sm font-medium px-2 py-1 rounded-full"
                                      style={{
                                        backgroundColor: `${getDeliveryStatusColor(delivery.status)}15`,
                                        color: getDeliveryStatusColor(delivery.status)
                                      }}>
                                  {getDeliveryStatusText(delivery.status)}
                                </span>
                              </div>
                            </div>
                            
                            <div className="space-y-3 text-sm">
                              <div className="text-sm" style={{ color: '#6b7280' }}>
                                <div className="font-medium">Client: {delivery.customerName}</div>
                                {delivery.driverId && (
                                  <div className="mt-2">Livreur ID: {delivery.driverId}</div>
                                )}
                              </div>
                              <button 
                                onClick={() => window.open(`https://www.google.com/maps?q=${delivery.latitude},${delivery.longitude}`, '_blank')}
                                className="text-sm font-medium transition-all duration-300 hover:scale-105"
                                style={{ color: roleColor }}
                              >
                                Voir l'emplacement →
                              </button>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>

                  {/* Custom Zoom Controls */}
                  <div className="absolute top-6 right-6 flex flex-col gap-3 z-[1000]">
                    <button
                      onClick={handleZoomIn}
                      className="p-3 rounded-xl transition-all duration-300 hover:scale-110"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid rgba(224, 231, 255, 0.5)',
                        boxShadow: '0 4px 20px rgba(129, 140, 248, 0.1)',
                        color: roleColor
                      }}
                    >
                      <ZoomIn className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleZoomOut}
                      className="p-3 rounded-xl transition-all duration-300 hover:scale-110"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid rgba(224, 231, 255, 0.5)',
                        boxShadow: '0 4px 20px rgba(129, 140, 248, 0.1)',
                        color: roleColor
                      }}
                    >
                      <ZoomOut className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Coordinates Display */}
                  <div className="absolute bottom-6 right-6 px-4 py-3 rounded-xl text-sm z-[1000]"
                       style={{
                         backgroundColor: 'rgba(255, 255, 255, 0.95)',
                         border: '1px solid rgba(224, 231, 255, 0.5)',
                         boxShadow: '0 4px 20px rgba(129, 140, 248, 0.1)',
                         color: '#1f2937'
                       }}>
                    {center[0].toFixed(4)}° N, {center[1].toFixed(4)}° W
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;