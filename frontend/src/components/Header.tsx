"use client";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Truck, Menu, X, ChevronRight, User, Home } from "lucide-react";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { logout, isAuthenticated, user } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500">
      {/* Animated Background Overlay */}
      <div 
        className={`absolute inset-0 transition-all duration-500 ${
          isScrolled ? "opacity-95 backdrop-blur-md" : "opacity-0"
        }`}
        style={{
          background: isScrolled 
            ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.95), rgba(79, 70, 229, 0.95))' 
            : 'transparent'
        }}
      ></div>
      
      {/* Border/Glow Effect on Scroll */}
      <div 
        className={`absolute inset-0 transition-all duration-500 ${
          isScrolled ? "opacity-100" : "opacity-0"
        }`}
        style={{
          boxShadow: '0 4px 30px rgba(129, 140, 248, 0.3)',
          borderRadius: isScrolled ? '0 0 20px 20px' : '0'
        }}
      ></div>

      <div className={`relative transition-all duration-500 ${
        isScrolled 
          ? "max-w-4xl mx-auto px-4 py-3 mt-4" 
          : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
      }`}>
        <nav className="flex items-center justify-between">
          {/* Logo with Animation */}
          <Link 
            to={'/'} 
            className="flex items-center transition-all duration-500 group"
            style={{ transform: isScrolled ? 'scale(0.95)' : 'scale(1)' }}
          >
            <div className="relative">
              <Truck 
                className={`transition-all duration-500 ${
                  isScrolled ? "size-8" : "size-12"
                }`}
                style={{ color: isScrolled ? '#FFFFFF' : '#E0E7FF' }}
              />
              {/* Logo Pulse Effect */}
              {/* {!isScrolled && (
                <div className="absolute inset-0 animate-ping opacity-20"
                     style={{ color: '#818CF8' }}>
                  <Truck className="size-12" />
                </div>
              )} */}
            </div>
            <span 
              className={`font-bold transition-all duration-500 ml-2 ${
                isScrolled ? "text-xl" : "text-2xl"
              }`}
              style={{ 
                color: isScrolled ? '#FFFFFF' : 'black',
                textShadow: isScrolled ? '0 2px 10px rgba(255, 255, 255, 0.3)' : 'none'
              }}
            >
              Livrago
              {!isScrolled && (
                <span 
                  className="block text-xs font-normal opacity-70 mt-[-2px]"
                  style={{ color: '#E0E7FF' }}
                >
                  Logistics Made Simple
                </span>
              )}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to={"/products"}
              className="transition-all duration-300 px-4 py-2 rounded-lg hover:scale-105"
              style={{ 
                color: isScrolled ? '#FFFFFF' : 'black',
                backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
              }}
            >
              <span className="flex items-center gap-2">
                <span>Order Now</span>
                <ChevronRight className="size-4 opacity-70" />
              </span>
            </Link>
            
            <Link
              to="#"
              className="transition-all duration-300 px-4 py-2 rounded-lg hover:scale-105"
              style={{ 
                color: isScrolled ? '#FFFFFF' : 'black',
                backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
              }}
            >
              About
            </Link>
            
            {isAuthenticated && user && (
              <Link
                to={`${user?.role === "ADMIN" ? "/dashboard" : user?.role === "MANAGER" ? "/dashboard/manager" : user?.role === "LIVREUR" ? "/dashboard/livreur" : "/dashboard/client"}`}
                className="transition-all duration-300 px-4 py-2 rounded-lg hover:scale-105 flex items-center gap-2"
                style={{ 
                  color: isScrolled ? '#FFFFFF' : '#E0E7FF',
                  backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
                }}
              >
                <User className="size-4" />
                Dashboard
              </Link>
            )}
            
            {isAuthenticated ? (
              <Link 
                to={'/login'} 
                onClick={() => logout()}
                className="transition-all duration-300 px-6 py-2 rounded-lg font-semibold hover:scale-105"
                style={{
                  backgroundColor: isScrolled ? '#FFFFFF' : '#E0E7FF',
                  color: isScrolled ? '#4F46E5' : '#4F46E5',
                  boxShadow: isScrolled ? '0 4px 20px rgba(255, 255, 255, 0.3)' : '0 4px 20px rgba(224, 231, 255, 0.4)'
                }}
              >
                Logout
              </Link>
            ) : (
              <Link 
                to={'/login'}
                className="transition-all duration-300 px-6 py-2 rounded-lg font-semibold hover:scale-105 group relative overflow-hidden"
                style={{
                  backgroundColor: isScrolled ? '#FFFFFF' : '#E0E7FF',
                  color: isScrolled ? '#4F46E5' : '#4F46E5',
                  boxShadow: isScrolled ? '0 4px 20px rgba(255, 255, 255, 0.3)' : '0 4px 20px rgba(224, 231, 255, 0.4)'
                }}
              >
                {/* Shimmer Effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(90deg, transparent, #FFFFFF, transparent)',
                    transform: 'translateX(-100%)'
                  }}
                ></div>
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden transition-all duration-300 p-2 rounded-lg hover:scale-110"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            style={{
              color: isScrolled ? '#FFFFFF' : '#E0E7FF',
              backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.1)' : 'rgba(224, 231, 255, 0.1)'
            }}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 z-50 transition-all duration-500 ease-out ${
          isMenuOpen 
            ? "opacity-100 visible translate-y-0" 
            : "opacity-0 invisible -translate-y-4"
        }`}
        style={{
          marginTop: isScrolled ? '60px' : '80px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.98), rgba(79, 70, 229, 0.98))',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(224, 231, 255, 0.2)',
          borderRadius: '0 0 20px 20px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div className="px-6 py-8 space-y-6">
          {/* Home Link */}
          <Link
            to="/"
            className="flex items-center gap-3 text-white py-3 text-lg rounded-xl px-4 transition-all duration-300 hover:scale-105 hover:bg-white/10"
            onClick={closeMenu}
          >
            <Home className="size-5" />
            Home
          </Link>

          {/* Order Now */}
          <Link
            to="/products"
            className="flex items-center justify-between text-white py-3 text-lg rounded-xl px-4 transition-all duration-300 hover:scale-105 hover:bg-white/10 group"
            onClick={closeMenu}
          >
            <span>Order Now</span>
            <ChevronRight className="size-5 opacity-70 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* About */}
          <Link
            to="#"
            className="flex items-center gap-3 text-white py-3 text-lg rounded-xl px-4 transition-all duration-300 hover:scale-105 hover:bg-white/10"
            onClick={closeMenu}
          >
            About
          </Link>

          {/* Dashboard (if authenticated) */}
          {isAuthenticated && user && (
            <Link
              to={`${user?.role === "ADMIN" ? "/dashboard" : user?.role === "MANAGER" ? "/dashboard/manager" : user?.role === "LIVREUR" ? "/dashboard/livreur" : "/dashboard/client"}`}
              className="flex items-center gap-3 text-white py-3 text-lg rounded-xl px-4 transition-all duration-300 hover:scale-105 hover:bg-white/10"
              onClick={closeMenu}
            >
              <User className="size-5" />
              Dashboard
            </Link>
          )}

          {/* Auth Button */}
          <div className="pt-6 border-t border-white/20">
            {isAuthenticated ? (
              <Link 
                to={'/login'} 
                onClick={() => { logout(); closeMenu(); }}
                className="block w-full text-center bg-white text-[#4F46E5] px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Logout
              </Link>
            ) : (
              <Link 
                to={'/login'} 
                onClick={closeMenu}
                className="block w-full text-center bg-white text-[#4F46E5] px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Login
              </Link>
            )}
          </div>

          {/* Additional Info */}
          <div className="pt-4 text-center">
            <div className="text-sm text-white/60">
              Need help? <span className="text-white font-medium">Contact Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={closeMenu}
          style={{ marginTop: isScrolled ? '60px' : '80px' }}
        />
      )}

      {/* Scroll Indicator */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 transition-all duration-500 ${
        isScrolled ? 'opacity-100' : 'opacity-0'
      }`}>
        <div 
          className="h-full transition-all duration-300"
          style={{
            width: `${Math.min((window.scrollY / 300) * 100, 100)}%`,
            background: 'linear-gradient(90deg, #818CF8, #6366F1, #4F46E5)',
            borderRadius: '0 4px 4px 0'
          }}
        ></div>
      </div>
    </header>
  );
};

export default Header;