import React from "react";
import { Users, Truck } from "lucide-react";

const drivers = [
  { name: "Driver 1", activeDeliveries: 2 },
  { name: "Driver 2", activeDeliveries: 1 },
  { name: "Driver 3", activeDeliveries: 3 },
];

const LivreursPageLivreur: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-white">Livreurs Monitoring</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {drivers.map((driver, idx) => (
          <div key={idx} className="p-4 bg-gray-800 rounded-lg text-white flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Users />
              <h3 className="font-semibold">{driver.name}</h3>
            </div>
            <div className="flex items-center gap-2">
              <Truck />
              <span>{driver.activeDeliveries} Active Deliveries</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LivreursPageLivreur;
