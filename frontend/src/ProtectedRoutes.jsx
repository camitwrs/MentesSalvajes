import { useAuth } from "./autenticacion/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import { PropTypes } from "prop-types";
import { FormProvider } from "./cuestionario/context/FormContext";

function ProtectedRoutes({ requiredRole }) {
  const { loading, estaAutenticado, user } = useAuth();

  if (loading) return <h1>Cargando...</h1>;

  if (!estaAutenticado) return <Navigate to="/login" replace />;

  if (requiredRole && user?.idrol !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // Envolver solo si es un educador (rol 1)
  if (requiredRole === 1) {
    return (
      <FormProvider>
        <Outlet />
      </FormProvider>
    );
  }

  return <Outlet />;
}

ProtectedRoutes.propTypes = {
  requiredRole: PropTypes.number, // Validate that requiredRole is a number
};

export default ProtectedRoutes;
