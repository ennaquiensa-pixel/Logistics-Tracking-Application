import { useEffect, useState } from "react";
import { Menu, Home, Bell, User, Search, ChevronDown, Zap, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface HeaderProps {
  toggleSidebar: () => void;
}

const DashboardHeader = ({ toggleSidebar }: HeaderProps) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
      setIsScrolled(scrollTop > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 lg:left-64 right-0 h-16 lg:h-20 z-30 transition-all duration-500 ${
        isScrolled 
          ? "backdrop-blur-md bg-white/95 shadow-lg" 
          : "bg-white border-b"
      }`}
      style={{
        borderColor: 'rgba(224, 231, 255, 0.5)',
        boxShadow: isScrolled ? '0 4px 20px rgba(99, 102, 241, 0.1)' : 'none'
      }}
    >
      {/* Animated gradient border */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1 transition-all duration-500"
        style={{
          background: 'linear-gradient(90deg, #E0E7FF, #818CF8, #6366F1, #4F46E5, #E0E7FF)',
          backgroundSize: '200% 100%',
          animation: 'gradientFlow 3s linear infinite',
          opacity: isScrolled ? 0.8 : 0.5
        }}
      ></div>

      <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg transition-all duration-300 hover:scale-110 group"
            style={{
              backgroundColor: isScrolled ? 'rgba(224, 231, 255, 0.2)' : 'rgba(224, 231, 255, 0.1)'
            }}
          >
            <Menu className="h-5 w-5 transition-colors duration-300 group-hover:scale-110" 
                  style={{ color: '#6366F1' }} />
          </button>

          {/* Home Button for Client */}
          {/* {user?.role === "CLIENT" && (
            <Link 
              to="/"
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 group"
              style={{
                backgroundColor: isScrolled ? 'rgba(224, 231, 255, 0.2)' : 'rgba(224, 231, 255, 0.1)'
              }}
            >
              <Home className="h-4 w-4 transition-colors duration-300 group-hover:scale-110" 
                    style={{ color: '#6366F1' }} />
              <span className="text-sm font-medium hidden md:inline transition-colors duration-300 group-hover:text-[#6366F1]"
                    style={{ color: '#4b5563' }}>
                Home
              </span>
            </Link>
          )} */}
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-xl mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                    style={{ color: '#9CA3AF' }} />
            <input
              type="text"
              placeholder="Search dashboard..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderColor: 'rgba(224, 231, 255, 0.5)',
                color: '#1f2937',
                caretColor: '#6366F1',
                boxShadow: '0 2px 10px rgba(99, 102, 241, 0.05)'
              }}
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          {/* <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg transition-all duration-300 hover:scale-110 relative group"
              style={{
                backgroundColor: isScrolled ? 'rgba(224, 231, 255, 0.2)' : 'rgba(224, 231, 255, 0.1)'
              }}
            >
              <Bell className="h-5 w-5 transition-colors duration-300 group-hover:scale-110" 
                    style={{ color: '#6366F1' }} />
              <div className="absolute top-1 right-1 w-2 h-2 rounded-full animate-ping"
                   style={{ backgroundColor: '#818CF8' }}></div>
              <div className="absolute top-1 right-1 w-2 h-2 rounded-full"
                   style={{ backgroundColor: '#6366F1' }}></div>
            </button>
          </div> */}

          {/* User Profile */}
          {/* <div className="flex items-center gap-2 p-2 rounded-lg transition-all duration-300 hover:scale-105 group cursor-pointer"
               style={{
                 backgroundColor: isScrolled ? 'rgba(224, 231, 255, 0.2)' : 'rgba(224, 231, 255, 0.1)'
               }}>
            <div className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden"
                 style={{
                   backgroundColor: '#6366F1',
                   boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                 }}>
            
                <User className="h-4 w-4 text-white" />
            
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-semibold transition-colors duration-300 group-hover:text-[#6366F1]"
                   style={{ color: '#1f2937' }}>
                {user?.nom || 'User'}
              </div>
              <div className="text-xs transition-colors duration-300 group-hover:text-[#818CF8]"
                   style={{ color: '#6b7280' }}>
                {user?.role || 'Role'}
              </div>
            </div>
            <ChevronDown className="h-4 w-4 transition-colors duration-300 group-hover:text-[#6366F1]"
                         style={{ color: '#9CA3AF' }} />
          </div> */}
        </div>
      </div>

      {/* Scroll Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 transform transition-all duration-300"
           style={{ transform: `scaleX(${scrollProgress / 100})`, transformOrigin: 'left' }}>
        <div className="h-full w-full"
             style={{
               background: 'linear-gradient(90deg, #818CF8, #6366F1, #4F46E5)',
               boxShadow: '0 0 20px rgba(129, 140, 248, 0.5)'
             }}></div>
      </div>

     
    </header>
  );
};

export default DashboardHeader;