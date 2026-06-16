import React from "react";

const warehouseData = [
  { item: "Item A", stock: 50, status: "OK" },
  { item: "Item B", stock: 5, status: "Low" },
  { item: "Item C", stock: 0, status: "Out of Stock" },
];

const LivreurWarehousePage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-white">Warehouse Overview</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="p-2">Item</th>
            <th className="p-2">Stock</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {warehouseData.map((item, idx) => (
            <tr key={idx} className="border-b border-gray-700">
              <td className="p-2">{item.item}</td>
              <td className="p-2">{item.stock}</td>
              <td className={`p-2 font-semibold ${item.status === "Low" ? "text-yellow-400" : item.status === "Out of Stock" ? "text-red-500" : "text-green-400"}`}>
                {item.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LivreurWarehousePage;
