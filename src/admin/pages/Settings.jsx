import React, { useState } from "react";

const Settings = () => {
  const [profile, setProfile] = useState({ name: "Admin", email: "admin@example.com" });
  const handleProfileChange = e => setProfile({ ...profile, [e.target.name]: e.target.value });

  const [password, setPassword] = useState({ current: "", new: "", confirm: "" });
  const handlePasswordChange = e => setPassword({ ...password, [e.target.name]: e.target.value });

  const [preferences, setPreferences] = useState({ theme: "light", currency: "₦", notifications: true });
  const handlePreferencesChange = e => {
    const { name, value, type, checked } = e.target;
    setPreferences({ ...preferences, [name]: type === "checkbox" ? checked : value });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-bold text-green-700 mb-4">Admin Profile</h2>
          <form className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
              placeholder="Name"
              className="border px-3 py-2 rounded focus:ring-2 focus:ring-green-500"
            />
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleProfileChange}
              placeholder="Email"
              className="border px-3 py-2 rounded focus:ring-2 focus:ring-green-500"
            />
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">Update</button>
          </form>
        </div>

        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-bold text-green-700 mb-4">Change Password</h2>
          <form className="flex flex-col gap-4">
            <input
              type="password"
              name="current"
              value={password.current}
              onChange={handlePasswordChange}
              placeholder="Current Password"
              className="border px-3 py-2 rounded focus:ring-2 focus:ring-green-500"
            />
            <input
              type="password"
              name="new"
              value={password.new}
              onChange={handlePasswordChange}
              placeholder="New Password"
              className="border px-3 py-2 rounded focus:ring-2 focus:ring-green-500"
            />
            <input
              type="password"
              name="confirm"
              value={password.confirm}
              onChange={handlePasswordChange}
              placeholder="Confirm New Password"
              className="border px-3 py-2 rounded focus:ring-2 focus:ring-green-500"
            />
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">Change</button>
          </form>
        </div>

             </div>
    </div>
  );
};

export default Settings;


