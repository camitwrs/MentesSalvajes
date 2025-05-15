import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./inicio/pages/HomePage";
import CuestionarioPage from "./cuestionario/pages/CuestionarioPage";
import ResumenPage from "../src/administracion/pages/ResumenPage"; // Asegúrate de importar el componente
import { AuthProvider } from "./autenticacion/context/AuthContext";
import LoginPage from "./autenticacion/pages/LoginPage";
import RegisterPage from "./autenticacion/pages/RegisterPage";
import IlustradorPage from "./ilustraciones/pages/IlustradorPage";
import EducadorPage from "./cuestionario/pages/EducadorPage";
import AdminPage from "./administracion/pages/AdminPage";
import ProtectedRoutes from "./ProtectedRoutes";
import Navbar from "./shared/components/Navbar";
import { HeroUIProvider } from "@heroui/react";
import EdicionPage from "./administracion/pages/EdicionPage";
import PerfilesEducadoresPage from "./administracion/pages/PerfilesEducadoresPage";
import SesionesPage from "./administracion/pages/SesionesPage";
import { useAuth } from "./autenticacion/context/AuthContext";
import { Navigate } from "react-router-dom";

// Componente para redirigir según el rol si ya está autenticado
const RedirectIfAuthenticated = ({ element }) => {
  const { estaAutenticado, user } = useAuth();

  if (estaAutenticado) {
    switch (user?.idrol) {
      case 1:
        return <Navigate to="/dashboard-educator" replace />;
      case 2:
        return <Navigate to="/dashboard-admin" replace />;
      case 4:
        return <Navigate to="/dashboard-artist" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return element;
};

function App() {
  return (
    <HeroUIProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* RUTAS PÚBLICAS (Sin Navbar) */}
            <Route path="/" element={<HomePage />} />
            <Route
              path="/login"
              element={<RedirectIfAuthenticated element={<LoginPage />} />}
            />
            <Route
              path="/register"
              element={<RedirectIfAuthenticated element={<RegisterPage />} />}
            />

            {/* PROTECTED ROUTES PARA EDUCADORES (ROL 1) */}
            <Route
              element={
                <>
                  <Navbar />
                  <ProtectedRoutes requiredRole={1} />
                </>
              }
            >
              <Route path="/dashboard-educator" element={<EducadorPage />} />
              <Route
                path="/cuestionario/:idcuestionario"
                element={<CuestionarioPage />}
              />
            </Route>

            {/* PROTECTED ROUTES PARA ADMINISTRADORES (ROL 2) */}
            <Route
              element={
                <>
                  <Navbar />
                  <ProtectedRoutes requiredRole={2} />
                </>
              }
            >
              <Route path="/dashboard-admin" element={<AdminPage />} />
              <Route
                path="/resumen/:idcuestionario"
                element={<ResumenPage />}
              />
              <Route
                path="/sesiones/:idcuestionario"
                element={<SesionesPage />}
              />
              <Route
                path="/editar-cuestionario/:idcuestionario"
                element={<EdicionPage />}
              />
              <Route
                path="/perfiles-educadores"
                element={<PerfilesEducadoresPage />}
              />
            </Route>

            {/* PROTECTED ROUTES PARA ILUSTRADORES (ROL 4) */}
            <Route
              element={
                <>
                  <Navbar />
                  <ProtectedRoutes requiredRole={4} />
                </>
              }
            >
              <Route path="/dashboard-artist" element={<IlustradorPage />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </HeroUIProvider>
  );
}

export default App;
