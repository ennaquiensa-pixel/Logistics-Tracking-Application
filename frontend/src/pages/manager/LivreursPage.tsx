import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Plus,
  MapPin,
  Phone,
  Mail,
  Star,
  Clock,
  Truck,
  Award,
  AlertTriangle,
  MoreVertical,
  Download,
  RefreshCw,
  Users,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { LivreurResponse } from "../../types/UserTypes";
import userService from "../../services/UserService";
import { toast } from "react-toastify";
import AddUser from "../../components/AddUser";
import SimpleLoader from "../../components/SimpleLoader"; // Import SimpleLoader

interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "offline" | "on_break" | "busy";
  vehicle: string;
  currentLocation: string;
  deliveriesCompleted: number;
  rating: number;
  onlineSince: string;
  performance: "excellent" | "good" | "average" | "needs_improvement";
}

const LivreursPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [performanceFilter, setPerformanceFilter] = useState<string>("all");
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [allDrivers, setAllDrivers] = useState<LivreurResponse[]>([]);
  const [loading, setLoading] = useState({
    drivers: true,
    actions: false,
  });
  
  // Add state for AddUser dialog
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  const roleColor = "#818CF8";

  // Function to fetch drivers (will be called after adding new user)
  const fetchDrivers = async () => {
    try {
      setLoading(prev => ({ ...prev, drivers: true }));
      const response = await userService.getAllLivreurs();
      setAllDrivers(response);
    } catch (error) {
      toast.error("Failed to fetch drivers data.");
      setAllDrivers([]);
    } finally {
      setLoading(prev => ({ ...prev, drivers: false }));
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  // Handle refresh button click
  const handleRefresh = async () => {
    try {
      setLoading(prev => ({ ...prev, actions: true }));
      await fetchDrivers();
      toast.success("Liste des livreurs actualisée!");
    } finally {
      setLoading(prev => ({ ...prev, actions: false }));
    }
  };

  // Handle adding new user
  const handleAddUser = () => {
    setIsAddUserOpen(true);
  };

  // Handle user added successfully
  const handleUserAdded = (newUser: any) => {
    toast.success("Livreur ajouté avec succès!");
    fetchDrivers(); // Refresh the list
    setIsAddUserOpen(false); // Close the dialog
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setIsAddUserOpen(false);
  };

  const filteredDrivers = allDrivers.filter((driver) => {
    const matchesSearch =
      driver.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.nombreLivraisonsEffectuees.toString().includes(searchTerm);

    // Apply status filter
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "active" && driver.active) ||
      (statusFilter === "offline" && !driver.active);

    // Apply performance filter based on rating
    const matchesPerformance = 
      performanceFilter === "all" ||
      (performanceFilter === "excellent" && driver.noteMoyenne >= 4.5) ||
      (performanceFilter === "good" && driver.noteMoyenne >= 4.0 && driver.noteMoyenne < 4.5) ||
      (performanceFilter === "average" && driver.noteMoyenne >= 3.0 && driver.noteMoyenne < 4.0) ||
      (performanceFilter === "needs_improvement" && driver.noteMoyenne < 3.0);

    return matchesSearch && matchesStatus && matchesPerformance;
  });

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "#10B981" : "#9CA3AF";
  };

  const getPerformanceColor = (rating: number) => {
    if (rating >= 4.5) return "#10B981";
    if (rating >= 4.0) return "#3B82F6";
    if (rating >= 3.0) return "#F59E0B";
    return "#EF4444";
  };

  const getPerformanceText = (rating: number) => {
    if (rating >= 4.5) return "Excellent";
    if (rating >= 4.0) return "Bon";
    if (rating >= 3.0) return "Moyen";
    return "À améliorer";
  };

  function generateMoroccanVehiculeId() {
    const number = Math.floor(Math.random() * 999999) + 1; // 1–6 digits
    const province = Math.floor(Math.random() * 12) + 1;   // 1–2 digits
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";          // Arabic version possible too
    const letter = letters[Math.floor(Math.random() * letters.length)];

    return `${number}-${province}-${letter}`;
  }

  const getStatusText = (isActive: boolean) => {
    return isActive ? "Actif" : "Hors ligne";
  };

  const stats = [
    {
      label: "Total Livreurs",
      value: loading.drivers ? <SimpleLoader size="small" /> : allDrivers.length,
      icon: Users,
      color: roleColor,
      loading: loading.drivers,
    },
    {
      label: "Actifs Maintenant",
      value: loading.drivers ? <SimpleLoader size="small" /> : allDrivers.filter((d) => d.active).length,
      icon: MapPin,
      color: "#10B981",
      loading: loading.drivers,
    },
    {
      label: "Livraisons Complétées",
      value: loading.drivers ? <SimpleLoader size="small" /> : allDrivers.reduce(
        (total, driver) => total + driver.nombreLivraisonsEffectuees,
        0
      ),
      icon: Truck,
      color: "#6366F1",
      loading: loading.drivers,
    },
    {
      label: "Note Moyenne",
      value: loading.drivers ? (
        <SimpleLoader size="small" />
      ) : allDrivers.length > 0 ? (
        (
          allDrivers.reduce(
            (total, driver) => total + driver.noteMoyenne,
            0
          ) / allDrivers.length
        ).toFixed(1)
      ) : "0.0",
      icon: Star,
      color: "#F59E0B",
      loading: loading.drivers,
    },
  ];

  // if (loading.drivers && allDrivers.length === 0) {
  //   return (
  //     <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
  //       <div className="absolute inset-0 bg-gradient-to-br from-[#E0E7FF]/5 via-white to-[#818CF8]/5"></div>
  //       <div className="relative z-10 text-center">
  //         <SimpleLoader />
  //         <p className="mt-4 text-lg" style={{ color: "#6b7280" }}>
  //           Chargement des livreurs...
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <>
      <div className="min-h-screen relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#E0E7FF]/5 via-white to-[#818CF8]/5"></div>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-float"
              style={{
                width: Math.random() * 40 + 10 + "px",
                height: Math.random() * 40 + 10 + "px",
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
                background: `radial-gradient(circle, ${
                  ["#E0E7FF", "#818CF8", "#6366F1"][i % 3]
                } 0%, transparent 70%)`,
                opacity: 0.1,
                filter: "blur(15px)",
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 p-4 sm:p-6 lg:p-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-3"
                style={{
                  backgroundColor: `${roleColor}15`,
                  color: roleColor,
                }}
              >
                <Users className="h-3 w-3" />
                <span>Gestion des Livreurs</span>
              </div>
              <h1
                className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2"
                style={{ color: "#1f2937" }}
              >
                Monitoring des Livreurs
              </h1>
              <p className="text-lg" style={{ color: "#6b7280" }}>
                Suivez les livreurs actifs et leurs performances en temps réel
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid rgba(224, 231, 255, 0.5)",
                  color: roleColor,
                  boxShadow: "0 4px 20px rgba(129, 140, 248, 0.1)",
                }}
                disabled={loading.actions || loading.drivers}
              >
                {loading.actions ? (
                  <>
                    <SimpleLoader size="small" />
                    <span>Actualisation...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    <span>Actualiser</span>
                  </>
                )}
              </button>
              <button
                onClick={handleAddUser}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: roleColor,
                  color: "#FFFFFF",
                  boxShadow: `0 4px 20px ${roleColor}40`,
                }}
              >
                <Plus className="h-4 w-4" />
                Ajouter Livreur
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {stats.map(({ icon: Icon, label, value, color, loading: statLoading }, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 transition-all duration-500 hover:scale-105 hover:shadow-xl group cursor-pointer"
                style={{
                  border: "1px solid rgba(224, 231, 255, 0.5)",
                  boxShadow: "0 10px 30px -10px rgba(129, 140, 248, 0.1)",
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                    style={{ backgroundColor: `${color}15` }}
                  >
                    <Icon className="h-6 w-6" style={{ color }} />
                  </div>
                </div>
                <div>
                  <p
                    className="text-sm font-medium mb-2"
                    style={{ color: "#6b7280" }}
                  >
                    {label}
                  </p>
                  <h2
                    className="text-2xl font-bold transition-all duration-500 group-hover:scale-110 min-h-[40px] flex items-center"
                    style={{ color: "#1f2937" }}
                  >
                    {value}
                  </h2>
                </div>
              </div>
            ))}
          </div>

          {/* Filters Section */}
          <div
            className="bg-white rounded-2xl p-6 mb-6"
            style={{
              border: "1px solid rgba(224, 231, 255, 0.5)",
              boxShadow: "0 10px 30px -10px rgba(129, 140, 248, 0.1)",
            }}
          >
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-hover:text-[#818CF8]" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom, email ou téléphone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#818CF8] focus:border-transparent group-hover:shadow-lg"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      border: "1px solid rgba(224, 231, 255, 0.5)",
                      color: "#1f2937",
                    }}
                    disabled={loading.drivers}
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex gap-4">
                <div className="relative group">
                  <Filter
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors group-hover:text-[#818CF8]"
                    style={{ color: "#9CA3AF" }}
                  />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-10 pr-8 py-3.5 rounded-xl appearance-none transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#818CF8] focus:border-transparent group-hover:shadow-lg"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      border: "1px solid rgba(224, 231, 255, 0.5)",
                      color: "#1f2937",
                      minWidth: "180px",
                    }}
                    disabled={loading.drivers}
                  >
                    <option value="all">Tous les Statuts</option>
                    <option value="active">Actif</option>
                    <option value="offline">Hors ligne</option>
                  </select>
                </div>

                <select
                  value={performanceFilter}
                  onChange={(e) => setPerformanceFilter(e.target.value)}
                  className="px-4 py-3.5 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#818CF8] focus:border-transparent hover:shadow-lg"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    border: "1px solid rgba(224, 231, 255, 0.5)",
                    color: "#1f2937",
                    minWidth: "200px",
                  }}
                  disabled={loading.drivers}
                >
                  <option value="all">Toutes Performances</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Bon</option>
                  <option value="average">Moyen</option>
                  <option value="needs_improvement">À améliorer</option>
                </select>

                <button
                  onClick={() => {
                    setPerformanceFilter("all");
                    setStatusFilter("all");
                    setSearchTerm("");
                  }}
                  className="flex items-center gap-2 px-4 py-3.5 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    border: "1px solid rgba(224, 231, 255, 0.5)",
                    color: roleColor,
                    boxShadow: "0 4px 20px rgba(129, 140, 248, 0.1)",
                  }}
                  disabled={loading.drivers}
                >
                  <Filter className="h-4 w-4" />
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>

          {/* Drivers Grid */}
          {loading.drivers ? (
            <div className="bg-white rounded-2xl p-12 text-center"
                 style={{
                   border: "1px solid rgba(224, 231, 255, 0.5)",
                   boxShadow: "0 10px 30px -10px rgba(129, 140, 248, 0.1)",
                 }}>
              <SimpleLoader />
              <p className="mt-4 text-lg" style={{ color: "#6b7280" }}>
                Chargement des livreurs...
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredDrivers.map((driver) => (
                  <div
                    key={driver.idUser}
                    className="bg-white rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-xl group cursor-pointer"
                    style={{
                      border: "1px solid rgba(224, 231, 255, 0.5)",
                      boxShadow: "0 10px 30px -10px rgba(129, 140, 248, 0.1)",
                    }}
                  >
                    {/* Driver Header */}
                    <div
                      className="p-6 border-b"
                      style={{ borderColor: "rgba(224, 231, 255, 0.5)" }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div
                            className="flex items-center justify-center w-14 h-14 rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                            style={{ backgroundColor: `${roleColor}15` }}
                          >
                            <span
                              className="font-semibold text-lg"
                              style={{ color: roleColor }}
                            >
                              {driver.nom
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div>
                            <h3
                              className="font-bold text-lg transition-colors duration-300 group-hover:text-[#818CF8]"
                              style={{ color: "#1f2937" }}
                            >
                              {driver.nom}
                            </h3>
                            <div className="flex items-center gap-2 mt-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{
                                  backgroundColor: getStatusColor(driver.active),
                                  boxShadow: `0 0 8px ${getStatusColor(
                                    driver.active
                                  )}40`,
                                }}
                              />
                              <span
                                className="text-sm font-medium px-3 py-1 rounded-full border"
                                style={{
                                  backgroundColor: `${getStatusColor(
                                    driver.active
                                  )}15`,
                                  borderColor: `${getStatusColor(driver.active)}30`,
                                  color: getStatusColor(driver.active),
                                }}
                              >
                                {getStatusText(driver.active)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button className="p-2 rounded-lg transition-all duration-300 hover:scale-110 hover:bg-gray-50">
                          <MoreVertical
                            className="h-5 w-5"
                            style={{ color: "#9CA3AF" }}
                          />
                        </button>
                      </div>

                      {/* Contact Info */}
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4" style={{ color: "#6b7280" }} />
                          <span className="text-sm" style={{ color: "#1f2937" }}>
                            {driver.telephone}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4" style={{ color: "#6b7280" }} />
                          <span
                            className="text-sm truncate"
                            style={{ color: "#1f2937" }}
                          >
                            {driver.email}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Driver Details */}
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        {/* Vehicle Info */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Truck className="h-4 w-4" style={{ color: "#9CA3AF" }} />
                            <span className="text-sm" style={{ color: "#6b7280" }}>
                              Véhicule
                            </span>
                          </div>
                          <p className="font-medium" style={{ color: "#1f2937" }}>
                            {generateMoroccanVehiculeId()}
                          </p>
                        </div>

                        {/* Rating */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Star className="h-4 w-4" style={{ color: "#9CA3AF" }} />
                            <span className="text-sm" style={{ color: "#6b7280" }}>
                              Note
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium" style={{ color: "#1f2937" }}>
                              {driver.noteMoyenne.toFixed(1)}
                            </span>
                            <span
                              className="text-xs px-2 py-1 rounded-full font-medium"
                              style={{
                                backgroundColor: `${getPerformanceColor(driver.noteMoyenne)}15`,
                                color: getPerformanceColor(driver.noteMoyenne),
                              }}
                            >
                              {getPerformanceText(driver.noteMoyenne)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                          <div className="text-sm mb-2" style={{ color: "#6b7280" }}>
                            Livraisons
                          </div>
                          <div
                            className="text-2xl font-bold transition-all duration-500 group-hover:scale-110"
                            style={{ color: roleColor }}
                          >
                            {driver.nombreLivraisonsEffectuees}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm mb-2" style={{ color: "#6b7280" }}>
                            Depuis
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" style={{ color: "#9CA3AF" }} />
                            <span className="font-medium" style={{ color: "#1f2937" }}>
                              {driver.active ? "Maintenant" : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div
                      className="p-4 border-t rounded-b-2xl"
                      style={{ borderColor: "rgba(224, 231, 255, 0.5)" }}
                    >
                      <div className="flex gap-3">
                        <Link
                          to="/dashboard/manager/map"
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                          style={{
                            backgroundColor: roleColor,
                            color: "#FFFFFF",
                            boxShadow: `0 4px 20px ${roleColor}40`,
                          }}
                        >
                          <MapPin className="h-4 w-4" />
                          Suivre
                        </Link>
                        <button
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            border: "1px solid rgba(224, 231, 255, 0.5)",
                            color: roleColor,
                            boxShadow: "0 4px 20px rgba(129, 140, 248, 0.1)",
                          }}
                        >
                          <Phone className="h-4 w-4" />
                          Appeler
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {filteredDrivers.length === 0 && (
                <div
                  className="bg-white rounded-2xl p-12 text-center"
                  style={{
                    border: "1px solid rgba(224, 231, 255, 0.5)",
                    boxShadow: "0 10px 30px -10px rgba(129, 140, 248, 0.1)",
                  }}
                >
                  <Truck
                    className="h-16 w-16 mx-auto mb-6"
                    style={{ color: "#E0E7FF" }}
                  />
                  <h3 className="text-xl font-bold mb-2" style={{ color: "#1f2937" }}>
                    Aucun livreur trouvé
                  </h3>
                  <p className="text-lg mb-6" style={{ color: "#6b7280" }}>
                    Essayez d'ajuster votre recherche ou vos filtres
                  </p>
                  <button
                    onClick={() => {
                      setPerformanceFilter("all");
                      setStatusFilter("all");
                      setSearchTerm("");
                    }}
                    className="px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                    style={{
                      backgroundColor: roleColor,
                      color: "#FFFFFF",
                      boxShadow: `0 4px 20px ${roleColor}40`,
                    }}
                  >
                    Réinitialiser les Filtres
                  </button>
                </div>
              )}
            </>
          )}

          {/* Map Integration */}
          <div
            className="bg-white rounded-2xl p-6 mt-8"
            style={{
              border: "1px solid rgba(224, 231, 255, 0.5)",
              boxShadow: "0 10px 30px -10px rgba(129, 140, 248, 0.1)",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold" style={{ color: "#1f2937" }}>
                Positions en Temps Réel
              </h2>
              <Link to="/dashboard/manager/map">
                <button
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    border: "1px solid rgba(224, 231, 255, 0.5)",
                    color: roleColor,
                    boxShadow: "0 4px 20px rgba(129, 140, 248, 0.1)",
                  }}
                >
                  <MapPin className="h-4 w-4" />
                  Voir Carte Complète
                </button>
              </Link>
            </div>
            <div className="bg-gradient-to-br from-[#E0E7FF]/10 to-[#818CF8]/10 rounded-xl h-64 flex items-center justify-center">
              <div className="text-center">
                <MapPin
                  className="h-16 w-16 mx-auto mb-6"
                  style={{ color: "#E0E7FF" }}
                />
                <p className="text-lg mb-2" style={{ color: "#6b7280" }}>
                  Carte interactive avec suivi en direct
                </p>
                <p className="text-sm" style={{ color: "#9CA3AF" }}>
                  Visualisez les positions des livreurs en temps réel
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add User Dialog */}
      <AddUser
        isOpen={isAddUserOpen}
        onClose={handleDialogClose}
        onUserAdded={handleUserAdded}
        defaultRole="LIVREUR"
        title="Ajouter un Nouveau Livreur"
        description="Créer un nouveau compte livreur dans le système"
        showRoleSelector={true}
        allowedRoles={['LIVREUR']} // Only allow LIVREUR role for this page
      />
    </>
  );
};

export default LivreursPage;