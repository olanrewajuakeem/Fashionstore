import React, { useState } from "react";

const ContactSubmissions = () => {
  const [selected, setSelected] = useState(null);

  const submissions = [
    { id: 1, name: "Alice", email: "alice@example.com", message: "How do I track my order?" },
    { id: 2, name: "Bob", email: "bob@example.com", message: "Do you ship internationally?" },
    { id: 3, name: "Charlie", email: "charlie@example.com", message: "Love your products!" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Contact & Feedback Submissions</h1>
      <table className="min-w-full bg-white rounded shadow overflow-hidden">
        <thead className="bg-green-700 text-white">
          <tr>
            <th className="py-3 px-4">ID</th>
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Email</th>
            <th className="py-3 px-4">Message</th>
            <th className="py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((sub) => (
            <tr key={sub.id} className="border-b hover:bg-green-50">
              <td className="py-2 px-4">{sub.id}</td>
              <td className="py-2 px-4">{sub.name}</td>
              <td className="py-2 px-4">{sub.email}</td>
              <td className="py-2 px-4 truncate max-w-xs">{sub.message}</td>
              <td className="py-2 px-4 flex gap-2">
                <button
                  onClick={() => setSelected(sub)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                >
                  View
                </button>
                <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Submission Details</h2>
            <p>
              <strong>ID:</strong> {selected.id}
            </p>
            <p>
              <strong>Name:</strong> {selected.name}
            </p>
            <p>
              <strong>Email:</strong> {selected.email}
            </p>
            <p className="mt-2">
              <strong>Message:</strong>
            </p>
            <p className="bg-gray-100 p-2 rounded mt-1">{selected.message}</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setSelected(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                Close
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactSubmissions;
