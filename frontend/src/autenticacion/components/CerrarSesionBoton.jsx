import { useNavigate } from "react-router-dom";

const CerrarSesionBoton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");

    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition duration-300"
    >
      Cerrar Sesión
    </button>
  );
};

export default CerrarSesionBoton;
