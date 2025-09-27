import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./Routes";
import "./index.css";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppRoutes />
    <Toaster position="top-right" reverseOrder={false} />
  </React.StrictMode>
);
