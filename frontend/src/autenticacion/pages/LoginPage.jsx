import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../../../global/schemas/autenticacion.schema";
import logo from "../../shared/assets/logo.svg";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data) => {
    console.log("Datos enviados:", data);
    // enviar los datos a la api
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <img
            src={logo}
            alt="Mentes Salvajes"
            className="mx-auto w-14 h-14 p-2 mb-2 my-3 bg-YankeesBlue rounded-full"
          />
          <h1 className="text-2xl font-bold mt-3 text-gray-800">
            Iniciar sesión
          </h1>
        </div>
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
                className={`mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm focus:outline-none focus:border-orange-500 text-sm h-12 pl-10 ${
                  errors.correousuario ? "border-red-500" : ""
                }`}
              />
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
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
                className={`mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm focus:outline-none focus:border-orange-500 text-sm h-12 pl-10 ${
                  errors.contrasenausuario ? "border-red-500" : ""
                }`}
              />
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <LockClosedIcon className="h-5 w-5 text-gray-400" />
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
            <a
              href="/register"
              className="text-Moonstone hover:text-cyan-700 font-medium"
            >
              Crear una cuenta
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
