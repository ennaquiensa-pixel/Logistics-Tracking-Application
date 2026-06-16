import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, AlertCircle, Package, MapPin, Truck } from 'lucide-react';

const NotFound: React.FC = () => {
  const roleColor = "#818CF8";

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements - MÊME STYLE QUE LES AUTRES DASHBOARDS */}
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

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-lg w-full text-center">
       

          {/* 404 Number */}
          <div className="relative mb-6">
            <div className="text-8xl md:text-9xl font-bold" style={{ color: '#666d85ff', opacity: 0.3 }}>
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-4xl md:text-5xl font-bold" style={{ color: '#1f2937' }}>
                Page Introuvable
              </div>
            </div>
          </div>

          {/* Message */}
          <h1 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#1f2937' }}>
            Oups ! Perdu dans l'espace numérique ?
          </h1>
          <p className="text-lg mb-8" style={{ color: '#6b7280' }}>
            La page que vous recherchez semble s'être égarée. Ne vous inquiétez pas, 
            même les meilleurs livreurs prennent parfois le mauvais chemin !
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/"
              className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: roleColor,
                color: '#FFFFFF',
                boxShadow: `0 10px 30px -10px ${roleColor}40`
              }}
            >
              <Home className="h-5 w-5" />
              <span>Retour à l'accueil</span>
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl font-medium transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(224, 231, 255, 0.5)',
                color: roleColor,
                boxShadow: '0 4px 20px rgba(129, 140, 248, 0.1)'
              }}
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Retour en arrière</span>
            </button>
          </div>

          {/* Delivery Animation */}
          <div className="relative h-32 mb-8 overflow-hidden rounded-xl"
               style={{
                 backgroundColor: 'rgba(255, 255, 255, 0.9)',
                 border: '1px solid rgba(224, 231, 255, 0.5)',
                 boxShadow: '0 10px 30px -10px rgba(129, 140, 248, 0.1)'
               }}>
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 animate-bounce">
              <Truck className="h-8 w-8" style={{ color: roleColor }} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-2 text-sm" style={{ color: '#6b7280' }}>
                <MapPin className="h-4 w-4" />
                <span>Recherche de destination...</span>
              </div>
            </div>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
              <div className="w-3 h-3 rounded-full animate-ping" style={{ backgroundColor: '#EF4444' }}></div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 pt-8 border-t"
               style={{ borderColor: 'rgba(224, 231, 255, 0.5)' }}>
            {[
              { to: "/dashboard", label: "Tableau de Bord", icon: Home },
              { to: "/services", label: "Services", icon: Package },
              { to: "/about", label: "À propos", icon: Truck }
            ].map((link, index) => (
              <Link
                key={index}
                to={link.to}
                className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 hover:scale-105 group"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(224, 231, 255, 0.5)',
                  boxShadow: '0 4px 20px rgba(129, 140, 248, 0.1)'
                }}
              >
                <link.icon className="h-5 w-5 transition-colors duration-300 group-hover:text-[#818CF8]"
                           style={{ color: '#9CA3AF' }} />
                <span className="text-sm font-medium transition-colors duration-300 group-hover:text-[#818CF8]"
                      style={{ color: '#6b7280' }}>
                  {link.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t text-center text-xs"
               style={{ borderColor: 'rgba(224, 231, 255, 0.5)', color: '#9CA3AF' }}>
            <p>© {new Date().getFullYear()} Plateforme Logistique. Tous droits réservés.</p>
            <p className="mt-1">
              <Link to="/help" className="hover:underline" style={{ color: '#6b7280' }}>
                Aide
              </Link>
              {' • '}
              <Link to="/contact" className="hover:underline" style={{ color: '#6b7280' }}>
                Contact
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;