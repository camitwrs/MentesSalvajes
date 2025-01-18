import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import CuestionarioPage from "./pages/CuestionarioPage";
import FormContext from "./context/FormContext";

import IniciarSesionPage from "./pages/IniciarSesionPage";
import IlustradorPage from "./pages/IlustradorPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/cuestionario"
          element={
            <FormContext>
              <CuestionarioPage />
            </FormContext>
          }
        />
        <Route path="/login" element={<IniciarSesionPage />} />
        <Route path="/illustrator" element={<IlustradorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
