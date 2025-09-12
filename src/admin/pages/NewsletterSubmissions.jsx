import React from "react";

const NewsletterSubmissions = () => {
  const subscriptions = [
    { id: 1, email: "alice@example.com" },
    { id: 2, email: "bob@example.com" },
    { id: 3, email: "charlie@example.com" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Newsletter Subscriptions</h1>
      <table className="min-w-full bg-white rounded shadow overflow-hidden">
        <thead className="bg-green-700 text-white">
          <tr>
            <th className="py-3 px-4">ID</th>
            <th className="py-3 px-4">Email</th>
            <th className="py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map(sub => (
            <tr key={sub.id} className="border-b hover:bg-green-50">
              <td className="py-2 px-4">{sub.id}</td>
              <td className="py-2 px-4">{sub.email}</td>
              <td className="py-2 px-4 flex gap-2">
                <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NewsletterSubmissions;
