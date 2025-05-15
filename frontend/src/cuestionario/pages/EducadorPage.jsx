import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Accordion, AccordionItem } from "@heroui/accordion";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import {
  ClipboardList,
  User,
  MoveRight,
  Mail,
  BookOpen,
  Puzzle,
  Earth,
  Cake,
  Building,
  UsersRound,
  GraduationCap,
  Table,
  Eye,
  Pencil,
  Save,
  X,
  FileQuestion,
  PencilLine,
} from "lucide-react";
import { getCuestionariosRequest } from "../../api/cuestionarios";
import {
  getDatosEducadorRequest,
  actualizarDatosEducadorRequest,
  actualizarDatosUsuarioRequest,
} from "../../api/usuarios";
import {
  getHistorialRespuestasRequest,
  getDetallePorRespuestaRequest,
} from "../../api/respuestas";
import { FormContext } from "../context/FormContext";
import { useAuth } from "../../autenticacion/context/AuthContext";

const EducadorPage = () => {
  const [cuestionarios, setCuestionarios] = useState([]);
  const [educador, setEducador] = useState(null);
  const [historialRespuestas, setHistorialRespuestas] = useState([]);

  const [loadingButtonId, setLoadingButtonId] = useState(null);

  const [detalleRespuesta, setDetalleRespuesta] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  const [editMode, setEditMode] = useState(false);

  const [educadorForm, setEducadorForm] = useState({
    edadeducador: "",
    sexoeducador: "",
    paiseducador: "",
    intereseseducador: "",
    institucioneducador: "",
    tituloprofesionaleducador: "",
    anosexperienciaeducador: "",
  });

  const [userForm, setUserForm] = useState({
    nombreusuario: "",
    apellidousuario: "",
    correousuario: "",
  });

  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { setQuizId } = useContext(FormContext);
  const { user, setUser } = useAuth();

  const handleSelectCuestionario = (id) => {
    setQuizId(id);
    navigate(`/cuestionario/${id}`);
  };

  useEffect(() => {
    const fetchCuestionarios = async () => {
      try {
        const response = await getCuestionariosRequest();
        setCuestionarios(response.data);
      } catch (error) {
        console.error("Error al obtener los cuestionarios:", error);
      }
    };

    const fetchDatosEducador = async () => {
      if (!user?.idusuario) return;
      try {
        const response = await getDatosEducadorRequest(user.idusuario);
        setEducador(response.data);
      } catch (error) {
        console.error("Error al obtener los datos del educador:", error);
      }
    };

    const fetchHistorial = async () => {
      if (!user?.idusuario) return;
      try {
        const response = await getHistorialRespuestasRequest(user.idusuario);
        const historial = response.data.map((item) => {
          const fecha = new Date(item.fecharespuesta);
          return {
            id: item.idrespuesta,
            nombre: item.titulocuestionario,
            fecha: fecha.toLocaleDateString("es-ES"),
            hora: fecha.toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
        });
        setHistorialRespuestas(historial);
      } catch (error) {
        console.error("Error al obtener el historial de respuestas:", error);
      }
    };

    fetchCuestionarios();
    fetchDatosEducador();
    fetchHistorial();
  }, [user?.idusuario]);

  const handleVerDetalle = async (idrespuesta) => {
    try {
      setLoadingButtonId(idrespuesta); // Activar el estado de carga para el botón específico
      setLoadingDetalle(true); // Activar el estado de carga del modal
      const response = await getDetallePorRespuestaRequest(idrespuesta);
      setDetalleRespuesta(response.data);
      setModalVisible(true); // Mostrar el modal
    } catch (error) {
      console.error("Error al obtener los detalles de la respuesta:", error);
    } finally {
      setLoadingButtonId(null); // Desactivar el estado de carga del botón
      setLoadingDetalle(false); // Desactivar el estado de carga del modal
    }
  };

  const handleEducadorInputChange = (e) => {
    const { name, value } = e.target;
    setEducadorForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setUserForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditarPerfil = () => {
    setEditMode(true);
  };

  const handleCancelarEdicion = () => {
    setEditMode(false);
    setEducadorForm(educador);
    setUserForm(user); // Restaurar los datos originales
    setError(null);
  };

  const handleGuardarPerfil = async () => {
    try {
      setGuardando(true);
      setError(null);

      // Validar campos obligatorios del educador
      if (
        !educadorForm.edadeducador ||
        !educadorForm.sexoeducador ||
        !educadorForm.paiseducador
      ) {
        setError("Los campos de edad, sexo y país son obligatorios");
        setGuardando(false);
        return;
      }

      // Validar campos obligatorios del usuario
      if (
        !userForm.nombreusuario ||
        !userForm.apellidousuario ||
        !userForm.correousuario
      ) {
        setError("Los campos de nombre, apellido y correo son obligatorios");
        setGuardando(false);
        return;
      }

      // Validar formato de correo electrónico
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userForm.correousuario)) {
        setError("El formato del correo electrónico no es válido");
        setGuardando(false);
        return;
      }

      // Llamada a la API para actualizar los datos (educador+usuario)
      const responseEducador = await actualizarDatosEducadorRequest(
        user.idusuario,
        educadorForm
      );

      const responseUsuario = await actualizarDatosUsuarioRequest(
        user.idusuario,
        userForm
      );

      if (responseEducador.status === 200 && responseUsuario.status === 200) {
        // Actualizar el estado local con los nuevos datos
        setEducador({
          ...educador,
          ...educadorForm,
        });

        // Actualizar el contexto de autenticación con los nuevos datos del usuario
        setUser({
          ...user,
          ...userForm,
        });

        setEditMode(false);
        setMensaje("Perfil actualizado correctamente");
        setTimeout(() => setMensaje(null), 3000);
      } else {
        setError("No se pudo actualizar el perfil");
      }
    } catch (err) {
      console.error("Error al actualizar el perfil:", err);
      setError("Ocurrió un error al guardar los cambios");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6 p-4 md:p-8">
        <div className="w-full md:w-1/2">
          <Card className="w-full rounded-md">
            <CardHeader>
              <div className="flex items-center px-2 text-xl md:text-2xl">
                <ClipboardList className="w-5 h-5 mr-2 stroke-YankeesBlue" />
                <h2 className="font-bold text-YankeesBlue">
                  Realizar Cuestionario
                </h2>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-gray-500 px-2 text-sm md:text-base">
                Aquí puedes realizar un cuestionario para evaluar tus
                conocimientos.
              </p>
            </CardBody>
            <CardFooter className="px-4 flex flex-col items-start">
              <div className="w-full mt-3">
                <Accordion variant="shadow">
                  {cuestionarios.length > 0 ? (
                    cuestionarios.map((cuestionario, index) => (
                      <AccordionItem
                        key={cuestionario.id || index}
                        aria-label={`Cuestionario ${index + 1}`}
                        title={cuestionario.titulocuestionario}
                        subtitle="Click para expandir."
                      >
                        <div className="p-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <p className="text-gray-700">
                            {cuestionario.descripcioncuestionario}
                          </p>

                          {cuestionario.estadocuestionario?.toLowerCase() ===
                          "activo" ? (
                            <button
                              key={cuestionario.idcuestionario}
                              onClick={() =>
                                handleSelectCuestionario(
                                  cuestionario.idcuestionario
                                )
                              }
                              className="flex items-center gap-2 bg-Moonstone text-white py-2 px-4 rounded-md"
                            >
                              Responder
                              <MoveRight className="h-4 w-4" />
                            </button>
                          ) : (
                            <button
                              key={cuestionario.idcuestionario}
                              className="flex items-center gap-2 bg-gray-400 text-white py-1.5 md:py-2 px-3 md:px-4 rounded-md cursor-not-allowed text-sm md:text-base whitespace-nowrap mt-2 sm:mt-0"
                              disabled
                            >
                              Próximamente!
                            </button>
                          )}
                        </div>
                      </AccordionItem>
                    ))
                  ) : (
                    <AccordionItem
                      key="no-data"
                      aria-label="Sin datos"
                      title="No hay cuestionarios disponibles"
                    >
                      <div className="p-2">
                        <p className="text-gray-500 text-sm md:text-base">
                          No hay cuestionarios en la base de datos.
                        </p>
                      </div>
                    </AccordionItem>
                  )}
                </Accordion>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="w-full md:w-1/2 mt-4 md:mt-0">
          <Card className="w-full rounded-md">
            <CardHeader>
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center text-xl md:text-2xl">
                  <User className="w-5 h-5 mr-2 stroke-YankeesBlue" />
                  <h2 className="font-bold text-YankeesBlue">Mi Perfil</h2>
                </div>
                {!editMode ? (
                  <button
                    onClick={handleEditarPerfil}
                    className="ml-4 flex items-center gap-1 bg-Moonstone text-white py-1.5 px-3 rounded-md text-sm"
                  >
                    <Pencil className="w-4 h-4" />
                    Editar
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancelarEdicion}
                      className="ml-4 flex items-center gap-1 bg-gray-400 text-white py-1.5 px-3 rounded-md text-sm"
                    >
                      <X className="w-4 h-4" />
                      Cancelar
                    </button>
                    <button
                      onClick={handleGuardarPerfil}
                      disabled={guardando}
                      className="flex items-center gap-1 bg-Moonstone text-white py-1.5 px-3 rounded-md text-sm"
                    >
                      {guardando ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Guardar
                    </button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardBody>
              {/* Mensajes de error o éxito */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between mx-5">
                  <span>{error}</span>
                  <button onClick={() => setError(null)}>
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}

              {mensaje && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex justify-between mx-5">
                  <span>{mensaje}</span>
                  <button onClick={() => setMensaje(null)}>
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}

              {user && (
                <div className="p-5">
                  {/* Información básica del usuario */}
                  <div className="mb-6 border-b border-blue-100 pb-4">
                    <h3 className="text-lg md:text-xl font-bold text-YankeesBlue mb-4">
                      Información Personal
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-YankeesBlue font-medium mb-1">
                          Nombre
                        </label>
                        {editMode ? (
                          <input
                            type="text"
                            name="nombreusuario"
                            value={userForm.nombreusuario}
                            onChange={handleUserInputChange}
                            className="border border-gray-300 rounded-md p-2 w-full"
                          />
                        ) : (
                          <p className="text-gray-500">{user.nombreusuario}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-YankeesBlue font-medium mb-1">
                          Apellido
                        </label>
                        {editMode ? (
                          <input
                            type="text"
                            name="apellidousuario"
                            value={userForm.apellidousuario}
                            onChange={handleUserInputChange}
                            className="border border-gray-300 rounded-md p-2 w-full"
                          />
                        ) : (
                          <p className="text-gray-500">
                            {user.apellidousuario}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-YankeesBlue font-medium mb-1">
                        Correo Electrónico
                      </label>
                      {editMode ? (
                        <input
                          type="email"
                          name="correousuario"
                          value={userForm.correousuario}
                          onChange={handleUserInputChange}
                          className="border border-gray-300 rounded-md p-2 w-full"
                        />
                      ) : (
                        <p className="flex items-center gap-2 text-gray-500">
                          <Mail className="text-YankeesBlue w-5 h-5" />
                          {user.correousuario}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Información del educador */}
                  {educador && (
                    <div className="text-sm md:text-base">
                      <h3 className="text-lg font-bold text-YankeesBlue mb-4">
                        Información Profesional
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div>
                          <p className="flex items-center gap-2 mb-1">
                            <Cake className="text-YankeesBlue w-5 h-5" />
                            <span className="font-medium text-YankeesBlue">
                              Edad:
                            </span>
                          </p>
                          {editMode ? (
                            <input
                              type="number"
                              name="edadeducador"
                              value={educadorForm.edadeducador}
                              onChange={handleEducadorInputChange}
                              className="border border-gray-300 rounded-md p-2 w-full"
                              min="18"
                              max="100"
                            />
                          ) : (
                            <p className="text-gray-500 ml-7">
                              {educador.edadeducador} años
                            </p>
                          )}
                        </div>

                        <div>
                          <p className="flex items-center gap-2 mb-1">
                            <UsersRound className="text-YankeesBlue w-5 h-5" />
                            <span className="font-medium text-YankeesBlue">
                              Sexo:
                            </span>
                          </p>
                          {editMode ? (
                            <select
                              name="sexoeducador"
                              value={educadorForm.sexoeducador}
                              onChange={handleEducadorInputChange}
                              className="border border-gray-300 rounded-md p-2 w-full"
                            >
                              <option value="">Seleccionar</option>
                              <option value="Masculino">Masculino</option>
                              <option value="Femenino">Femenino</option>
                              <option value="Otro">Otro</option>
                              <option value="Prefiero no decir">
                                Prefiero no decir
                              </option>
                            </select>
                          ) : (
                            <p className="text-gray-500 ml-7">
                              {educador.sexoeducador}
                            </p>
                          )}
                        </div>

                        <div>
                          <p className="flex items-center gap-2 mb-1">
                            <Earth className="text-YankeesBlue w-5 h-5" />
                            <span className="font-medium text-YankeesBlue">
                              País:
                            </span>
                          </p>
                          {editMode ? (
                            <input
                              type="text"
                              name="paiseducador"
                              value={educadorForm.paiseducador}
                              onChange={handleEducadorInputChange}
                              className="border border-gray-300 rounded-md p-2 w-full"
                            />
                          ) : (
                            <p className="text-gray-500 ml-7">
                              {educador.paiseducador}
                            </p>
                          )}
                        </div>

                        <div>
                          <p className="flex items-center gap-2 mb-1">
                            <Puzzle className="text-YankeesBlue w-5 h-5" />
                            <span className="font-medium text-YankeesBlue">
                              Intereses:
                            </span>
                          </p>
                          {editMode ? (
                            <input
                              type="text"
                              name="intereseseducador"
                              value={educadorForm.intereseseducador}
                              onChange={handleEducadorInputChange}
                              className="border border-gray-300 rounded-md p-2 w-full"
                            />
                          ) : (
                            <p className="text-gray-500 ml-7">
                              {educador.intereseseducador}
                            </p>
                          )}
                        </div>

                        <div>
                          <p className="flex items-center gap-2 mb-1">
                            <Building className="text-YankeesBlue w-5 h-5" />
                            <span className="font-medium text-YankeesBlue">
                              Institución:
                            </span>
                          </p>
                          {editMode ? (
                            <input
                              type="text"
                              name="institucioneducador"
                              value={educadorForm.institucioneducador}
                              onChange={handleEducadorInputChange}
                              className="border border-gray-300 rounded-md p-2 w-full"
                            />
                          ) : (
                            <p className="text-gray-500 ml-7">
                              {educador.institucioneducador}
                            </p>
                          )}
                        </div>

                        <div>
                          <p className="flex items-center gap-2 mb-1">
                            <BookOpen className="text-YankeesBlue w-5 h-5" />
                            <span className="font-medium text-YankeesBlue">
                              Ocupación:
                            </span>
                          </p>
                          {editMode ? (
                            <input
                              type="text"
                              name="tituloprofesionaleducador"
                              value={educadorForm.tituloprofesionaleducador}
                              onChange={handleEducadorInputChange}
                              className="border border-gray-300 rounded-md p-2 w-full"
                            />
                          ) : (
                            <p className="text-gray-500 ml-7">
                              {educador.tituloprofesionaleducador}
                            </p>
                          )}
                        </div>

                        <div>
                          <p className="flex items-center gap-2 mb-1">
                            <GraduationCap className="text-YankeesBlue w-5 h-5" />
                            <span className="font-medium text-YankeesBlue">
                              Años de Experiencia:
                            </span>
                          </p>
                          {editMode ? (
                            <input
                              type="number"
                              name="anosexperienciaeducador"
                              value={educadorForm.anosexperienciaeducador}
                              onChange={handleEducadorInputChange}
                              className="border border-gray-300 rounded-md p-2 w-full"
                              min="0"
                              max="70"
                            />
                          ) : (
                            <p className="text-gray-500 ml-7">
                              {educador.anosexperienciaeducador}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!user && (
                <div className="p-6 flex justify-center items-center min-h-[200px]">
                  <p className="text-gray-500 text-center">
                    Cargando información del perfil...
                  </p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Sección de historial de respuestas */}
      <div className="px-4 md:px-8 pb-8">
        <Card className="w-full rounded-md">
          <CardHeader>
            <div className="flex items-center px-2 text-xl md:text-2xl">
              <Table className="w-5 h-5 mr-2 stroke-YankeesBlue" />
              <h2 className="font-bold text-YankeesBlue">
                Historial de Respuestas
              </h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre del Cuestionario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hora
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {historialRespuestas.map((respuesta) => (
                    <tr key={respuesta.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {respuesta.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {respuesta.fecha}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {respuesta.hora}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            className={`flex items-center gap-1 py-1.5 px-3 rounded-md text-sm ${
                              loadingButtonId === respuesta.id
                                ? "bg-Moonstone cursor-not-allowed"
                                : "bg-Moonstone text-white"
                            }`}
                            onClick={() => handleVerDetalle(respuesta.id)}
                            disabled={loadingButtonId === respuesta.id} // Deshabilitar solo el botón en carga
                          >
                            {loadingButtonId === respuesta.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                            ) : (
                              <>
                                <Eye className="w-4 h-4" />
                                Ver detalle
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>

                {/* Modal para mostrar los detalles */}
                {modalVisible && (
                  <Modal
                    isOpen={modalVisible}
                    onClose={() => setModalVisible(false)}
                    className="max-w-4xl mx-auto"
                  >
                    <ModalContent>
                      <ModalHeader>Detalles de la Respuesta</ModalHeader>
                      <ModalBody className="max-h-[70vh] overflow-y-auto">
                        {loadingDetalle ? (
                          <div className="flex justify-center items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            <p className="ml-4 text-gray-600">
                              Cargando detalles...
                            </p>
                          </div>
                        ) : detalleRespuesta.length > 0 ? (
                          <ul className="space-y-4">
                            {detalleRespuesta.map((detalle, index) => (
                              <li key={index} className="border-b pb-2">
                                <div className="flex items-start gap-4">
                                  {/* Ícono para la pregunta */}
                                  <div className="flex items-center justify-center bg-blue-100 rounded-full w-10 h-10 shrink-0">
                                    <FileQuestion className="w-6 h-6 text-blue-500" />
                                  </div>
                                  <div className="flex flex-col">
                                    <p className="text-sm font-medium text-gray-700">
                                      <span className="font-bold">
                                        Pregunta:
                                      </span>{" "}
                                      {detalle.textopregunta}
                                    </p>
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                      {/* Ícono para la respuesta */}
                                      <PencilLine className="w-5 h-5 text-green-500" />
                                      <span className="font-bold">
                                        Respuesta:
                                      </span>{" "}
                                      {detalle.respuestaelegida}
                                    </p>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500">
                            No se encontraron detalles para esta respuesta.
                          </p>
                        )}
                      </ModalBody>
                      <ModalFooter>
                        <button
                          className="bg-gray-500 text-white py-1.5 px-3 rounded-md text-sm"
                          onClick={() => setModalVisible(false)}
                        >
                          Cerrar
                        </button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                )}
              </table>
              {historialRespuestas.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  No se encontraron respuestas registradas.
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default EducadorPage;
