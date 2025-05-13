import { useState } from "react";
import { useAuth } from "../../autenticacion/context/AuthContext";
import UserNav from "../../shared/components/UserNav";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, House } from "lucide-react";

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
          <div className="flex items-center font-bold text-lg md:text-2xl text-white transition-transform duration-200">
            {/* Ícono House clickeable */}
            <House
              className="w-8 h-8 mr-4 cursor-pointer transition-transform duration-200 hover:scale-110"
              onClick={navigateToDashboard}
            />
            {/* Texto Bienvenido */}
            <p className="text-lg font-normal">Bienvenido, {rolUsuario}</p>
          </div>

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
      <div
        className={`fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        } md:hidden`}
      >
        {/* Contenedor del menú con animación de deslizamiento hacia abajo */}
        <div
          className={`absolute top-0 left-0 w-full bg-YankeesBlue shadow-lg transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          {/* Header del menú con botón de cierre */}
          <div className="flex justify-between items-center p-4 border-b border-YankeesBlue-700">
            <p className="text-white text-lg font-bold">Menú</p>
            <button
              onClick={toggleMenu}
              className="text-white hover:text-gray-300 transition duration-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Contenido del menú */}
          <div className="p-4">
            <UserNav isMobile={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
