import React from 'react';
import { Star, Quote, Sparkles, CheckCircle, Award, TrendingUp } from 'lucide-react';

function Testimonial() {
  const testimonials = [
    {
      id: 1,
      name: "Shekinah Tshikulila",
      role: "Logistics Director",
      company: "Global Shipping Inc.",
      content: "Working with this platform has dramatically improved our delivery efficiency. The real-time tracking and route optimization have reduced our operational costs by 40% and improved customer satisfaction significantly.",
      rating: 5,
      avatar: "https://i.pinimg.com/736x/6f/a3/6a/6fa36aa2c367da06b2a4c8ae1cf9ee02.jpg",
      stats: "Delivery efficiency +65%"
    },
    {
      id: 2,
      name: "Jonathan Yombo",
      role: "Operations Manager",
      company: "Express Logistics",
      content: "This platform eliminated so many headaches in our workflow. The warehouse management system and automated notifications have streamlined our entire operation.",
      rating: 5,
      avatar: "https://i.pinimg.com/736x/89/4e/16/894e16749bb2800527958cf7813b998e.jpg",
      stats: "Operations cost -40%"
    },
    {
      id: 3,
      name: "Yucel Farukşahan",
      role: "Supply Chain Lead",
      company: "Tech Logistics Corp",
      content: "The route optimization algorithms are top-notch. They've saved us countless hours and significantly reduced our fuel consumption. Highly recommend for any logistics company!",
      rating: 5,
      avatar: "https://i.pinimg.com/736x/5a/ac/66/5aac6619a8b81993b10be58fbded3951.jpg",
      stats: "Fuel savings 35%"
    },
    {
      id: 4,
      name: "Rodrigo Aguilar",
      role: "CTO",
      company: "Delivery Solutions Ltd",
      content: "Exceptional quality and incredible attention to detail. The analytics dashboard has truly elevated our decision-making process. The best logistics platform we've implemented!",
      rating: 5,
      avatar: "https://i.pinimg.com/736x/d9/7f/aa/d97faa4ca82603ea39b68b534f63b89a.jpg",
      stats: "Customer satisfaction +50%"
    }
  ];

  const stats = [
    { value: "98%", label: "Customer Satisfaction", color: "#818CF8" },
    { value: "4.9/5", label: "Average Rating", color: "#6366F1" },
    { value: "800+", label: "Happy Clients", color: "#4F46E5" },
    { value: "65%", label: "Faster Deliveries", color: "#818CF8" }
  ];

  return (
    <div className="font-sans py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#E0E7FF]/10 via-white to-[#6366F1]/5"></div>
        
        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: Math.random() * 30 + 10 + 'px',
              height: Math.random() * 30 + 10 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              background: `radial-gradient(circle, ${['#E0E7FF', '#818CF8', '#6366F1'][i % 3]} 0%, transparent 70%)`,
              opacity: 0.1,
              filter: 'blur(12px)',
              animationDelay: `${i * 0.4}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with badge */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8"
               style={{
                 backgroundColor: 'rgba(224, 231, 255, 0.1)',
                 borderColor: 'rgba(129, 140, 248, 0.3)'
               }}>
            <Sparkles className="h-4 w-4" style={{ color: '#818CF8' }} />
            <span className="text-sm font-medium" style={{ color: '#4F46E5' }}>
              Trusted by Industry Leaders
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center max-w-5xl leading-tight mb-8">
            <span className="block" style={{ color: '#1f2937' }}>Trusted by</span>
            <span 
              className="block"
              style={{
                background: "linear-gradient(90deg, #6366F1, #818CF8, #4F46E5)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: '0 4px 30px rgba(129, 140, 248, 0.2)'
              }}
            >
              Global Logistics Teams
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl max-w-3xl mx-auto px-6 py-4 rounded-xl mb-12"
             style={{
               color: '#6b7280',
               backgroundColor: 'rgba(255, 255, 255, 0.7)',
               backdropFilter: 'blur(10px)',
               border: '1px solid rgba(224, 231, 255, 0.4)'
             }}>
            Industry leaders trust our platform to streamline their logistics operations, reduce costs, and deliver exceptional service to their customers.
          </p>

          {/* Stats bar */}
          <div className="flex flex-wrap justify-center gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div 
                  className="text-3xl sm:text-4xl font-bold mb-2 transition-all duration-300 group-hover:scale-110"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </div>
                <div className="text-sm font-medium" style={{ color: '#6b7280' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Large Left Testimonial */}
          <div className="group p-10 rounded-3xl relative overflow-hidden transition-all duration-500 hover:scale-[1.02] cursor-pointer"
               style={{
                 backgroundColor: 'rgba(255, 255, 255, 0.95)',
                 border: '1px solid rgba(224, 231, 255, 0.5)',
                 boxShadow: '0 20px 40px -20px rgba(99, 102, 241, 0.1)'
               }}>
            {/* Gradient border effect */}
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                 style={{
                   background: 'linear-gradient(135deg, #818CF833, #6366F122)',
                   padding: '2px',
                   WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                   WebkitMaskComposite: 'xor',
                   maskComposite: 'exclude'
                 }}></div>
            
            {/* Quote icon */}
            <div className="absolute top-6 right-6 opacity-10">
              <Quote className="h-24 w-24" style={{ color: '#6366F1' }} />
            </div>
            
            <div className="relative z-10">
              {/* Rating stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" style={{ color: '#FBBF24' }} />
                ))}
              </div>
              
              <p className="text-lg leading-relaxed mb-8" style={{ color: '#4b5563' }}>
                "Working with this platform has dramatically improved our delivery efficiency. The real-time tracking and route optimization have reduced our operational costs by 40% and improved customer satisfaction significantly."
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative mr-4">
                    <img
                      src="https://i.pinimg.com/736x/6f/a3/6a/6fa36aa2c367da06b2a4c8ae1cf9ee02.jpg"
                      alt="Shekinah Tshikulila"
                      className="w-14 h-14 rounded-full object-cover border-2"
                      style={{ borderColor: '#818CF8' }}
                      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { 
                        (e.target as HTMLImageElement).onerror = null; 
                        (e.target as HTMLImageElement).src = "https://placehold.co/56x56/818CF8/FFFFFF?text=ST" 
                      }}
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                         style={{ backgroundColor: '#6366F1' }}>
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-lg" style={{ color: '#1f2937' }}>Shekinah Tshikulila</p>
                    <p className="text-sm" style={{ color: '#6b7280' }}>Logistics Director</p>
                    <div className="flex items-center gap-2 mt-1">
                      <TrendingUp className="h-4 w-4" style={{ color: '#10B981' }} />
                      <span className="text-sm font-medium" style={{ color: '#10B981' }}>Delivery efficiency +65%</span>
                    </div>
                  </div>
                </div>
                <Award className="h-8 w-8 opacity-20 group-hover:opacity-40 transition-opacity" 
                       style={{ color: '#4F46E5' }} />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-8">
            {/* Top Right Testimonial */}
            <div className="group p-8 rounded-2xl relative overflow-hidden transition-all duration-500 hover:scale-[1.02] cursor-pointer"
                 style={{
                   backgroundColor: 'rgba(255, 255, 255, 0.95)',
                   border: '1px solid rgba(224, 231, 255, 0.5)',
                   boxShadow: '0 15px 30px -15px rgba(99, 102, 241, 0.1)'
                 }}>
              <div className="relative z-10">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" style={{ color: '#FBBF24' }} />
                  ))}
                </div>
                
                <p className="text-base leading-relaxed mb-6" style={{ color: '#4b5563' }}>
                  "This platform eliminated so many headaches in our workflow. The warehouse management system and automated notifications have streamlined our entire operation."
                </p>
                
                <div className="flex items-center">
                  <img
                    src="https://i.pinimg.com/736x/89/4e/16/894e16749bb2800527958cf7813b998e.jpg"
                    alt="Jonathan Yombo"
                    className="w-12 h-12 rounded-full object-cover mr-4 border-2"
                    style={{ borderColor: '#6366F1' }}
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { 
                      (e.target as HTMLImageElement).onerror = null; 
                      (e.target as HTMLImageElement).src = "https://placehold.co/48x48/6366F1/FFFFFF?text=JY" 
                    }}
                  />
                  <div>
                    <p className="font-bold" style={{ color: '#1f2937' }}>Jonathan Yombo</p>
                    <p className="text-sm" style={{ color: '#6b7280' }}>Operations Manager</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3" style={{ color: '#10B981' }} />
                      <span className="text-xs font-medium" style={{ color: '#10B981' }}>Operations cost -40%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row - Two Smaller Testimonials */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.slice(2).map((testimonial) => (
                <div key={testimonial.id} 
                     className="group p-6 rounded-2xl relative overflow-hidden transition-all duration-500 hover:scale-[1.02] cursor-pointer"
                     style={{
                       backgroundColor: 'rgba(255, 255, 255, 0.95)',
                       border: '1px solid rgba(224, 231, 255, 0.5)',
                       boxShadow: '0 10px 25px -10px rgba(99, 102, 241, 0.1)'
                     }}>
                  <div className="relative z-10">
                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current" style={{ color: '#FBBF24' }} />
                      ))}
                    </div>
                    
                    <p className="text-sm leading-relaxed mb-4" style={{ color: '#4b5563' }}>
                      "{testimonial.content}"
                    </p>
                    
                    <div className="flex items-center">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-10 h-10 rounded-full object-cover mr-3 border-2"
                        style={{ borderColor: testimonial.id === 3 ? '#4F46E5' : '#818CF8' }}
                        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { 
                          (e.target as HTMLImageElement).onerror = null; 
                          (e.target as HTMLImageElement).src = `https://placehold.co/40x40/${testimonial.id === 3 ? '4F46E5' : '818CF8'}/FFFFFF?text=${testimonial.name.split(' ').map(n => n[0]).join('')}` 
                        }}
                      />
                      <div>
                        <p className="font-bold text-sm" style={{ color: '#1f2937' }}>{testimonial.name}</p>
                        <p className="text-xs" style={{ color: '#6b7280' }}>{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Client Logos */}
        <div className="mt-20">
          <p className="text-center text-sm font-semibold uppercase tracking-wider mb-10"
             style={{ color: '#818CF8', letterSpacing: '0.2em' }}>
            Trusted by Industry Leaders
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {[
              { name: "Global Shipping", color: "#818CF8" },
              { name: "Express Logistics", color: "#6366F1" },
              { name: "Supply Chain Corp", color: "#4F46E5" },
              { name: "Delivery Solutions", color: "#818CF8" },
              { name: "Tech Logistics", color: "#6366F1" }
            ].map((company, index) => (
              <div 
                key={index}
                className="px-6 py-3 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                style={{
                  backgroundColor: `${company.color}10`,
                  border: `1px solid ${company.color}20`
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: company.color }}></div>
                  <span className="font-bold text-lg group-hover:scale-105 transition-transform"
                        style={{ color: company.color }}>
                    {company.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

     
    </div>
  );
}

export default Testimonial;