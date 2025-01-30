import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../../../global/schemas/autenticacion.schema";
import { registrarEducadorRequest } from "../../api/autenticacion";
import {
  getAlternativasPorPreguntaRequest,
  getUniversidadesPorPaisRequest,
} from "../../api/alternativas";
import logo from "../../shared/assets/logo.svg";
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  BookOpenIcon,
  PuzzlePieceIcon,
  GlobeAmericasIcon,
  CakeIcon,
  BuildingOffice2Icon,
  UsersIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      paiseducador: "", // Valor predeterminado para el campo país
      institucioneducador: "", // Valor predeterminado para el campo institución
      sexoeducador: "", // Valor predeterminado para el campo sexo
    },
  });

  const [paises, setPaises] = useState([]);
  const [instituciones, setInstituciones] = useState([]);
  const [selectedPais, setSelectedPais] = useState("");

  // Cargar los países desde la API al renderizar el componente
  useEffect(() => {
    const getPaisesInstituciones = async () => {
      try {
        // Cargar países
        const paisesResponse = await getAlternativasPorPreguntaRequest(5);
        setPaises(paisesResponse.data);

        // Si hay un país seleccionado, cargar instituciones para ese país
        if (selectedPais) {
          const institucionesResponse = await getUniversidadesPorPaisRequest(
            selectedPais
          );
          const institucionesNombres = institucionesResponse.data.map(
            (uni) => uni.name
          );
          setInstituciones(institucionesNombres);
        } else {
          setInstituciones([]); // Si no hay país seleccionado, limpiar instituciones
        }
      } catch (error) {
        console.error("Error al cargar los países y las instituciones:", error);
      }
    };

    getPaisesInstituciones();
  }, [selectedPais]);

  // Enviar los datos del registro  a la API
  const onSubmit = async (data) => {
    console.log("Datos enviados:", data);
    const respuesta = await registrarEducadorRequest(data);
    console.log("Datos recibidos:", respuesta);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg sm:max-w-2xl">
        <div className="text-center mb-4">
          <img
            src={logo}
            alt="Mentes Salvajes"
            className="mx-auto w-12 h-12 p-2 mb-2 bg-YankeesBlue rounded-full"
          />
          <h1 className="text-xl sm:text-2xl font-bold mt-3 text-gray-800">
            Regístrate
          </h1>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6"
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
                  className={`mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm text-sm pl-10 h-10 sm:h-12 focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${
                    errors.nombreusuario ? "border-orange-500" : ""
                  }`}
                />
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </span>
              </div>
              {errors.nombreusuario && (
                <p className="text-orange-500 text-xs mt-1">
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
                    errors.apellidousuario ? "border-orange-500" : ""
                  }`}
                />
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </span>
              </div>
              {errors.apellidousuario && (
                <p className="text-orange-500 text-xs mt-1">
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
                    errors.correousuario ? "border-orange-500" : ""
                  }`}
                />
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </span>
              </div>
              {errors.correousuario && (
                <p className="text-orange-500 text-xs mt-1">
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
                    errors.contrasenausuario ? "border-orange-500" : ""
                  }`}
                />
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </span>
              </div>
              {errors.contrasenausuario && (
                <p className="text-orange-500 text-xs mt-1">
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
                Profesión
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="¿Cuál es tu ocupación?"
                  id="tituloprofesionaleducador"
                  {...register("tituloprofesionaleducador")}
                  className={`mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm focus:outline-none focus:border-orange-500 text-sm h-12 pl-10 ${
                    errors.tituloprofesionaleducador ? "border-orange-500" : ""
                  }`}
                />
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <BookOpenIcon className="h-5 w-5 text-gray-400" />
                </span>
              </div>
              {errors.tituloprofesionaleducador && (
                <p className="text-orange-500 text-xs mt-1">
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
                    errors.intereseseducador ? "border-orange-500" : ""
                  }`}
                ></textarea>
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <PuzzlePieceIcon className="h-5 w-5 text-gray-400" />
                </span>
              </div>
              {errors.intereseseducador && (
                <p className="text-orange-500 text-xs mt-1">
                  {errors.intereseseducador.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="paiseducador"
                className="block text-sm font-medium text-gray-700"
              >
                País
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <GlobeAmericasIcon className="h-5 w-5 text-gray-400" />
                </span>
                <select
                  id="paiseducador"
                  {...register("paiseducador")}
                  onChange={(e) => setSelectedPais(e.target.value)} // Cambiar país seleccionado
                  className={`mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm focus:outline-none focus:border-orange-500 text-sm pl-10 pr-3 h-10 ${
                    errors.paiseducador ? "border-orange-500" : ""
                  }`}
                >
                  <option value="" disabled>
                    Selecciona tu país
                  </option>
                  {paises.map((pais) => (
                    <option
                      key={pais.idalternativa}
                      value={pais.textoalternativa}
                    >
                      {pais.textoalternativa}
                    </option>
                  ))}
                </select>
              </div>
              {errors.paiseducador && (
                <p className="text-orange-500 text-xs mt-1">
                  {errors.paiseducador.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="edadeducador"
                className="block text-sm font-medium text-gray-700"
              >
                Edad
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <CakeIcon className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  type="number"
                  id="edadeducador"
                  {...register("edadeducador")}
                  className={`mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm focus:outline-none focus:border-orange-500 text-sm pl-10 pr-3 h-10 ${
                    errors.edadeducador ? "border-orange-500" : ""
                  }`}
                  placeholder="Ingresa tu edad"
                  min="18"
                  max="65"
                />
              </div>
              {errors.edadeducador && (
                <p className="text-orange-500 text-xs mt-1">
                  {errors.edadeducador.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="institucioneducador"
                className="block text-sm font-medium text-gray-700"
              >
                Institución
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <BuildingOffice2Icon className="h-5 w-5 text-gray-400" />
                </span>
                <select
                  id="institucioneducador"
                  {...register("institucioneducador")}
                  className={`mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm focus:outline-none focus:border-orange-500 text-sm pl-10 pr-3 h-10 ${
                    errors.institucioneducador ? "border-orange-500" : ""
                  }`}
                >
                  <option value="" disabled>
                    Selecciona tu institución
                  </option>
                  {instituciones.map((institucion, index) => (
                    <option key={index} value={institucion}>
                      {institucion}
                    </option>
                  ))}
                </select>
              </div>
              {errors.institucioneducador && (
                <p className="text-orange-500 text-xs mt-1">
                  {errors.institucioneducador.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="sexoeducador"
                className="block text-sm font-medium text-gray-700"
              >
                Sexo
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <UsersIcon className="h-5 w-5 text-gray-400" />
                </span>
                <select
                  id="sexoeducador"
                  {...register("sexoeducador")}
                  className={`mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm focus:outline-none focus:border-orange-500 text-sm pl-10 pr-3 h-10 ${
                    errors.sexoeducador ? "border-orange-500" : ""
                  }`}
                >
                  <option value="" disabled>
                    Selecciona tu sexo
                  </option>
                  <option value="Femenino">Femenino</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Otro">Prefiero no decirlo</option>
                </select>
              </div>
              {errors.sexoeducador && (
                <p className="text-orange-500 text-xs mt-1">
                  {errors.sexoeducador.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="anosexperienciaeducador"
                className="block text-sm font-medium text-gray-700"
              >
                Años de experiencia
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <AcademicCapIcon className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  type="number"
                  id="anosexperienciaeducador"
                  {...register("anosexperienciaeducador")}
                  className={`mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm focus:outline-none focus:border-orange-500 text-sm pl-10 pr-3 h-10 ${
                    errors.anosexperienciaeducador ? "border-orange-500" : ""
                  }`}
                  placeholder="Ingresa tus años de experiencia"
                  min="0"
                  onInput={(e) => {
                    if (e.target.value < 0) e.target.value = 0;
                  }}
                />
              </div>
              {errors.anosexperienciaeducador && (
                <p className="text-orange-500 text-xs mt-1">
                  {errors.anosexperienciaeducador.message}
                </p>
              )}
            </div>
          </div>

          {/* Botón de Registro */}
          <div className="col-span-1 sm:col-span-2 text-center">
            <button
              type="submit"
              className="w-full bg-Moonstone text-white py-2 px-4 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
