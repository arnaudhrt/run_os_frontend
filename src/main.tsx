import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="flex-1 bg-background min-h-screen">
      <App />
    </div>
    <Toaster />
  </StrictMode>
);
