import { Link } from "react-router-dom";
import { LogOut, LayoutDashboard, Users, User, Truck, Package, BarChart3, Bell, Map, Home, Tag } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const { user, logout } = useAuth();
  const [active, setActive] = useState("");
  
  const handleLogout = () => {
    logout();
    toggleSidebar();
  };

  const navigationLinks = [
    { to: "/dashboard", label: "Overview", icon: <LayoutDashboard className="h-5 w-5" />, role: "ADMIN" },
    // { to: "/dashboard/users", label: "Users", icon: <Users className="h-5 w-5" />, role: "ADMIN" },
    // { to: "/dashboard/clients", label: "Clients", icon: <User className="h-5 w-5" />, role: "ADMIN" },
    { to: "/dashboard/products", label: "products", icon: <Tag className="h-5 w-5" />, role: "ADMIN" },

    { to: "/dashboard/map", label: "Live Map", icon: <Map className="h-5 w-5" />, role: "ADMIN" },

    { to: "/dashboard/manager", label: "Overview", icon: <LayoutDashboard className="h-5 w-5" />, role: "MANAGER" },
    { to: "/dashboard/manager/deliveries", label: "Deliveries", icon: <Package className="h-5 w-5" />, role: "MANAGER" },
    { to: "/dashboard/manager/livreurs", label: "Livreurs", icon: <Truck className="h-5 w-5" />, role: "MANAGER" },
    // { to: "/dashboard/manager/analytics", label: "Analytics & Reports", icon: <BarChart3 className="h-5 w-5" />, role: "MANAGER" },
    // { to: "/dashboard/manager/notifications", label: "Notifications", icon: <Bell className="h-5 w-5" />, role: "MANAGER" },
    { to: "/dashboard/manager/products", label: "products", icon: <Tag className="h-5 w-5" />, role: "MANAGER" },
     { to: "/dashboard/manager/map", label: "Live Map", icon: <Map className="h-5 w-5" />, role: "MANAGER" },

    { to: "/dashboard/livreur", label: "Overview", icon: <LayoutDashboard className="h-5 w-5" />, role: "LIVREUR" },
    { to: "/dashboard/livreur/deliveries", label: "My Deliveries", icon: <Package className="h-5 w-5" />, role: "LIVREUR" },
    // { to: "/dashboard/livreur/notifications", label: "Notifications", icon: <Bell className="h-5 w-5" />, role: "LIVREUR" },
    // { to: "/dashboard/livreur/map", label: "Map", icon: <Map className="h-5 w-5" />, role: "LIVREUR" },

    { to: "/dashboard/client", label: "My Orders", icon: <Package className="h-5 w-5" />, role: "CLIENT" },
     { to: "/dashboard/client/notifications", label: "Notifications", icon: <Bell className="h-5 w-5" />, role: "CLIENT" },
  ];

// Get color based on user role
  const getRoleColor = () => {
    if (!user?.role) return "#6366F1";
    switch(user.role) {
      case "ADMIN": return "#4F46E5";
      case "MANAGER": return "#818CF8";
      case "LIVREUR": return "#6366F1";
      case "CLIENT": return "#818CF8";
      default: return "#6366F1";
    }
  };

  const roleColor = getRoleColor();

  return (
    <>
      {/* Overlay for mobile */}
      <div
        onClick={toggleSidebar}
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      ></div>

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 flex flex-col transform transition-all duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(224,231,255,0.95) 100%)",
          boxShadow: "2px 0 30px rgba(99, 102, 241, 0.15)",
          borderRight: "1px solid rgba(224, 231, 255, 0.5)"
        }}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b" style={{ borderColor: "rgba(224, 231, 255, 0.5)" }}>
          <div className="flex items-center gap-3">
             {user && (
          <div className="p-6 border-b" style={{ borderColor: "rgba(224, 231, 255, 0.5)" }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold"
                   style={{
                     background: `linear-gradient(135deg, ${roleColor}, ${roleColor}dd)`,
                     color: "#FFFFFF",
                     boxShadow: `0 4px 20px ${roleColor}40`
                   }}>
                {user.nom ? user.nom.charAt(0).toUpperCase() : "U"}
              </div>
              <div>
                <p className="font-semibold" style={{ color: "#1f2937" }}>{user.nom}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: roleColor }}></div>
                  <p className="text-xs font-medium" style={{ color: roleColor }}>{user.role}</p>
                </div>
              </div>
            </div>
          </div>
        )}
            {/* <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                 style={{
                   background: `linear-gradient(135deg, ${roleColor}, ${roleColor}dd)`,
                   boxShadow: `0 4px 20px ${roleColor}40`
                 }}>
              <Truck className="h-5 w-5 text-white" />
            </div> */}
            {/* <div>
              <h2 className="font-bold text-lg" style={{ color: "#1f2937" }}>Livrago</h2>
              <p className="text-xs font-medium" style={{ color: roleColor }}>Dashboard</p>
            </div> */}
          </div>
        </div>

        {/* Profile Section */}
        {/* {user && (
          <div className="p-6 border-b" style={{ borderColor: "rgba(224, 231, 255, 0.5)" }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold"
                   style={{
                     background: `linear-gradient(135deg, ${roleColor}, ${roleColor}dd)`,
                     color: "#FFFFFF",
                     boxShadow: `0 4px 20px ${roleColor}40`
                   }}>
                {user.nom ? user.nom.charAt(0).toUpperCase() : "U"}
              </div>
              <div>
                <p className="font-semibold" style={{ color: "#1f2937" }}>{user.nom}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: roleColor }}></div>
                  <p className="text-xs font-medium" style={{ color: roleColor }}>{user.role}</p>
                </div>
              </div>
            </div>
          </div>
        )} */}

        {/* Navigation Links */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {navigationLinks
              .filter((link) => link.role === user?.role)
              .map((link, index) => (
                <Link
                  key={index}
                  to={link.to}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group ${
                    active === link.label ? "scale-105 shadow-lg" : "hover:scale-105"
                  }`}
                  style={{
                    backgroundColor: active === link.label ? `${roleColor}15` : "transparent",
                    border: active === link.label ? `1px solid ${roleColor}30` : "1px solid transparent"
                  }}
                  onClick={() => {
                    toggleSidebar();
                    setActive(link.label);
                  }}
                >
                  <div className={`transition-transform duration-300 ${
                    active === link.label ? "scale-110" : "group-hover:scale-110"
                  }`}
                  style={{ color: active === link.label ? roleColor : "#6b7280" }}>
                    {link.icon}
                  </div>
                  <span className={`font-medium transition-colors duration-300 ${
                    active === link.label ? "text-[#1f2937]" : "group-hover:text-[#1f2937]"
                  }`}
                  style={{ color: active === link.label ? roleColor : "#6b7280" }}>
                    {link.label}
                  </span>
                </Link>
              ))}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="p-6 border-t" style={{ borderColor: "rgba(224, 231, 255, 0.5)" }}>
          {/* Home Button */}
          <Link
            to="/"
            className="flex items-center gap-3 p-3 rounded-xl mb-4 transition-all duration-300 hover:scale-105 group"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              border: "1px solid rgba(224, 231, 255, 0.5)"
            }}
            onClick={toggleSidebar}
          >
            <Home className="h-5 w-5 transition-colors duration-300 group-hover:text-[#6366F1]" 
                  style={{ color: "#6b7280" }} />
            <span className="font-medium transition-colors duration-300 group-hover:text-[#6366F1]"
                  style={{ color: "#6b7280" }}>
              Back to Home
            </span>
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 p-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 group"
            style={{
              backgroundColor: roleColor,
              color: "#FFFFFF",
              boxShadow: `0 4px 20px ${roleColor}40`
            }}
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;