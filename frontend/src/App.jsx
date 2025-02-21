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

          {/* Protected routes with role-based access */}
          <Route element={<ProtectedRoutes requiredRole={1} />}>
            <Route path="/dashboard-educator" element={<EducadorPage />} />
          </Route>

          <Route element={<ProtectedRoutes requiredRole={2} />}>
            <Route path="/dashboard-admin" element={<AdminPage />} />
          </Route>

          <Route element={<ProtectedRoutes requiredRole={4} />}>
            <Route path="/dashboard-artist" element={<IlustradorPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
