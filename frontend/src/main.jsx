import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Tailwind directives (see below):contentReference[oaicite:23]{index=23}
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        {/* Provide auth context to all components */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
