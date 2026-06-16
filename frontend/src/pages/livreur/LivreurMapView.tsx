import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  Navigation, 
  Package, 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  MessageCircle,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Layers,
  Compass
} from "lucide-react";

interface MapEntity {
  id: string;
  type: "delivery" | "pickup" | "warehouse" | "driver";
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  status: "pending" | "in_progress" | "completed" | "next";
  priority: "low" | "medium" | "high";
  scheduledTime?: string;
  customerPhone?: string;
  estimatedDuration?: string;
}

const LivreurMapView: React.FC = () => {
  const [selectedLayer, setSelectedLayer] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [zoomLevel, setZoomLevel] = useState(12);
  const [selectedEntity, setSelectedEntity] = useState<MapEntity | null>(null);
  const [currentLocation, setCurrentLocation] = useState({ lat: 33.5731, lng: -7.5898 });

  // Mock data for map entities (Casablanca coordinates)
  const mapEntities: MapEntity[] = [
    // Current deliveries
    {
      id: "1",
      type: "delivery",
      name: "Ahmed Benali",
      address: "123 Downtown Street, Casablanca",
      latitude: 33.5720,
      longitude: -7.5950,
      status: "in_progress",
      priority: "high",
      scheduledTime: "14:30",
      customerPhone: "+212 612-345-678",
      estimatedDuration: "15 min"
    },
    {
      id: "2",
      type: "delivery",
      name: "Fatima Zahra",
      address: "456 Business District, Casablanca",
      latitude: 33.5680,
      longitude: -7.6150,
      status: "next",
      priority: "medium",
      scheduledTime: "15:15",
      customerPhone: "+212 623-456-789",
      estimatedDuration: "25 min"
    },
    {
      id: "3",
      type: "delivery",
      name: "Karim Mohamed",
      address: "789 Residential Area, Casablanca",
      latitude: 33.5780,
      longitude: -7.5850,
      status: "pending",
      priority: "low",
      scheduledTime: "16:00",
      customerPhone: "+212 634-567-890",
      estimatedDuration: "20 min"
    },
    // Pickup locations
    {
      id: "4",
      type: "pickup",
      name: "Warehouse A",
      address: "Central Distribution Hub, Casablanca",
      latitude: 33.5652,
      longitude: -7.6012,
      status: "pending",
      priority: "high"
    },
    {
      id: "5",
      type: "pickup",
      name: "Retail Partner",
      address: "City Center Mall, Casablanca",
      latitude: 33.5750,
      longitude: -7.6050,
      status: "pending",
      priority: "medium"
    },
    // Warehouse
    {
      id: "6",
      type: "warehouse",
      name: "Main Hub",
      address: "Industrial Zone, Casablanca",
      latitude: 33.5600,
      longitude: -7.5900,
      status: "completed",
      priority: "low"
    }
  ];

  const filteredEntities = mapEntities.filter(entity => {
    const matchesSearch = entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entity.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLayer = selectedLayer === "all" || entity.type === selectedLayer;
    return matchesSearch && matchesLayer;
  });

  const getEntityIcon = (type: MapEntity["type"], status: MapEntity["status"]) => {
    const baseClass = "w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg transform hover:scale-110 transition-transform cursor-pointer";
    
    switch (type) {
      case "delivery":
        const deliveryColor = status === "in_progress" ? "bg-red-500 border-2 border-white" :
                            status === "next" ? "bg-orange-500 border-2 border-white" :
                            status === "pending" ? "bg-yellow-500" : "bg-green-500";
        return (
          <div className={`${baseClass} ${deliveryColor}`} title="Delivery">
            <Package className="w-4 h-4" />
          </div>
        );
      case "pickup":
        return (
          <div className={`${baseClass} bg-blue-500 border-2 border-white`} title="Pickup">
            <MapPin className="w-4 h-4" />
          </div>
        );
      case "warehouse":
        return (
          <div className={`${baseClass} bg-purple-500`} title="Warehouse">
            <Compass className="w-4 h-4" />
          </div>
        );
      case "driver":
        return (
          <div className={`${baseClass} bg-black border-2 border-green-500`} title="Your Location">
            <User className="w-4 h-4" />
          </div>
        );
      default:
        return <div className={`${baseClass} bg-gray-500`}>?</div>;
    }
  };

  const getStatusColor = (status: MapEntity["status"]) => {
    switch (status) {
      case "in_progress": return "text-red-500";
      case "next": return "text-orange-500";
      case "pending": return "text-yellow-500";
      case "completed": return "text-green-500";
      default: return "text-gray-500";
    }
  };

  const getStatusText = (status: MapEntity["status"]) => {
    switch (status) {
      case "in_progress": return "In Progress";
      case "next": return "Next Stop";
      case "pending": return "Pending";
      case "completed": return "Completed";
      default: return status;
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 1, 8));
  };

  const handleEntityClick = (entity: MapEntity) => {
    setSelectedEntity(entity);
  };

  const handleStartNavigation = (entity: MapEntity) => {
    console.log(`Starting navigation to: ${entity.name}`);
    // Implement navigation logic
  };

  const handleCallCustomer = (phone: string) => {
    console.log(`Calling: ${phone}`);
    // Implement call functionality
  };

  const handleMessageCustomer = (phone: string) => {
    console.log(`Messaging: ${phone}`);
    // Implement messaging functionality
  };

  const simulateLocationUpdate = () => {
    // Simulate slight location change for demo
    setCurrentLocation(prev => ({
      lat: prev.lat + (Math.random() - 0.5) * 0.001,
      lng: prev.lng + (Math.random() - 0.5) * 0.001
    }));
  };

  return (
    <div className="p-6 bg-black min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Delivery Map</h1>
          <p className="text-gray-400">
            Real-time tracking of your delivery route and stops in Casablanca
          </p>
        </div>
        <div className="flex gap-3 mt-4 lg:mt-0">
          <button 
            onClick={simulateLocationUpdate}
            className="flex items-center gap-2 border border-white text-white px-4 py-3 rounded-lg hover:bg-white hover:text-black transition-all duration-200"
          >
            <RefreshCw className="h-5 w-5" />
            Update Location
          </button>
          <button className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200">
            <Navigation className="h-5 w-5" />
            Start Route
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Sidebar Controls */}
        <div className="xl:col-span-1 space-y-6">
          {/* Search and Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-black mb-4">Map Controls</h2>
            
            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>

            {/* Layers Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Layers className="h-4 w-4 inline mr-2" />
                Map Layers
              </label>
              <select
                value={selectedLayer}
                onChange={(e) => setSelectedLayer(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="all">All Stops</option>
                <option value="delivery">Deliveries Only</option>
                <option value="pickup">Pickups Only</option>
                <option value="warehouse">Warehouses</option>
              </select>
            </div>

            {/* Quick Stats */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-gray-700">In Progress</span>
                </div>
                <span className="font-semibold text-black">1</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-orange-600" />
                  <span className="text-sm text-gray-700">Next Stops</span>
                </div>
                <span className="font-semibold text-black">2</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-gray-700">Pending</span>
                </div>
                <span className="font-semibold text-black">3</span>
              </div>
            </div>
          </div>

          {/* Stops List */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-black mb-4">Today's Route</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredEntities.map((entity) => (
                <div
                  key={entity.id}
                  onClick={() => handleEntityClick(entity)}
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedEntity?.id === entity.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {getEntityIcon(entity.type, entity.status)}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-black text-sm truncate">
                      {entity.name}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <span className={getStatusColor(entity.status)}>
                        {getStatusText(entity.status)}
                      </span>
                      {entity.scheduledTime && <span>• {entity.scheduledTime}</span>}
                      {entity.estimatedDuration && <span>• {entity.estimatedDuration}</span>}
                    </div>
                  </div>
                  <Navigation className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="xl:col-span-3">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {/* Map Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold text-black">Casablanca Delivery Route</h2>
                <p className="text-gray-600 text-sm">Live tracking of your current deliveries and route</p>
              </div>
              <div className="flex items-center gap-4 mt-2 lg:mt-0">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-3 h-3 bg-red-500 rounded-full border border-white"></div>
                  <span>Current</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-3 h-3 bg-orange-500 rounded-full border border-white"></div>
                  <span>Next</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Pending</span>
                </div>
              </div>
            </div>

            {/* Map Visualization */}
            <div className="relative bg-gray-100 rounded-lg h-[600px] overflow-hidden border border-gray-300">
              {/* Mock Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
                {/* Mock roads */}
                <div className="absolute top-1/4 left-0 right-0 h-2 bg-gray-400"></div>
                <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-400"></div>
                <div className="absolute top-3/4 left-0 right-0 h-2 bg-gray-400"></div>
                <div className="absolute left-1/4 top-0 bottom-0 w-2 bg-gray-400"></div>
                <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-gray-400"></div>
                <div className="absolute left-3/4 top-0 bottom-0 w-2 bg-gray-400"></div>
                
                {/* Mock entities on map */}
                {filteredEntities.map((entity) => (
                  <div
                    key={entity.id}
                    onClick={() => handleEntityClick(entity)}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                    style={{
                      left: `${((entity.longitude + 7.63) / 0.08) * 100}%`,
                      top: `${((33.59 - entity.latitude) / 0.08) * 100}%`
                    }}
                  >
                    {getEntityIcon(entity.type, entity.status)}
                  </div>
                ))}

                {/* Current location marker */}
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${((currentLocation.lng + 7.63) / 0.08) * 100}%`,
                    top: `${((33.59 - currentLocation.lat) / 0.08) * 100}%`
                  }}
                >
                  <div className="w-10 h-10 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    Your Location
                  </div>
                </div>

                {/* Route lines (simplified) */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Simple route visualization */}
                  <svg className="w-full h-full">
                    <line 
                      x1="50%" y1="50%" 
                      x2={`${((mapEntities[0].longitude + 7.63) / 0.08) * 100}%`} 
                      y2={`${((33.59 - mapEntities[0].latitude) / 0.08) * 100}%`}
                      stroke="#3b82f6" 
                      strokeWidth="2" 
                      strokeDasharray="5,5"
                    />
                  </svg>
                </div>
              </div>

              {/* Zoom Controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={handleZoomIn}
                  className="p-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <ZoomIn className="h-5 w-5 text-gray-700" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <ZoomOut className="h-5 w-5 text-gray-700" />
                </button>
              </div>

              {/* Map Scale */}
              <div className="absolute bottom-4 left-4 bg-white px-3 py-2 rounded-lg border border-gray-300 shadow-sm">
                <div className="text-sm text-gray-700">
                  Zoom: {zoomLevel}x • Scale: 1:{(100000 / Math.pow(2, zoomLevel - 8)).toLocaleString()}
                </div>
              </div>

              {/* Coordinates Display */}
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded-lg text-sm">
                {currentLocation.lat.toFixed(4)}° N, {currentLocation.lng.toFixed(4)}° W
              </div>
            </div>

            {/* Selected Entity Details */}
            {selectedEntity && (
              <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getEntityIcon(selectedEntity.type, selectedEntity.status)}
                      <div>
                        <h3 className="font-semibold text-black text-lg">{selectedEntity.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${getStatusColor(selectedEntity.status)}`}>
                            {getStatusText(selectedEntity.status)}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            selectedEntity.priority === 'high' ? 'bg-red-100 text-red-800' :
                            selectedEntity.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {selectedEntity.priority.toUpperCase()} PRIORITY
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">{selectedEntity.address}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      {selectedEntity.scheduledTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {selectedEntity.scheduledTime}
                        </span>
                      )}
                      {selectedEntity.estimatedDuration && (
                        <span>Est: {selectedEntity.estimatedDuration}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedEntity.customerPhone && (
                      <>
                        <button 
                          onClick={() => handleCallCustomer(selectedEntity.customerPhone!)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Call Customer"
                        >
                          <Phone className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleMessageCustomer(selectedEntity.customerPhone!)}
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          title="Message Customer"
                        >
                          <MessageCircle className="h-5 w-5" />
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => handleStartNavigation(selectedEntity)}
                      className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                    >
                      <Navigation className="h-4 w-4" />
                      Navigate
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivreurMapView;