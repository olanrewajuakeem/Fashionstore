import React from "react";

const Orders = () => {
  const orders = [
    { id: 101, user: "Alice", total: 12000, status: "Pending" },
    { id: 102, user: "Bob", total: 8000, status: "Completed" },
    { id: 103, user: "Charlie", total: 6000, status: "Cancelled" },
  ];

  const statusClass = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-500 text-white px-2 py-1 rounded";
      case "Pending":
        return "bg-yellow-400 text-white px-2 py-1 rounded";
      case "Cancelled":
        return "bg-red-500 text-white px-2 py-1 rounded";
      default:
        return "bg-gray-400 text-white px-2 py-1 rounded";
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      <table className="min-w-full bg-white rounded shadow overflow-hidden">
        <thead className="bg-green-700 text-white">
          <tr>
            <th className="py-3 px-4">Order ID</th>
            <th className="py-3 px-4">User</th>
            <th className="py-3 px-4">Total (₦)</th>
            <th className="py-3 px-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
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
  );
};

export default Orders;
