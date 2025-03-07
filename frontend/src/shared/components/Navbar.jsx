import { useState } from "react";
import { useAuth } from "../../autenticacion/context/AuthContext";
import UserNav from "../../shared/components/UserNav";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const roles = {
  1: "Educador",
  2: "Administrador",
  3: "Revisor",
  4: "Diseñador",
};

const dashboardRoutes = {
  1: "/dashboard-educator",
  2: "/dashboard-admin",
  3: "/dashboard-reviewer",
  4: "/dashboard-artist",
};

const hiddenRoutes = ["/", "/login", "/register"];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const rolUsuario = roles[user?.idrol] || "Usuario";
  const dashboardRoute = dashboardRoutes[user?.idrol] || "/";

  if (hiddenRoutes.includes(location.pathname)) {
    return null;
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateToDashboard = () => {
    navigate(dashboardRoute);
    setIsMenuOpen(false);
  };

  return (
    <div className="bg-YankeesBlue shadow-md">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Alineación corregida en pantallas grandes */}
        <div className="flex items-center h-16 md:h-20">
          {/* Texto Bienvenido alineado a la izquierda */}
          <p
            className="font-bold text-lg md:text-2xl text-white cursor-pointer transition-transform duration-200 hover:scale-105 ml-4 lg:ml-8"
            onClick={navigateToDashboard}
          >
            Bienvenido, {rolUsuario}
          </p>

          {/* UserNav alineado a la derecha en pantallas grandes */}
          <div className="ml-auto hidden md:block">
            <UserNav />
          </div>

          {/* Botón de menú móvil */}
          <div className="md:hidden ml-auto">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-white hover:bg-YankeesBlue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-transform duration-200 ease-in-out"
              aria-expanded={isMenuOpen}
              aria-label="Menú principal"
            >
              {isMenuOpen ? (
                <X className="h-7 w-7" aria-hidden="true" />
              ) : (
                <Menu className="h-7 w-7" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <div className={`fixed inset-0 z-50 bg-black bg-opacity-50 ${isMenuOpen ? "block" : "hidden"} md:hidden`}>
        <div className="absolute top-0 right-0 w-3/4 sm:w-2/5 h-full bg-YankeesBlue shadow-lg transform transition-transform duration-300 ease-in-out">
          <div className="flex justify-between items-center p-4 border-b border-YankeesBlue-700">
            <p className="text-white text-lg font-bold">Menú</p>
            <button
              onClick={toggleMenu}
              className="text-white hover:text-gray-300 transition duration-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="px-4 py-3 space-y-4">
            <button
              onClick={navigateToDashboard}
              className="w-full text-left text-white font-medium py-2 px-4 rounded-md hover:bg-YankeesBlue-700 transition duration-200"
            >
              Ir a Dashboard
            </button>
            <div className="border-t border-gray-600 pt-3">
              <UserNav isMobile={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;