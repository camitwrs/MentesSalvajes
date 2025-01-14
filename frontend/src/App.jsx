import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import CuestionarioPage from "./pages/CuestionarioPage";
import FormContext from "./context/FormContext"; // Asegúrate de la ruta correcta

import LoginPage from "./pages/LoginPage";
import IllustratorPage from "./pages/IllustratorPage";



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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/illustrator" element={<IllustratorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
