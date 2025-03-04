import { useAuth } from "../../autenticacion/context/AuthContext";
import UserNav from "../../shared/components/UserNav";
import { useNavigate, useLocation } from "react-router-dom";

const roles = {
  1: "Educador",
  2: "Administrador",
  3: "Revisor",
  4: "Diseñador",
};

// Definir las rutas de dashboard según el rol del usuario
const dashboardRoutes = {
  1: "/dashboard-educator",
  2: "/dashboard-admin",
  3: "/dashboard-reviewer",
  4: "/dashboard-artist",
};

// Páginas donde no queremos mostrar el Navbar
const hiddenRoutes = ["/", "/login", "/register"];

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Obtener la ruta actual

  const rolUsuario = roles[user?.idrol] || "Usuario";
  const dashboardRoute = dashboardRoutes[user?.idrol] || "/";

  // Verificar si la ruta actual está en la lista de rutas ocultas
  if (hiddenRoutes.includes(location.pathname)) {
    return null; // No renderizar el Navbar en estas rutas
  }

  return (
    <div className="bg-YankeesBlue">
      <div className="flex h-20 items-center">
        {/* Texto clickeable para redirigir al dashboard */}
        <p
          className="font-bold text-2xl text-white px-6 cursor-pointer transition-transform duration-200 hover:scale-110"
          onClick={() => navigate(dashboardRoute)}
        >
          Bienvenido, {rolUsuario}
        </p>
        <div className="ml-auto items-center px-6">
          <UserNav />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
