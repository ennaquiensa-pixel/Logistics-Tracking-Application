import React from "react";
import { Truck, Warehouse, Map, Users } from "lucide-react";

const services = [
  { icon: <Truck className="h-8 w-8 text-yellow-400" />, title: "Delivery Management" },
  { icon: <Warehouse className="h-8 w-8 text-yellow-400" />, title: "Warehouse Management" },
  { icon: <Map className="h-8 w-8 text-yellow-400" />, title: "Route Optimization" },
  { icon: <Users className="h-8 w-8 text-yellow-400" />, title: "User Management" },
];

const Services: React.FC = () => (
  <section className="py-16 bg-black text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl font-bold mb-12">Our Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {services.map((service, index) => (
          <div key={index} className="flex flex-col items-center gap-4 p-6 bg-gray-900 rounded shadow hover:shadow-lg transition">
            {service.icon}
            <h3 className="text-xl font-semibold">{service.title}</h3>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Services;
