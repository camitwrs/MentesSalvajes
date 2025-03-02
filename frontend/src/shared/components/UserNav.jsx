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

export default function UserNav() {
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
    console.log("Cargando usuario... Estado de carga:", loading);
    return <p>Cargando usuario...</p>;
  }

  if (!user || !user.nombreusuario || !user.apellidousuario) {
    console.log("Error: Usuario no autenticado o datos incompletos.", user);
    return <p>Error: Usuario no autenticado</p>;
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="solid"
          className="flex items-center rounded-md bg-white"
        >
          <UserRound className="w-5 h-5 stroke-YankeesBlue" />
          <p className="text-YankeesBlue">
            {`${user.nombreusuario} ${user.apellidousuario}`}
          </p>
          <ChevronDown className="w-4 h-4 stroke-YankeesBlue" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem
          key="exit"
          className="flex items-cente p-2 rounded-md"
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
