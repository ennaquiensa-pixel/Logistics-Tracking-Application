import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface BarChartCardProps {
  data: { name: string; value: number }[];
  title: string;
  color?: string;
}

const BarChartCard: React.FC<BarChartCardProps> = ({
  data,
  title,
  color = "#3B82F6", // Tailwind blue-500
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-5">{title}</h3>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={35}>
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="#E5E7EB" // light gray grid
              vertical={false}
            />
           <XAxis
  dataKey="name"
  tick={{ fontSize: 12, fill: "#6B7280" }}
  axisLine={false}
  tickLine={false}
  interval={0}
  height={50}
  angle={-30} // rotate labels
  textAnchor="end"
/>

            <YAxis
              tick={{ fontSize: 12, fill: "#6B7280" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              }}
              cursor={{ fill: "rgba(59,130,246,0.1)" }}
            />
            <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartCard;
