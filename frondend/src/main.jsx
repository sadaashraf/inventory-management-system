import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { SuppliersProvider } from "./context/supplierContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SuppliersProvider>
      <App />
    </SuppliersProvider>
  </React.StrictMode>
);
