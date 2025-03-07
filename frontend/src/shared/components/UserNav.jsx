import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { UserRound, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../../autenticacion/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { logoutUsuarioRequest } from "../../api/autenticacion";
import PropTypes from "prop-types";

export default function UserNav({ isMobile = false }) {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUsuarioRequest();
      console.log("Sesión cerrada correctamente");

      logout();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // Manejo del estado de carga y autenticación
  if (loading) {
    return <p className="text-sm text-white animate-pulse">Cargando...</p>;
  }

  if (!user || !user.nombreusuario || !user.apellidousuario) {
    return (
      <p className="text-sm text-red-300">Error: Usuario no autenticado</p>
    );
  }

  // Si es móvil, mostrar una versión mejorada con clara diferenciación visual
  if (isMobile) {
    return (
      <div className="flex flex-col items-center bg-gray-900 p-4 rounded-md shadow-lg w-full max-w-xs mx-auto">
        {/* Sección de usuario */}
        <div className="flex items-center space-x-3 mb-4">
          <UserRound className="w-6 h-6 text-white" />
          <span className="text-white font-semibold text-lg">
            {`${user.nombreusuario} ${user.apellidousuario}`}
          </span>
        </div>

        {/* Botón de cerrar sesión */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center space-x-2 py-2 px-4 rounded-md bg-Moonstone text-white w-full transition-transform transform hover:scale-105 active:scale-95"
          aria-label="Cerrar sesión"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    );
  }

  // Versión para escritorio con dropdown
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button
          variant="solid"
          className="flex items-center gap-2 rounded-md bg-white px-3 py-2 hover:bg-gray-100 transition-colors"
        >
          <UserRound className="w-5 h-5 stroke-YankeesBlue" />
          <p className="text-YankeesBlue text-sm md:text-base truncate max-w-[120px] md:max-w-[200px]">
            {`${user.nombreusuario} ${user.apellidousuario}`}
          </p>
          <ChevronDown className="w-4 h-4 stroke-YankeesBlue" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Opciones de usuario">
        <DropdownItem
          key="exit"
          className="flex items-center p-2 rounded-md hover:bg-gray-100"
          onPress={handleLogout}
          textValue="Cerrar Sesión"
        >
          <div className="flex items-center space-x-2">
            <LogOut className="w-4 h-4" />
            <p className="text-YankeesBlue">Cerrar Sesión</p>
          </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

UserNav.propTypes = {
  isMobile: PropTypes.bool,
};
