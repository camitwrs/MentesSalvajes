import { useAuth } from "../../autenticacion/context/AuthContext";
import UserNav from "../../shared/components/UserNav";

const roles = {
  1: "Educador",
  2: "Administrador",
  3: "Revisor",
  4: "Diseñador",
};

const Navbar = () => {
  const { user } = useAuth();

  const rolUsuario = roles[user.idrol];

  return (
    <div className="bg-YankeesBlue">
      <div className="flex h-20 items-center">
        <p className="font-bold text-2xl text-white px-6">
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
