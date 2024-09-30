import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { SuppliersProvider } from "./context/supplierContext.jsx";
import { DepartmentsProvider } from "./components/Department/departmentsContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SuppliersProvider>
      <DepartmentsProvider>
      <App />
      </DepartmentsProvider>
    </SuppliersProvider>
  </React.StrictMode>
);
