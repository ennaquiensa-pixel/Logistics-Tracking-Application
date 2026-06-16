import React, { useEffect, useState } from "react";
import { Search, Filter, Plus, Package, AlertTriangle, TrendingUp, TrendingDown, MapPin, Clock, BarChart3, Download, RefreshCw, Eye, Edit, MoreVertical, Truck } from "lucide-react";
import { wareHouseService } from "../../services/WareHouseService";
import type { WareHouseResponse } from "../../types/warehouseType/WarehouseResponse";
import { Button } from "../../components/ui/button";
import AddWarehouseDialog from "../../components/AddWarehouseDialog";

interface WarehouseItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  status: "adequate" | "low" | "out_of_stock" | "overstock";
  location: string;
  lastUpdated: string;
  value: number;
}

interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
  usedCapacity: number;
  items: number;
  status: "optimal" | "warning" | "critical";
  manager: string;
  lastInventory: string;
}

const WarehousePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);

  const [isAddWarehouseOpen, setIsAddWarehouseOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [allwarehouses , setAllwarehouses] = useState<number>(0)

useEffect(()=>{
   const getAllWarehouses = async () =>{
    try {
    const response = await wareHouseService.getAllWareHouses() ;
    setAllwarehouses(response.length) ;
   } catch (error) {
     console.log(error)
   }
   }

   getAllWarehouses()
} , [])

 const handleWarehouseAdded = async () => {
    
    try {
      const response = await wareHouseService.getAllWareHouses();
      setAllwarehouses(response.length);
    } catch (error) {
      console.log(error);
    }
  };



  const warehouses: Warehouse[] = [
    {
      id: "1",
      name: "Central Distribution Hub",
      location: "Casablanca Industrial Zone",
      capacity: 10000,
      usedCapacity: 7200,
      items: 2450,
      status: "optimal",
      manager: "Ahmed Benali",
      lastInventory: "2024-01-14"
    },
    {
      id: "2",
      name: "Northern Logistics Center",
      location: "Tangier Free Zone",
      capacity: 8000,
      usedCapacity: 6500,
      items: 1890,
      status: "warning",
      manager: "Fatima Zahra",
      lastInventory: "2024-01-13"
    },
    {
      id: "3",
      name: "Southern Storage Facility",
      location: "Marrakech Logistics Park",
      capacity: 6000,
      usedCapacity: 5800,
      items: 1560,
      status: "critical",
      manager: "Karim Mohamed",
      lastInventory: "2024-01-12"
    }
  ];

  const inventoryItems: WarehouseItem[] = [
    {
      id: "1",
      name: "Electronics - Smartphones",
      sku: "ELEC-SMP-001",
      category: "Electronics",
      currentStock: 450,
      minStock: 100,
      maxStock: 1000,
      status: "adequate",
      location: "Aisle 3, Shelf B",
      lastUpdated: "2024-01-15 14:30",
      value: 125000
    },
    {
      id: "2",
      name: "Fashion - Winter Jackets",
      sku: "FASH-WJT-002",
      category: "Fashion",
      currentStock: 85,
      minStock: 50,
      maxStock: 500,
      status: "low",
      location: "Aisle 1, Shelf C",
      lastUpdated: "2024-01-15 13:15",
      value: 42500
    },
    {
      id: "3",
      name: "Home Appliances - Refrigerators",
      sku: "HOME-REF-003",
      category: "Appliances",
      currentStock: 0,
      minStock: 10,
      maxStock: 100,
      status: "out_of_stock",
      location: "Aisle 5, Shelf A",
      lastUpdated: "2024-01-15 16:45",
      value: 0
    },
    {
      id: "4",
      name: "Sports Equipment - Treadmills",
      sku: "SPRT-TRD-004",
      category: "Sports",
      currentStock: 120,
      minStock: 20,
      maxStock: 80,
      status: "overstock",
      location: "Aisle 2, Shelf D",
      lastUpdated: "2024-01-15 11:20",
      value: 36000
    },
    {
      id: "5",
      name: "Office Supplies - Printers",
      sku: "OFF-PRT-005",
      category: "Office",
      currentStock: 65,
      minStock: 25,
      maxStock: 150,
      status: "adequate",
      location: "Aisle 4, Shelf B",
      lastUpdated: "2024-01-15 15:10",
      value: 19500
    }
  ];

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: WarehouseItem["status"]) => {
    switch (status) {
      case "adequate": return "bg-green-100 text-green-800 border-green-200";
      case "low": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "out_of_stock": return "bg-red-100 text-red-800 border-red-200";
      case "overstock": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: WarehouseItem["status"]) => {
    switch (status) {
      case "adequate": return <TrendingUp className="h-4 w-4" />;
      case "low": return <TrendingDown className="h-4 w-4" />;
      case "out_of_stock": return <AlertTriangle className="h-4 w-4" />;
      case "overstock": return <Package className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: WarehouseItem["status"]) => {
    switch (status) {
      case "adequate": return "Adequate";
      case "low": return "Low Stock";
      case "out_of_stock": return "Out of Stock";
      case "overstock": return "Overstock";
      default: return status;
    }
  };

  const getWarehouseStatusColor = (status: Warehouse["status"]) => {
    switch (status) {
      case "optimal": return "bg-green-100 text-green-800";
      case "warning": return "bg-yellow-100 text-yellow-800";
      case "critical": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getWarehouseStatusText = (status: Warehouse["status"]) => {
    switch (status) {
      case "optimal": return "Optimal";
      case "warning": return "Warning";
      case "critical": return "Critical";
      default: return status;
    }
  };

  const calculateCapacityPercentage = (used: number, total: number) => {
    return (used / total) * 100;
  };

  const stats = [
    { label: "Total Warehouses", value:allwarehouses, icon: MapPin, color: "blue", trend: "+1 this month" },
    { label: "Total Inventory Items", value: "5,900", icon: Package, color: "green", trend: "↗️ 12% growth" },
    { label: "Low Stock Alerts", value: "24", icon: AlertTriangle, color: "yellow", trend: "⚠️ Needs attention" },
    { label: "Inventory Value", value: "$2.3M", icon: BarChart3, color: "purple", trend: "↑ 8.5% increase" }
  ];

  const quickActions = [
    { label: "Add New Item", icon: Plus, color: "black" },
    { label: "Inventory Count", icon: Clipboard, color: "blue" },
    { label: "Stock Transfer", icon: Truck, color: "green" },
    { label: "Generate Report", icon: Download, color: "purple" }
  ];

  return (
    <div className="p-6 bg-black min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Warehouse Overview</h1>
          <p className="text-gray-400">
            Monitor stock levels, movements, and low inventory alerts across all facilities
          </p>
        </div>
        <div className="flex gap-3 mt-4 lg:mt-0">
          {/* <button className="flex items-center gap-2 border border-white text-white px-4 py-3 rounded-lg hover:bg-white hover:text-black transition-all duration-200">
            <RefreshCw className="h-5 w-5" />
            Refresh
          </button>
          <button className="flex items-center gap-2 border border-white text-white px-4 py-3 rounded-lg hover:bg-white hover:text-black transition-all duration-200">
            <Download className="h-5 w-5" />
            Export Report
          </button> */}
          
          {/* <button
          onClick={() => setIsOpen(true)}
           className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200 transform hover:scale-105">
            <Plus className="h-5 w-5" />
            New Warehouse
          </button> */}

           <button
            onClick={() => setIsAddWarehouseOpen(true)}
            className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="h-5 w-5" />
            New Warehouse
          </button>
        </div>
      </div>
    <AddWarehouseDialog
        open={isAddWarehouseOpen}
        onOpenChange={setIsAddWarehouseOpen}
        onWarehouseAdded={handleWarehouseAdded}
      />
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div 
            key={stat.label}
            className="bg-white p-6 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
              <span className="text-sm text-gray-500">{stat.trend}</span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-black">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
        <h2 className="text-xl font-semibold text-black mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={action.label}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
            >
              <div className={`p-2 bg-${action.color}-100 rounded-lg`}>
                <action.icon className={`h-5 w-5 text-${action.color}-600`} />
              </div>
              <span className="font-medium text-gray-900">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Warehouses Overview */}
      <div className="bg-white rounded-xl border border-gray-200 mb-6">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-black">Warehouse Facilities</h2>
          <button className="text-blue-600 hover:text-blue-700 font-medium">
            View All Warehouses
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {warehouses.map((warehouse) => (
              <div 
                key={warehouse.id}
                className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-black text-lg mb-1">{warehouse.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{warehouse.location}</span>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getWarehouseStatusColor(warehouse.status)}`}>
                    {getWarehouseStatusText(warehouse.status)}
                  </span>
                </div>

                {/* Capacity Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Capacity Usage</span>
                    <span>{warehouse.usedCapacity} / {warehouse.capacity} sq ft</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        warehouse.status === 'optimal' ? 'bg-green-500' : 
                        warehouse.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${calculateCapacityPercentage(warehouse.usedCapacity, warehouse.capacity)}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Items</div>
                    <div className="font-semibold text-black">{warehouse.items.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Manager</div>
                    <div className="font-semibold text-black">{warehouse.manager}</div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button className="flex-1 bg-black text-white py-2 px-3 rounded text-sm font-medium hover:bg-gray-800 transition-colors">
                    View Details
                  </button>
                  <button className="p-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory Management */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-black mb-2">Inventory Management</h2>
            <p className="text-gray-600">Monitor and manage stock levels across all items</p>
          </div>
          <div className="flex gap-3 mt-4 lg:mt-0">
            <button className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4" />
              Filters
            </button>
            <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
              <Plus className="h-4 w-4" />
              Add Item
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by item name, SKU, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="adequate">Adequate</option>
                <option value="low">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="overstock">Overstock</option>
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Appliances">Appliances</option>
                <option value="Sports">Sports</option>
                <option value="Office">Office</option>
              </select>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Item Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">SKU</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Stock Level</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Location</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Value</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-black">{item.name}</div>
                      <div className="text-sm text-gray-500">Last updated: {new Date(item.lastUpdated).toLocaleString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-gray-900">{item.sku}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900">{item.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-black">{item.currentStock} units</div>
                      <div className="text-xs text-gray-500">Min: {item.minStock} | Max: {item.maxStock}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                      <span className="text-sm font-medium">{getStatusText(item.status)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900">{item.location}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-black">${item.value.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-black transition-colors" title="View Details">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="Edit">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors" title="More Options">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No inventory items found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search criteria or filters</p>
            <button className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Add missing icon component
const Clipboard = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

export default WarehousePage;