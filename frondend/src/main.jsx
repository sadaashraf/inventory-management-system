import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { SuppliersProvider } from "./context/supplierContext.jsx";
import { DepartmentsProvider } from "./components/Department/departmentsContext.jsx";
import { StockProvider } from "./context/stocksContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <StockProvider>
      <SuppliersProvider>
        <DepartmentsProvider>
          <App />
        </DepartmentsProvider>
      </SuppliersProvider>
    </StockProvider>
  </React.StrictMode>
);
