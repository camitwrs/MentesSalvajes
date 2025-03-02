import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { UserRound, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../../../autenticacion/context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUsuarioRequest } from "../../../api/autenticacion";

export default function UserNav() {
  const { user, loading } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Al montar el componente, intenta obtener el usuario desde localStorage
    const storedUser = localStorage.getItem("userProfile");
    if (storedUser) {
      setUserProfile(JSON.parse(storedUser));
    }

    // Si el usuario desde el AuthContext está disponible, actualiza el localStorage
    if (user && user.nombreusuario && user.apellidousuario) {
      setUserProfile(user);
      localStorage.setItem("userProfile", JSON.stringify(user));
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      // Realiza la solicitud al backend para cerrar sesión
      await logoutUsuarioRequest();
      console.log("Sesión cerrada correctamente");

      // Elimina el perfil del usuario del localStorage
      localStorage.removeItem("userProfile");

      // Redirigir al usuario a la página de inicio de sesión
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!userProfile) {
    return <p>Error: Usuario no autenticado</p>;
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="solid"
          className="flex items-center rounded-md bg-white hover:bg-Moonstone hover:shadow"
        >
          <UserRound className="w-5 h-5 stroke-YankeesBlue" />
          <p className="text-YankeesBlue">
            {`${userProfile.nombreusuario} ${userProfile.apellidousuario}`}
          </p>
          <ChevronDown className="w-4 h-4 stroke-YankeesBlue" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
      <DropdownItem
        key="exit"
        className="flex items-cente p-2 rounded-md"
        onPress={handleLogout}
        textValue="Cerrar Sesión" // 👈 Añadir la propiedad textValue
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
