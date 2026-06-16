import React from "react";
import { Truck, Mail, Phone, MapPin, ChevronRight, Shield, Clock, Package, Users } from "lucide-react";

function Footer() {
  const navLinks = [
    { name: "Features", href: "#", icon: Package },
    { name: "Solutions", href: "#", icon: Shield },
    { name: "Customers", href: "#", icon: Users },
    { name: "Pricing", href: "#" },
    { name: "Help", href: "#", icon: Clock },
    { name: "About", href: "#" },
  ];

  const socialIcons = [
    {
      name: "X",
      href: "#",
      svg: (
        <svg
          className="size-5 transition-all duration-300 hover:scale-110"
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M10.488 14.651L15.25 21h7l-7.858-10.478L20.93 3h-2.65l-5.117 5.886L8.75 3h-7l7.51 10.015L2.32 21h2.65zM16.25 19L5.75 5h2l10.5 14z"
          ></path>
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: "#",
      svg: (
        <svg
          className="size-5 transition-all duration-300 hover:scale-110"
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"
          ></path>
        </svg>
      ),
    },
    {
      name: "Facebook",
      href: "#",
      svg: (
        <svg
          className="size-5 transition-all duration-300 hover:scale-110"
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95"
          ></path>
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "#",
      svg: (
        <svg
          className="size-5 transition-all duration-300 hover:scale-110"
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"
          ></path>
        </svg>
      ),
    },
  ];

  const companyInfo = [
    { icon: Mail, text: "support@livrago.com", href: "mailto:support@livrago.com" },
    { icon: Phone, text: "+1 (555) 123-4567", href: "tel:+15551234567" },
    { icon: MapPin, text: "123 Logistics Ave, Suite 500", href: "#" },
  ];

  return (
    <footer className="relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Main gradient */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-[#E0E7FF] via-white to-[#818CF8]/20"
        ></div>
        
        {/* Pattern overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(#6366F1 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        ></div>
        
        {/* Floating blobs */}
        <div 
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10 animate-blob"
          style={{ backgroundColor: '#818CF8', filter: 'blur(60px)' }}
        ></div>
        <div 
          className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-10 animate-blob animation-delay-2000"
          style={{ backgroundColor: '#6366F1', filter: 'blur(60px)' }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <Truck className="size-10" style={{ color: '#4F46E5' }} />
                <div className="absolute inset-0 animate-ping opacity-30" style={{ color: '#818CF8' }}>
                  <Truck className="size-10" />
                </div>
              </div>
              <span className="text-3xl font-bold" style={{ color: '#1f2937' }}>
                Livrago
              </span>
            </div>
            <p className="text-lg mb-6" style={{ color: '#6b7280' }}>
              Streamlining logistics operations with cutting-edge technology and reliable service delivery.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-4">
              {companyInfo.map((info, index) => (
                <a
                  key={index}
                  href={info.href}
                  className="flex items-center gap-3 group transition-all duration-300 hover:translate-x-2"
                  style={{ color: '#6b7280' }}
                >
                  <div 
                    className="flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
                  >
                    <info.icon className="size-5" style={{ color: '#6366F1' }} />
                  </div>
                  <span className="group-hover:text-[#6366F1] transition-colors">
                    {info.text}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Product Links */}
            <div>
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: '#1f2937' }}>
                <span>Products</span>
                <ChevronRight className="size-4" style={{ color: '#818CF8' }} />
              </h3>
              <ul className="space-y-3">
                {navLinks.slice(0, 3).map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="flex items-center gap-3 group transition-all duration-300 hover:translate-x-2"
                      style={{ color: '#6b7280' }}
                    >
                      {link.icon && (
                        <link.icon className="size-4 transition-colors" style={{ color: '#6366F1' }} />
                      )}
                      <span className="group-hover:text-[#6366F1] group-hover:font-medium transition-all">
                        {link.name}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: '#1f2937' }}>
                <span>Company</span>
                <ChevronRight className="size-4" style={{ color: '#818CF8' }} />
              </h3>
              <ul className="space-y-3">
                {navLinks.slice(3).map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="flex items-center gap-3 group transition-all duration-300 hover:translate-x-2"
                      style={{ color: '#6b7280' }}
                    >
                      {link.icon && (
                        <link.icon className="size-4 transition-colors" style={{ color: '#6366F1' }} />
                      )}
                      <span className="group-hover:text-[#6366F1] group-hover:font-medium transition-all">
                        {link.name}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-bold mb-6" style={{ color: '#1f2937' }}>
                Stay Updated
              </h3>
              <p className="mb-6" style={{ color: '#6b7280' }}>
                Subscribe to our newsletter for the latest updates and logistics insights.
              </p>
              
              <form className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderColor: 'rgba(224, 231, 255, 0.5)',
                      color: '#1f2937',
                      boxShadow: '0 2px 10px rgba(99, 102, 241, 0.1)'
                    }}
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 rounded-md font-semibold transition-all duration-300 hover:scale-105"
                    style={{
                      backgroundColor: '#6366F1',
                      color: '#FFFFFF'
                    }}
                  >
                    Subscribe
                  </button>
                </div>
              </form>

              {/* Social Links */}
              <div className="mt-8">
                <p className="mb-4 font-medium" style={{ color: '#1f2937' }}>Follow Us</p>
                <div className="flex gap-4">
                  {socialIcons.map((icon) => (
                    <a
                      key={icon.name}
                      href={icon.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={icon.name}
                      className="flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg"
                      style={{
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        color: '#6366F1'
                      }}
                    >
                      {icon.svg}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div 
          className="h-px w-full mb-8"
          style={{ background: 'linear-gradient(90deg, transparent, #E0E7FF, #818CF8, #6366F1, transparent)' }}
        ></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright */}
          <div className="text-center md:text-left">
            <p className="text-sm" style={{ color: '#6b7280' }}>
              &copy; {new Date().getFullYear()} Livrago. All rights reserved.
            </p>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap justify-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Sitemap'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm font-medium transition-all duration-300 hover:scale-105"
                style={{ color: '#6366F1' }}
              >
                {item}
              </a>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }}>
              <Shield className="size-4" style={{ color: '#6366F1' }} />
              <span className="text-sm font-medium" style={{ color: '#1f2937' }}>SSL Secure</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: 'rgba(129, 140, 248, 0.1)' }}>
              <Clock className="size-4" style={{ color: '#818CF8' }} />
              <span className="text-sm font-medium" style={{ color: '#1f2937' }}>24/7 Support</span>
            </div>
          </div>
        </div>

        {/* Back to Top */}
        <div className="mt-12 text-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: '#4F46E5',
              border: '1px solid rgba(224, 231, 255, 0.5)',
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.15)'
            }}
          >
            Back to Top
            <ChevronRight className="size-4 rotate-90" />
          </a>
        </div>
      </div>

    
    </footer>
  );
}

export default Footer;