import React, { useRef, useEffect } from "react";
import { Check, Zap, Shield, Clock, Users, BarChart3, Truck, MapPin, Package, Cloud, Wifi } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: "Real-time Tracking",
    description: "Monitor deliveries live with GPS tracking and instant updates",
    icon: MapPin,
    color: "#818CF8"
  },
  {
    title: "Route Optimization",
    description: "AI-powered routes that save time and reduce fuel costs by 40%",
    icon: Zap,
    color: "#6366F1"
  },
  {
    title: "Warehouse Management",
    description: "Complete inventory control and storage optimization",
    icon: Package,
    color: "#4F46E5"
  },
  {
    title: "Multi-role Access",
    description: "Seamless collaboration between clients, drivers, and managers",
    icon: Users,
    color: "#818CF8"
  },
  {
    title: "Smart Notifications",
    description: "Automated alerts and status updates for all stakeholders",
    icon: Wifi,
    color: "#6366F1"
  },
  {
    title: "Advanced Analytics",
    description: "Detailed insights and performance reports for better decisions",
    icon: BarChart3,
    color: "#4F46E5"
  },
  {
    title: "Fleet Management",
    description: "Track and manage your entire fleet from one dashboard",
    icon: Truck,
    color: "#818CF8"
  },
  {
    title: "Cloud Storage",
    description: "Secure cloud storage for all your logistics data",
    icon: Cloud,
    color: "#6366F1"
  }
];

const Features: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const featureCardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (!horizontalContainerRef.current || !cardsContainerRef.current) return;

    const container = horizontalContainerRef.current;
    const cardsWrapper = cardsContainerRef.current;
    
    // Calculate scroll distance
    const getScrollAmount = () => {
      const cardsWidth = cardsWrapper.scrollWidth;
      const windowWidth = window.innerWidth;
      return -(cardsWidth - windowWidth);
    };

    // Kill any existing ScrollTriggers
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    // Header animation with purple gradient
    gsap.fromTo(".features-header h2",
      {
        y: 80,
        opacity: 0,
        scale: 0.9
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container,
          start: "top 85%",
          end: "top 60%",
          scrub: 1
        }
      }
    );

    gsap.fromTo(".features-header p",
      {
        y: 40,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: 0.3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container,
          start: "top 80%",
          end: "top 50%",
          scrub: 1
        }
      }
    );

    // Animated gradient background for section
    gsap.to(".animated-bg", {
      backgroundPosition: "200% 0%",
      ease: "none",
      duration: 20,
      repeat: -1,
      yoyo: true
    });

    // Main horizontal scroll timeline
    const horizontalScroll = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: () => `+=${cardsWrapper.scrollWidth - window.innerWidth + 100}`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      }
    });

    // Animate the horizontal movement
    horizontalScroll.to(cardsWrapper, {
      x: getScrollAmount,
      ease: "none"
    });

    // Stagger animation for cards with purple effects
    featureCardsRef.current.forEach((card, index) => {
      if (!card) return;

      // Set initial state
      gsap.set(card, {
        opacity: 0.3,
        scale: 0.85,
        y: 50,
        rotationY: 15
      });

      // Animate in with 3D effect
      gsap.to(card, {
        opacity: 1,
        scale: 1,
        y: 0,
        rotationY: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: card,
          containerAnimation: horizontalScroll,
          start: "left 90%",
          end: "left 40%",
          scrub: 1,
          toggleActions: "play none none reverse"
        }
      });

      // Add glow effect on active card
      gsap.to(card, {
        scrollTrigger: {
          trigger: card,
          containerAnimation: horizontalScroll,
          start: "left 70%",
          end: "left 30%",
          onEnter: () => {
            card.classList.add("active-card");
            gsap.to(card, {
              boxShadow: "0 25px 50px -12px rgba(129, 140, 248, 0.5)",
              duration: 0.5
            });
          },
          onLeave: () => {
            card.classList.remove("active-card");
            gsap.to(card, {
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              duration: 0.5
            });
          },
          onEnterBack: () => {
            card.classList.add("active-card");
            gsap.to(card, {
              boxShadow: "0 25px 50px -12px rgba(129, 140, 248, 0.5)",
              duration: 0.5
            });
          },
          onLeaveBack: () => {
            card.classList.remove("active-card");
            gsap.to(card, {
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              duration: 0.5
            });
          }
        }
      });
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };

  }, { scope: sectionRef, dependencies: [] });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Function to set ref for each feature card
  const setFeatureCardRef = (el: HTMLDivElement | null, index: number) => {
    featureCardsRef.current[index] = el;
  };

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      {/* Animated background gradient */}
      <div 
        className="animated-bg absolute inset-0 opacity-10"
        style={{
          background: "linear-gradient(90deg, #E0E7FF 0%, #818CF8 25%, #6366F1 50%, #4F46E5 75%, #E0E7FF 100%)",
          backgroundSize: "200% 100%"
        }}
      ></div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 60 + 20 + 'px',
              height: Math.random() * 60 + 20 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              background: `radial-gradient(circle, ${['#E0E7FF', '#818CF8', '#6366F1'][i % 3]} 0%, transparent 70%)`,
              opacity: 0.1,
              filter: 'blur(20px)',
              animation: `float ${Math.random() * 10 + 10}s infinite ease-in-out`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-full relative z-10">
        {/* Header */}
        <div className="features-header text-center py-24 px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 rounded-full border" 
               style={{
                 backgroundColor: 'rgba(224, 231, 255, 0.1)',
                 borderColor: 'rgba(129, 140, 248, 0.3)'
               }}>
            <Check className="h-5 w-5" style={{ color: '#818CF8' }} />
            <span className="font-medium" style={{ color: 'black' }}>
              All-in-One Platform
            </span>
          </div>
          
          <h2 
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8"
            style={{ color: 'black' }}
          >
            Enterprise Features
          </h2>
          
          <p 
            className="text-xl sm:text-2xl max-w-3xl mx-auto px-4 py-6 rounded-2xl backdrop-blur-sm border"
            style={{
              color: 'black',
              backgroundColor: 'rgba(79, 70, 229, 0.05)',
              borderColor: 'rgba(99, 102, 241, 0.2)'
            }}
          >
            Everything you need to streamline your logistics operations and deliver exceptional service
          </p>
        </div>

        {/* Horizontal Scroll Container */}
        <div 
          ref={horizontalContainerRef} 
          className="horizontal-scroll-container h-screen flex items-center overflow-hidden relative"
        >
          {/* Scroll indicator */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20">
            <div className="flex flex-col items-center gap-3">
              <div className="text-sm font-medium" style={{ color: '#E0E7FF' }}>
                Scroll horizontally to explore
              </div>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#818CF8' }}></div>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6366F1' }}></div>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#4F46E5' }}></div>
              </div>
            </div>
          </div>

          <div 
            ref={cardsContainerRef}
            className="flex gap-12 px-8 py-12 items-center"
            style={{ willChange: "transform" }}
          >
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div 
                  ref={el => setFeatureCardRef(el, index)}
                  key={index} 
                  className="flex-shrink-0 w-96 sm:w-[480px] p-10 rounded-3xl cursor-pointer group relative overflow-hidden transform-gpu transition-all duration-500"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(224, 231, 255, 0.3)',
                    boxShadow: '0 20px 40px -20px rgba(99, 102, 241, 0.2)'
                  }}
                >
                  {/* Gradient border effect */}
                  <div 
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{
                      background: `linear-gradient(135deg, ${feature.color}33, ${feature.color}11)`,
                      padding: '2px',
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude'
                    }}
                  ></div>
                  
                  {/* Shimmer effect */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-1000"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${feature.color}, transparent)`,
                      transform: 'translateX(-100%)',
                      transition: 'transform 0.7s ease'
                    }}
                  ></div>
                  
                  {/* Icon Container with gradient */}
                  <div 
                    className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-8 group-hover:scale-110 transition-all duration-500 shadow-lg relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${feature.color}, ${feature.color}dd)`
                    }}
                  >
                    <IconComponent className="h-10 w-10 text-white relative z-10" />
                    {/* Icon glow */}
                    <div 
                      className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-500"
                      style={{
                        background: `radial-gradient(circle at center, ${feature.color} 0%, transparent 70%)`,
                        filter: 'blur(15px)'
                      }}
                    ></div>
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <h3 
                      className="text-3xl font-bold mb-6 transition-colors duration-300"
                      style={{ color: '#1f2937' }}
                    >
                      {feature.title}
                    </h3>
                    
                    <p 
                      className="leading-relaxed text-lg mb-8 transition-colors duration-300"
                      style={{ color: '#4b5563' }}
                    >
                      {feature.description}
                    </p>
                    
                    {/* Feature indicator */}
                    <div className="flex items-center gap-4 pt-8 border-t" style={{ borderColor: 'rgba(224, 231, 255, 0.5)' }}>
                      <div 
                        className="flex items-center justify-center w-10 h-10 rounded-full group-hover:scale-110 transition-transform duration-300 shadow"
                        style={{ backgroundColor: `${feature.color}15` }}
                      >
                        <Check className="h-5 w-5" style={{ color: feature.color }} />
                      </div>
                      <div>
                        <span className="font-semibold block" style={{ color: '#374151' }}>
                          Included in all plans
                        </span>
                        <span className="text-sm mt-1" style={{ color: '#818CF8' }}>
                          No extra cost
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats counter */}
        <div className="py-16 px-8 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { value: "99.9%", label: "Uptime", color: "#818CF8" },
              { value: "24/7", label: "Support", color: "#6366F1" },
              { value: "40%", label: "Cost Savings", color: "#4F46E5" },
              { value: "50+", label: "Integrations", color: "#818CF8" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div 
                  className="text-4xl sm:text-5xl font-bold mb-2"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom styles for floating animation
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0) scale(1);
          }
          33% {
            transform: translateY(-30px) translateX(20px) scale(1.1);
          }
          66% {
            transform: translateY(20px) translateX(-20px) scale(0.9);
          }
        }

        .active-card .shimmer-effect {
          transform: translateX(100%);
          transition: transform 0.7s ease;
        }
      `}</style> */}
    </section>
  );
};

export default Features;