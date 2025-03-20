import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../../../backend/schemas/autenticacion.schema";
import { useAuth } from "../context/AuthContext";
import logo from "../../shared/assets/logo.svg";
import { Mail, Lock } from "lucide-react";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const { logearse, estaAutenticado, user, errors: loginErrors } = useAuth();

  const navigate = useNavigate();
  useEffect(() => {
    if (estaAutenticado) {
      switch (user?.idrol) {
        case 1:
          navigate("/dashboard-educator");
          break;
        case 2:
          navigate("/dashboard-admin");
          break;
        case 4:
          navigate("/dashboard-artist");
          break;
        default:
          navigate("/");
      }
    }
  }, [estaAutenticado, navigate, user?.idrol]);

  const onSubmit = handleSubmit((data) => {
    logearse(data);
  });

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <img
            src={logo}
            alt="Mentes Salvajes"
            className="mx-auto w-14 h-14 p-2 mb-2 my-3 bg-YankeesBlue rounded-full"
          />
          <h1 className="text-2xl font-bold mt-3 text-gray-800">
            Inicia sesión
          </h1>
        </div>
        {Array.isArray(loginErrors) &&
          loginErrors.length > 0 &&
          loginErrors.map((error, i) => (
            <div
              className="text-center font-bold text-orange-500 text-sm p-2"
              key={i}
            >
              {error}
            </div>
          ))}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="correousuario"
              className="block text-sm font-medium text-gray-700"
            >
              Correo electrónico
            </label>
            <div className="relative">
              <input
                type="email"
                id="correousuario"
                placeholder="Ingresa tu correo"
                {...register("correousuario")}
                className={`input-field ${
                  errors.correousuario ? "border-red-500" : ""
                }`}
              />
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-gray-400" />
              </span>
            </div>
            {errors.correousuario && (
              <p className="text-red-500 text-sm mt-1">
                {errors.correousuario.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="contrasenausuario"
              className="block text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Ingresa tu contraseña"
                id="contrasenausuario"
                {...register("contrasenausuario")}
                className={`input-field ${
                  errors.contrasenausuario ? "border-red-500" : ""
                }`}
              />
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-400" />
              </span>
            </div>
            {errors.contrasenausuario && (
              <p className="text-red-500 text-sm mt-1">
                {errors.contrasenausuario.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-Moonstone text-white py-2 px-4 rounded-md hover:bg-cyan-700 focus:outline-none focus:border-orange-500"
          >
            Ingresar
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            ¿Eres nuevo?{" "}
            <Link
              to="/register"
              className="text-Moonstone hover:text-cyan-700 font-medium"
            >
              Crear una cuenta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
