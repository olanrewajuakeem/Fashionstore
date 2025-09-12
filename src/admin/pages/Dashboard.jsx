import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const salesData = [
    { day: "Mon", sales: 50000 },
    { day: "Tue", sales: 75000 },
    { day: "Wed", sales: 30000 },
    { day: "Thu", sales: 90000 },
    { day: "Fri", sales: 60000 },
    { day: "Sat", sales: 120000 },
    { day: "Sun", sales: 100000 },
  ];

  const recentOrders = [
    { id: 101, user: "Alice", total: 80000, status: "Pending" },
    { id: 102, user: "Bob", total: 16000, status: "Completed" },
    { id: 103, user: "Charlie", total: 6000, status: "Cancelled" },
  ];

  const statusClass = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-500 text-white px-2 py-1 rounded text-sm";
      case "Pending":
        return "bg-yellow-400 text-white px-2 py-1 rounded text-sm";
      case "Cancelled":
        return "bg-red-500 text-white px-2 py-1 rounded text-sm";
      default:
        return "bg-gray-400 text-white px-2 py-1 rounded text-sm";
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded shadow p-4 hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-green-700">Total Users</h2>
          <p className="text-2xl font-bold">1,234</p>
        </div>
        <div className="bg-white rounded shadow p-4 hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-green-700">Total Orders</h2>
          <p className="text-2xl font-bold">567</p>
        </div>
        <div className="bg-white rounded shadow p-4 hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-green-700">Products</h2>
          <p className="text-2xl font-bold">89</p>
        </div>
        <div className="bg-white rounded shadow p-4 hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-green-700">Revenue</h2>
          <p className="text-2xl font-bold">₦12,345,000</p>
        </div>
      </div>

      <div className="bg-white rounded shadow p-4 mb-6">
        <h2 className="text-xl font-bold mb-4 text-green-700">Weekly Sales</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />
            <Line type="monotone" dataKey="sales" stroke="#16a34a" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded shadow p-4">
        <h2 className="text-xl font-bold mb-4 text-green-700">Recent Orders</h2>
        <table className="min-w-full bg-white rounded shadow overflow-hidden">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-green-50">
                <td className="py-2 px-4">{order.id}</td>
                <td className="py-2 px-4">{order.user}</td>
                <td className="py-2 px-4">₦{order.total.toLocaleString()}</td>
                <td className="py-2 px-4">
                  <span className={statusClass(order.status)}>{order.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
