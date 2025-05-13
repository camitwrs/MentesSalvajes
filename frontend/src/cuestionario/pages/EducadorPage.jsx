import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Accordion, AccordionItem } from "@heroui/accordion";
import {
  ClipboardList,
  User,
  PanelTopOpen,
  PanelBottomOpen,
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
  ImageIcon,
} from "lucide-react";
import { getCuestionariosRequest } from "../../api/cuestionarios";
import { getDatosEducadorRequest } from "../../api/usuarios";
import { getHistorialRespuestasRequest } from "../../api/respuestas";
import { FormContext } from "../context/FormContext";
import { useAuth } from "../../autenticacion/context/AuthContext";

const EducadorPage = () => {
  const [cuestionarios, setCuestionarios] = useState([]);
  const [isAccordionVisible, setIsAccordionVisible] = useState(false);
  const [educador, setEducador] = useState(null);
  const [historialRespuestas, setHistorialRespuestas] = useState([]);

  const navigate = useNavigate();
  const { setQuizId } = useContext(FormContext);
  const { user } = useAuth();

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
              <button
                className="flex items-center gap-2 bg-YankeesBlue text-white py-1.5 md:py-2 px-3 md:px-4 rounded-md text-sm md:text-base"
                onClick={() => setIsAccordionVisible(!isAccordionVisible)}
              >
                {isAccordionVisible ? (
                  <>
                    <PanelBottomOpen className="w-4 h-4" />
                    Ocultar Cuestionarios
                  </>
                ) : (
                  <>
                    <PanelTopOpen className="w-4 h-4" />
                    Ver Cuestionarios
                  </>
                )}
              </button>

              <div
                className={`w-full transition-all duration-300 ${
                  isAccordionVisible
                    ? "opacity-100 max-h-screen mt-3"
                    : "opacity-0 max-h-0 overflow-hidden"
                }`}
              >
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
                              Próximamente
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
              <div className="flex items-center px-2 text-xl md:text-2xl">
                <User className="w-5 h-5 mr-2 stroke-YankeesBlue" />
                <h2 className="font-bold text-YankeesBlue">Mi Perfil</h2>
              </div>
            </CardHeader>
            <CardBody>
              {educador ? (
                <div className="p-5">
                  <h3 className="text-lg md:text-xl font-bold text-YankeesBlue mb-4 border-b border-blue-100 pb-2">
                    {user.nombreusuario} {user.apellidousuario}
                  </h3>

                  <div className="text-sm md:text-base">
                    <div>
                      <p className="flex items-center gap-2 mb-2">
                        <Cake className="text-YankeesBlue w-5 h-5 md:w-6 md:h-6" />
                        <span className="font-medium text-YankeesBlue">
                          Edad:
                        </span>
                        <span className="text-gray-500">
                          {educador.edadeducador} años
                        </span>
                      </p>
                      <p className="flex items-center gap-2 mb-2">
                        <UsersRound className="text-YankeesBlue w-5 h-5 md:w-6 md:h-6" />
                        <span className="font-medium text-YankeesBlue">
                          Sexo:
                        </span>
                        <span className="text-gray-500">
                          {educador.sexoeducador}
                        </span>
                      </p>
                      <p className="flex items-center gap-2 mb-2">
                        <Earth className="text-YankeesBlue w-5 h-5 md:w-6 md:h-6" />
                        <span className="font-medium text-YankeesBlue">
                          País:
                        </span>
                        <span className="text-gray-500">
                          {educador.paiseducador}
                        </span>
                      </p>
                      <p className="flex items-center gap-2 mb-2">
                        <Puzzle className="text-YankeesBlue w-5 h-5 md:w-6 md:h-6" />
                        <span className="font-medium text-YankeesBlue">
                          Intereses:
                        </span>
                        <span className="text-gray-500">
                          {educador.intereseseducador}
                        </span>
                      </p>
                    </div>

                    <div>
                      <p className="flex items-center gap-2 mb-2">
                        <Building className="text-YankeesBlue w-7 h-5 md:w-6 md:h-6" />
                        <span className="font-medium text-YankeesBlue">
                          Institución:
                        </span>
                        <span className="text-gray-500">
                          {educador.institucioneducador}
                        </span>
                      </p>
                      <p className="flex items-center gap-2 mb-2">
                        <BookOpen className="text-YankeesBlue w-5 h-5 md:w-6 md:h-6" />
                        <span className="font-medium text-YankeesBlue">
                          Ocupación:
                        </span>
                        <span className="text-gray-500">
                          {educador.tituloprofesionaleducador}
                        </span>
                      </p>
                      <p className="flex items-center gap-2 mb-2">
                        <GraduationCap className="text-YankeesBlue w-5 h-5 md:w-6 md:h-6" />
                        <span className="font-medium text-YankeesBlue">
                          Años de Experiencia:
                        </span>
                        <span className="text-gray-500">
                          {educador.anosexperienciaeducador}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-blue-100">
                    <p className="flex items-center gap-2 mb-2">
                      <Mail className="text-YankeesBlue w-5 h-5 md:w-6 md:h-6" />
                      <span className="font-medium text-YankeesBlue">
                        Correo:
                      </span>
                      <span className="text-gray-500">
                        {user.correousuario}
                      </span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-6 flex justify-center items-center min-h-[200px]">
                  <p className="text-gray-500 text-center">
                    {user?.idusuario
                      ? "Cargando información del perfil..."
                      : "No se encontró usuario activo."}
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
                          <button className="flex items-center gap-1 bg-Moonstone text-white py-1.5 px-3 rounded-md text-sm">
                            <Eye className="w-4 h-4" />
                            Ver respuestas
                          </button>
                          <button className="flex items-center gap-1 bg-YankeesBlue text-white py-1.5 px-3 rounded-md text-sm">
                            <ImageIcon className="w-4 h-4" />
                            Ver imagen
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
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
