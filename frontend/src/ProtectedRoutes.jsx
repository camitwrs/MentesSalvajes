import { useAuth } from "./autenticacion/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoutes() {
  const { loading, estaAutenticado } = useAuth();

  if (loading) return <h1>Cargando...</h1>;

  if (!loading && !estaAutenticado) return <Navigate to="/login" replace />;

  return <Outlet />;
}

export default ProtectedRoutes;
