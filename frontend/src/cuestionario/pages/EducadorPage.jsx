import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; // Importamos Link
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Accordion, AccordionItem } from "@heroui/accordion";
import {
  ClipboardList,
  User,
  PanelTopOpen,
  PanelBottomOpen,
  MoveRight,
} from "lucide-react"; // Importamos Clipboard
import { getCuestionariosRequest } from "../../api/cuestionarios";
import { FormContext } from "../context/FormContext";

const EducadorPage = () => {
  const [cuestionarios, setCuestionarios] = useState([])
  const [isAccordionVisible, setIsAccordionVisible] = useState(false)

  const navigate = useNavigate();
  const { setQuizId } = useContext(FormContext);

  const handleSelectCuestionario = (id) => {
    setQuizId(id); // Guardar el ID en el contexto
    navigate(`/cuestionario/${id}`);
  };

  useEffect(() => {
    const fetchCuestionarios = async () => {
      try {
        const response = await getCuestionariosRequest()
        setCuestionarios(response.data)
      } catch (error) {
        console.error("Error al obtener los cuestionarios:", error)
      }
    }

    fetchCuestionarios()
  }, [])

  return (
    <div className="container mx-auto">
      {/* Contenedor principal con flex que cambia de dirección en pantallas pequeñas */}
      <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6 p-4 md:p-8">
        {/* Sección de Cuestionarios - ancho completo en móvil, mitad en desktop */}
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
                Aquí puedes realizar un cuestionario para evaluar tus conocimientos.
              </p>
            </CardBody>
            <CardFooter className="px-4 flex flex-col items-start">
              {/* Botón con icono de Eye o EyeClosed */}
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

              {/* Sección del Accordion con transición */}
              <div
                className={`w-full transition-all duration-300 ${
                  isAccordionVisible
                    ? "opacity-100 max-h-screen mt-3"
                    : "opacity-0 max-h-0 overflow-hidden"
                }`}
              >
                <Accordion variant="shadow">
                  {/* Mapear todos los cuestionarios y modificar el que tenga título "Cuestionario 8.0" */}
                  {cuestionarios.length > 0 ? (
                    cuestionarios.map((cuestionario, index) => (
                      <AccordionItem
                        key={cuestionario.id || index}
                        aria-label={`Cuestionario ${index + 1}`}
                        title={cuestionario.titulocuestionario}
                        subtitle="Click para expandir."
                      >
                        <div className="p-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          {/* Mostrar descripción alineada a la izquierda */}
                          <p className="text-gray-700">
                            {cuestionario.descripcioncuestionario}
                          </p>

                          {/* Si el cuestionario es "Cuestionario 8.0", mostrar el botón de Responder con Link */}
                          {cuestionario.titulocuestionario ===
                          "Cuestionario 8.0" ? (
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
                            // Para los demás cuestionarios, botón gris con "Próximamente"
                            <button
                              key={cuestionario.idcuestionario}
                              onClick={() =>
                                handleSelectCuestionario(
                                  cuestionario.idcuestionario
                                )
                              }
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
                        <p className="text-gray-500 text-sm md:text-base">No hay cuestionarios en la base de datos.</p>
                      </div>
                    </AccordionItem>
                  )}
                </Accordion>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Tarjeta de Mi Perfil - ancho completo en móvil, mitad en desktop */}
        <div className="w-full md:w-1/2 mt-4 md:mt-0">
          <Card className="w-full rounded-md">
            <CardHeader>
              <div className="flex items-center px-2 text-xl md:text-2xl">
                <User className="w-5 h-5 mr-2 stroke-YankeesBlue" />
                <h2 className="font-bold text-YankeesBlue">Mi Perfil</h2>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-gray-500 px-2 text-sm md:text-base">
                Visualiza y edita la información de tu perfil de educador.
              </p>
            </CardBody>
            <CardFooter className="px-4">
              <button className="flex items-center bg-YankeesBlue text-white py-1.5 md:py-2 px-3 md:px-4 rounded-md text-sm md:text-base">
                Ver Perfil
              </button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default EducadorPage

