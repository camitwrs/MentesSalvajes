import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import HomePage from "./inicio/pages/HomePage";
import CuestionarioPage from "./cuestionario/pages/CuestionarioPage";
import FormContext from "./cuestionario/context/FormContext";

import LoginPage from "./autenticacion/pages/LoginPage";
import RegisterPage from "./autenticacion/pages/RegisterPage";
import IlustradorPage from "./ilustraciones/pages/IlustradorPage";
import EducadorPage from "./cuestionario/pages/EducadorPage";
import { AuthProvider } from "./autenticacion/context/AuthContext";

function App() {
  return (
    <AuthProvider>
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
          <Route path="/dashboard" element={<EducadorPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/illustrator" element={<IlustradorPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
