import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import CuestionarioPage from "./pages/CuestionarioPage";
import FormContext from "./context/FormContext"; // Asegúrate de la ruta correcta

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* Ruta por defecto */}
        <Route
          path="/cuestionario"
          element={
            <FormContext>
              <CuestionarioPage />
            </FormContext>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
