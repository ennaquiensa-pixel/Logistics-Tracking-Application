import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line } from "recharts";

const deliveryStats = [
  { day: "Mon", completed: 5 },
  { day: "Tue", completed: 7 },
  { day: "Wed", completed: 6 },
  { day: "Thu", completed: 8 },
  { day: "Fri", completed: 4 },
];

const LivreurAnalyticsPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-white">Performance Analytics</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-4 bg-gray-800 rounded-lg">
          <h3 className="text-white font-semibold mb-2">Deliveries Per Day</h3>
          <BarChart width={400} height={250} data={deliveryStats}>
            <XAxis dataKey="day" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Bar dataKey="completed" fill="#00ff99" />
          </BarChart>
        </div>

        <div className="p-4 bg-gray-800 rounded-lg">
          <h3 className="text-white font-semibold mb-2">Average Delivery Time (hrs)</h3>
          <LineChart width={400} height={250} data={deliveryStats}>
            <XAxis dataKey="day" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Line type="monotone" dataKey="completed" stroke="#ffbb33" strokeWidth={3} />
          </LineChart>
        </div>
      </div>
    </div>
  );
};

export default LivreurAnalyticsPage;
