import { Toaster } from "react-hot-toast";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

import { AuthProvider } from "./contexts/AuthContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
  <AuthProvider>
    <App />

    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          borderRadius: "12px",
          background: "#1f2937",
          color: "#fff",
        },
        success: {
          style: {
            background: "#047857",
          },
        },
        error: {
          style: {
            background: "#b91c1c",
          },
        },
      }}
    />
  </AuthProvider>
</StrictMode>
);