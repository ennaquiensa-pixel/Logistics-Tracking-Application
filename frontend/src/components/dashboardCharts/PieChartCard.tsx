import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface PieChartCardProps {
  data: { name: string; value: number }[];
  title: string;
  colors?: string[];
}

const PieChartCard: React.FC<PieChartCardProps> = ({ 
  data, 
  title, 
  colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'] 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
            //check if there is a value empty do not show that in the pie chart
              data={data.filter(entry => entry.value > 0)}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(props) => `${props.name} (${(Number(props.percent ?? 0) * 100).toFixed(0)}%)`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PieChartCard;