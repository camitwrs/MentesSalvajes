import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import logo from "../../shared/assets/logo.svg";
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  BookOpenIcon,
  PuzzlePieceIcon,
} from "@heroicons/react/24/outline";

// Definir el esquema de validación con Zod
const registerSchema = z.object({
  correousuario: z
    .string()
    .email("Por favor, introduce un correo válido.")
    .nonempty("El correo es obligatorio."),
  contrasenausuario: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres.")
    .nonempty("La contraseña es obligatoria."),
  nombreusuario: z
    .string()
    .nonempty("El nombre es obligatorio.")
    .refine((value) => isNaN(Number(value)), {
      message: "El nombre no puede ser un número.",
    }),
  apellidousuario: z
    .string()
    .nonempty("El apellido es obligatorio.")
    .refine((value) => isNaN(Number(value)), {
      message: "El apellido no puede ser un número.",
    }),
  tituloprofesionaleducador: z
    .string()
    .nonempty("Los estudios son obligatorios.")
    .refine((value) => isNaN(Number(value)), {
      message: "Los estudios no pueden ser un número.",
    }),
  intereseseducador: z
    .string()
    .optional()
    .refine((value) => isNaN(Number(value)), {
      message: "Los intereses no pueden ser un número.",
    }),
});

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data) => {
    console.log("Datos enviados:", data);
    // enviar los datos a la api
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
        <div className="text-center mb-4">
          <img
            src={logo}
            alt="Mentes Salvajes"
            className="mx-auto w-14 h-14 p-2 mb-2 my-3 bg-YankeesBlue rounded-full"
          />
          <h1 className="text-2xl font-bold mt-3 text-gray-800">Regístrate</h1>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Columna Izquierda */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="nombreusuario"
                className="block text-sm font-medium text-gray-700"
              >
                Nombre
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="¿Cuál es tu nombre?"
                  id="nombreusuario"
                  {...register("nombreusuario")}
                  className={`mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm  focus:outline-none focus:border-orange-500 text-sm h-12 pl-10 ${
                    errors.nombreusuario ? "  " : ""
                  }`}
                />
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </span>
              </div>
              {errors.nombreusuario && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.nombreusuario.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="apellidousuario"
                className="block text-sm font-medium text-gray-700"
              >
                Apellido
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="apellidousuario"
                  placeholder="¿Cuál es tu apellido?"
                  {...register("apellidousuario")}
                  className={`mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm focus:outline-none focus:border-orange-500 text-sm h-12 pl-10 ${
                    errors.apellidousuario ? "border-red-500" : ""
                  }`}
                />
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </span>
              </div>
              {errors.apellidousuario && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.apellidousuario.message}
                </p>
              )}
            </div>

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
                  placeholder="Ingresa tu correo"
                  id="correousuario"
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
          </div>

          {/* Columna Derecha */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="tituloprofesionaleducador"
                className="block text-sm font-medium text-gray-700"
              >
                Estudios
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="¿Cuál es tu ocupación?"
                  id="tituloprofesionaleducador"
                  {...register("tituloprofesionaleducador")}
                  className={`mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm focus:outline-none focus:border-orange-500 text-sm h-12 pl-10 ${
                    errors.tituloprofesionaleducador ? "border-red-500" : ""
                  }`}
                />
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <BookOpenIcon className="h-5 w-5 text-gray-400" />
                </span>
              </div>
              {errors.tituloprofesionaleducador && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.tituloprofesionaleducador.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="intereseseducador"
                className="block text-sm font-medium text-gray-700"
              >
                Intereses y gustos
              </label>
              <div className="relative">
                <textarea
                  id="intereseseducador"
                  placeholder="¿Qué hobbies tienes? ¿Qué temas te apasionan?"
                  {...register("intereseseducador")}
                  className={`mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm focus:outline-none focus:border-orange-500 text-sm h-28 pl-10 pr-3 pt-2 resize-none ${
                    errors.intereseseducador ? "border-red-500" : ""
                  }`}
                ></textarea>
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <PuzzlePieceIcon className="h-5 w-5 text-gray-400" />
                </span>
              </div>
              {errors.intereseseducador && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.intereseseducador.message}
                </p>
              )}
            </div>
          </div>

          {/* Botón de Registro */}
          <div className="col-span-1 md:col-span-2 text-center">
            <button
              type="submit"
              className="w-full bg-Moonstone text-white py-2 px-4 rounded-md hover:bg-cyan-700 focus:outline-none focus:border-orange-500"
            >
              Registrarse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
