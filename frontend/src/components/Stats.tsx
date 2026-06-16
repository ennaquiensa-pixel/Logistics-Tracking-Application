import React from "react";
import { Package, Users, Truck, Warehouse, TrendingUp, CheckCircle, Clock, Shield, Star } from "lucide-react";

const stats = [
  { 
    label: "Total Deliveries", 
    value: "1.2K", 
    description: "Completed successfully",
    icon: Package,
    trend: "+12% this month",
    color: "#818CF8",
    delay: "0"
  },
  { 
    label: "Active Clients", 
    value: "800+", 
    description: "Businesses served",
    icon: Users,
    trend: "+8% growth",
    color: "#6366F1",
    delay: "100"
  },
  { 
    label: "Active Drivers", 
    value: "150", 
    description: "Certified professionals",
    icon: Truck,
    trend: "+5% this quarter",
    color: "#4F46E5",
    delay: "200"
  },
  { 
    label: "Warehouses Covered", 
    value: "25", 
    description: "Strategic locations",
    icon: Warehouse,
    trend: "Nationwide coverage",
    color: "#818CF8",
    delay: "300"
  },
];

const Stats: React.FC = () => (
  <section className="py-24 relative overflow-hidden">
    {/* Background with gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white to-[#E0E7FF]/10"></div>
    
    {/* Floating particles */}
    <div className="absolute inset-0">
      {[...Array(15)].map((_, i) => (
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

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      {/* Header */}
      <div className="text-center mb-20">
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border"
             style={{
               backgroundColor: 'rgba(224, 231, 255, 0.1)',
               borderColor: 'rgba(129, 140, 248, 0.3)'
             }}>
          <CheckCircle className="h-4 w-4" style={{ color: '#6366F1' }} />
          <span className="text-sm font-medium" style={{ color: '#4F46E5' }}>
            Trusted by Industry Leaders
          </span>
        </div>
        
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8">
          <span className="block" style={{ color: '#1f2937' }}>Numbers That</span>
          <span 
            className="block"
            style={{
              background: "linear-gradient(90deg, #6366F1, #818CF8, #4F46E5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            Speak Volumes
          </span>
        </h2>
        
        <p className="text-lg sm:text-xl max-w-3xl mx-auto px-4 py-4 rounded-xl"
           style={{
             color: '#6b7280',
             backgroundColor: 'rgba(224, 231, 255, 0.1)'
           }}>
          Delivering excellence across the nation with proven results and reliable service
        </p>
      </div>

      {/* Stats Grid with animated cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div 
              key={index}
              style={{ 
                animationDelay: `${stat.delay}ms`,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: `1px solid ${stat.color}20`,
                boxShadow: '0 10px 30px -10px rgba(99, 102, 241, 0.1)'
              }}
              className="group animate-fadeInUp p-8 rounded-2xl cursor-pointer transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden"
            >
              {/* Gradient border effect on hover */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(135deg, ${stat.color}33, transparent)`,
                  padding: '2px',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude'
                }}
              ></div>
              
              {/* Shimmer effect */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700"
                style={{
                  background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)`,
                  transform: 'translateX(-100%)'
                }}
              ></div>
              
              {/* Icon Container */}
              <div className="flex items-center justify-between mb-6">
                <div 
                  className="flex items-center justify-center w-16 h-16 rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                  style={{
                    background: `linear-gradient(135deg, ${stat.color}, ${stat.color}dd)`,
                    boxShadow: `0 10px 25px -5px ${stat.color}40`
                  }}
                >
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                
                {/* Animated Value */}
                <div className="text-right">
                  <p 
                    className="text-4xl font-bold transition-all duration-500 group-hover:scale-105"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </p>
                </div>
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-bold mb-3" style={{ color: '#1f2937' }}>
                {stat.label}
              </h3>
              
              <p className="text-base mb-4" style={{ color: '#6b7280' }}>
                {stat.description}
              </p>
              
              {/* Trend Indicator */}
              <div className="flex items-center gap-3 pt-4 border-t"
                   style={{ borderColor: `${stat.color}20` }}>
                <div className="flex items-center justify-center w-8 h-8 rounded-full"
                     style={{ backgroundColor: `${stat.color}15` }}>
                  <TrendingUp className="h-4 w-4" style={{ color: stat.color }} />
                </div>
                <span className="text-sm font-semibold" style={{ color: stat.color }}>
                  {stat.trend}
                </span>
              </div>
              
              {/* Corner accent */}
              <div 
                className="absolute -top-2 -right-2 w-8 h-8 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                style={{ backgroundColor: stat.color, filter: 'blur(8px)' }}
              ></div>
            </div>
          );
        })}
      </div>

      {/* Additional Metrics */}
      <div className="mt-16 backdrop-blur-sm rounded-3xl p-10 relative overflow-hidden"
           style={{
             backgroundColor: 'rgba(255, 255, 255, 0.8)',
             border: '1px solid rgba(224, 231, 255, 0.4)',
             boxShadow: '0 20px 60px -20px rgba(99, 102, 241, 0.15)'
           }}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5"
             style={{
               backgroundImage: `radial-gradient(${['#818CF8', '#6366F1', '#4F46E5'][0]} 1px, transparent 1px)`,
               backgroundSize: '20px 20px'
             }}
        ></div>
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              value: "99.9%",
              label: "Delivery Success Rate",
              description: "Industry leading reliability",
              icon: Shield,
              color: "#818CF8"
            },
            {
              value: "24/7",
              label: "Customer Support",
              description: "Always available for you",
              icon: Clock,
              color: "#6366F1"
            },
            {
              value: "45min",
              label: "Average Response Time",
              description: "Quick issue resolution",
              icon: Star,
              color: "#4F46E5"
            }
          ].map((metric, index) => (
            <div key={index} className="text-center group">
              <div 
                className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 mx-auto transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                style={{
                  background: `linear-gradient(135deg, ${metric.color}15, ${metric.color}05)`,
                  border: `1px solid ${metric.color}30`
                }}
              >
                <metric.icon className="h-10 w-10" style={{ color: metric.color }} />
              </div>
              
              <p 
                className="text-5xl font-bold mb-2 transition-all duration-500 group-hover:scale-110"
                style={{ color: metric.color }}
              >
                {metric.value}
              </p>
              
              <p className="text-lg font-semibold mb-2" style={{ color: '#1f2937' }}>
                {metric.label}
              </p>
              
              <p className="text-sm" style={{ color: '#6b7280' }}>
                {metric.description}
              </p>
              
              {/* Connecting line for desktop */}
              {index < 2 && (
                <div className="hidden md:block absolute top-1/2 right-0 w-8 h-px translate-x-4"
                     style={{ backgroundColor: `${metric.color}30` }}>
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full"
                       style={{ backgroundColor: metric.color }}></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom stats bar */}
        <div className="mt-12 pt-8 border-t grid grid-cols-2 lg:grid-cols-4 gap-6"
             style={{ borderColor: 'rgba(224, 231, 255, 0.4)' }}>
          {[
            { value: "98%", label: "Client Satisfaction", color: "#818CF8" },
            { value: "2.5M", label: "Miles Covered", color: "#6366F1" },
            { value: "50+", label: "Cities Covered", color: "#4F46E5" },
            { value: "12", label: "Years Experience", color: "#818CF8" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p 
                className="text-2xl font-bold mb-1"
                style={{ color: stat.color }}
              >
                {stat.value}
              </p>
              <p className="text-sm" style={{ color: '#6b7280' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Trust badges */}
      <div className="mt-16 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider mb-8"
           style={{ color: '#818CF8', letterSpacing: '0.2em' }}>
          Trusted Partners
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-80">
          {[
            { name: "Enterprise", color: "#818CF8" },
            { name: "Global Logistics", color: "#6366F1" },
            { name: "Tech Corp", color: "#4F46E5" },
            { name: "Supply Chain", color: "#818CF8" }
          ].map((company, index) => (
            <div 
              key={index}
              className="px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{
                backgroundColor: `${company.color}10`,
                border: `1px solid ${company.color}20`
              }}
            >
              <span className="font-bold text-lg" style={{ color: company.color }}>
                {company.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Custom styles */}
  </section>
);

export default Stats;