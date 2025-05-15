import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerEducatorSchema } from "../../../schemas/autenticacion.schema";
import { useAuth } from "../context/AuthContext";
import {
  getAlternativasPorPreguntaRequest,
  getUniversidadesPorPaisRequest,
} from "../../api/alternativas";
import logo from "../../shared/assets/logo.svg";
import { Link, useNavigate } from "react-router-dom";

import {
  User,
  Mail,
  Lock,
  BookOpen,
  Puzzle,
  Earth,
  Cake,
  Building,
  UsersRound,
  GraduationCap,
} from "lucide-react";

const RegisterPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerEducatorSchema),
    defaultValues: {
      paiseducador: "", // Valor predeterminado para el campo país
      institucioneducador: "", // Valor predeterminado para el campo institución
      sexoeducador: "", // Valor predeterminado para el campo sexo
    },
  });

  const { registrarse, errors: registerErrors } = useAuth();

  const [paises, setPaises] = useState([]);
  const [instituciones, setInstituciones] = useState([]);
  const [selectedPais, setSelectedPais] = useState("");
  const [paisesSinUniversidades, setPaisesSinUniversidades] = useState(
    new Set()
  );
  const [mensaje, setMensaje] = useState("");

  // Cargar los países una sola vez al montar el componente
  useEffect(() => {
    const cargarPaises = async () => {
      try {
        const paisesResponse = await getAlternativasPorPreguntaRequest(5);
        setPaises(paisesResponse.data);
      } catch (error) {
        console.error("Error al cargar los países:", error);
      }
    };

    cargarPaises();
  }, []);

  // Cargar instituciones solo cuando cambia `selectedPais`
  useEffect(() => {
    if (!selectedPais) {
      setInstituciones([]); // Limpiar instituciones si no hay país seleccionado
      return;
    }

    // Si el país está en la lista de países sin universidades, limpiar las instituciones y salir
    if (paisesSinUniversidades.has(selectedPais)) {
      setInstituciones([]); // Limpiar instituciones si el país no tiene universidades
      return;
    }

    const cargarInstituciones = async () => {
      try {
        const institucionesResponse = await getUniversidadesPorPaisRequest(
          selectedPais
        );
        if (institucionesResponse.data.length === 0) {
          // Si no hay universidades, deshabilitar el país
          setPaisesSinUniversidades((prev) => new Set(prev).add(selectedPais));
          setInstituciones([]); // Vaciar lista de instituciones
        } else {
          // Si hay universidades, actualizar la lista
          setInstituciones(institucionesResponse.data.map((uni) => uni.name));
        }
      } catch (error) {
        console.error("Error al cargar las instituciones:", error);
        // Si la API falla, también deshabilitar el país
        setPaisesSinUniversidades((prev) => new Set(prev).add(selectedPais));
        setInstituciones([]); // Vaciar lista de instituciones en caso de error
      }
    };

    cargarInstituciones();
  }, [paisesSinUniversidades, selectedPais]); // Se ejecuta solo cuando `selectedPais` cambia

  // Enviar los datos del registro al backend
  const onSubmit = async (data) => {
    registrarse(data);
    setMensaje("¡Registro exitoso! Redirigiendo...");
    setTimeout(() => {
      navigate("/login"); // Redirigir después de 2 segundos
    }, 2000);
  };

  return (
    <div className="min-min-h-screen flex items-center justify-center  px-6">
      <div className="bg-white px-8 py-6 w-full max-w-3xl">
        <div className="text-center mb-6">
          <img
            src={logo}
            alt="Mentes Salvajes"
            className="mx-auto w-14 h-14 p-2 mb-3 bg-YankeesBlue rounded-full"
          />
          <h1 className="text-2xl font-semibold text-gray-800">Regístrate</h1>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2"
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
                  className={`input-field ${
                    errors.nombreusuario ? "border-orange-500" : ""
                  }`}
                />
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-5 w-5 text-gray-400" />
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
                  className={`input-field ${
                    errors.apellidousuario ? "border-orange-500" : ""
                  }`}
                />
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-5 w-5 text-gray-400" />
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
                  className={`input-field ${
                    errors.correousuario ? "border-orange-500" : ""
                  }`}
                />
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-gray-400" />
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
                  className={`input-field ${
                    errors.contrasenausuario ? "border-orange-500" : ""
                  }`}
                />
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                </span>
              </div>
              {errors.contrasenausuario && (
                <p className="text-orange-500 text-xs mt-1">
                  {errors.contrasenausuario.message}
                </p>
              )}
            </div>

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
                  className={`input-field ${
                    errors.tituloprofesionaleducador ? "border-orange-500" : ""
                  }`}
                />
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <BookOpen className="h-5 w-5 text-gray-400" />
                </span>
              </div>
              {errors.tituloprofesionaleducador && (
                <p className="text-orange-500 text-xs mt-1">
                  {errors.tituloprofesionaleducador.message}
                </p>
              )}
            </div>
          </div>

          {/* Columna Derecha */}
          <div className="space-y-4">
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
                  className={`input-field pt-1 ${
                    errors.intereseseducador ? "border-orange-500" : ""
                  }`}
                  onInput={(e) => {
                    e.target.style.height = "auto"; // Restablece el tamaño
                    e.target.style.height = `${e.target.scrollHeight}px`; // Ajusta al contenido
                  }}
                ></textarea>
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Puzzle className="h-5 w-5 text-gray-400" />
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
                  <Earth className="h-5 w-5 text-gray-400" />
                </span>
                <select
                  id="paiseducador"
                  {...register("paiseducador")}
                  onChange={(e) => setSelectedPais(e.target.value)} // Cambiar país seleccionado
                  className={`input-field ${
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
                      disabled={paisesSinUniversidades.has(
                        pais.textoalternativa
                      )}
                    >
                      {pais.textoalternativa}
                      {paisesSinUniversidades.has(pais.textoalternativa)
                        ? " (No disponible)"
                        : ""}
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
                  <Cake className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  type="number"
                  id="edadeducador"
                  {...register("edadeducador", { valueAsNumber: true })}
                  className={`input-field ${
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
                  <Building className="h-5 w-5 text-gray-400" />
                </span>
                <select
                  id="institucioneducador"
                  {...register("institucioneducador")}
                  disabled={instituciones.length === 0}
                  className={`input-field ${
                    errors.institucioneducador ? "border-orange-500" : ""
                  }`}
                >
                  <option value="" disabled>
                    {instituciones.length === 0
                      ? "No hay universidades disponibles"
                      : "Selecciona tu institución"}
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
                  <UsersRound className="h-5 w-5 text-gray-400" />
                </span>
                <select
                  id="sexoeducador"
                  {...register("sexoeducador")}
                  className={`input-field ${
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
                  <GraduationCap className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  type="number"
                  id="anosexperienciaeducador"
                  {...register("anosexperienciaeducador", {
                    valueAsNumber: true,
                  })}
                  className={`input-field ${
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
        {Array.isArray(registerErrors) &&
          registerErrors.length > 0 &&
          registerErrors.map((error, i) => (
            <div
              className="text-center text-orange-500 text-sm p-2 mt-2"
              key={i}
            >
              {error}
            </div>
          ))}
        {mensaje && (
          <div className="text-center text-sm p-2 mt-2 text-green-500">
            {mensaje}
          </div>
        )}

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/login"
              className="text-Moonstone hover:text-cyan-700 font-medium"
            >
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
