import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import HomePage from "./inicio/pages/HomePage";
import CuestionarioPage from "./cuestionario/pages/CuestionarioPage";
import FormContext from "./cuestionario/context/FormContext";

import LoginPage from "./autenticacion/pages/LoginPage";
import RegisterPage from "./autenticacion/pages/RegisterPage";
import IlustradorPage from "./ilustraciones/pages/IlustradorPage";
import EducadorPage from "./cuestionario/pages/EducadorPage";
import AdminPage from "./administracion/pages/AdminPage";
import { AuthProvider } from "./autenticacion/context/AuthContext";
import ProtectedRoutes from "./ProtectedRoutes";

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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoutes />}>
            <Route path="/dashboard-educator" element={<EducadorPage />} />
            <Route path="/dashboard-artist" element={<IlustradorPage />} />
            <Route path="/dashboard-admin" element={<AdminPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
