import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Importamos Link
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { ClipboardList, User, PanelTopOpen, PanelBottomOpen, MoveRight } from "lucide-react"; // Importamos Clipboard
import { getCuestionariosRequest } from "../../api/cuestionarios";

const EducadorPage = () => {
  const [cuestionarios, setCuestionarios] = useState([]);
  const [isAccordionVisible, setIsAccordionVisible] = useState(false);

  useEffect(() => {
    const fetchCuestionarios = async () => {
      try {
        const response = await getCuestionariosRequest();
        setCuestionarios(response.data);
      } catch (error) {
        console.error("Error al obtener los cuestionarios:", error);
      }
    };

    fetchCuestionarios();
  }, []);

  return (
    <div>
      <div className="flex justify-center gap-6 p-8">
        {/* Sección de Cuestionarios */}
        <div className="flex flex-col items-start w-[45rem]">
          <Card className="w-full rounded-md">
            <CardHeader>
              <div className="flex items-center px-2 text-2xl">
                <ClipboardList className="w-5 h-5 mr-2 stroke-YankeesBlue" />
                <h2 className="font-bold text-YankeesBlue">Realizar Cuestionario</h2>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-gray-500 px-2">
                Aquí puedes realizar un cuestionario para evaluar tus conocimientos.
              </p>
            </CardBody>
            <CardFooter className="px-4 flex flex-col items-start">
              {/* Botón con icono de Eye o EyeClosed */}
              <button
                className="flex items-center gap-2 bg-YankeesBlue text-white py-2 px-4 rounded-md"
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
                  isAccordionVisible ? "opacity-100 max-h-screen mt-3" : "opacity-0 max-h-0 overflow-hidden"
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
                        <div className="p-2 flex justify-between items-center">
                          {/* Mostrar descripción alineada a la izquierda */}
                          <p className="text-gray-700">{cuestionario.descripcioncuestionario}</p>

                          {/* Si el cuestionario es "Cuestionario 8.0", mostrar el botón de Responder con Link */}
                          {cuestionario.titulocuestionario === "Cuestionario 8.0" ? (
                            <Link
                              to="/cuestionario/1"
                              className="flex items-center gap-2 bg-Moonstone text-white py-2 px-4 rounded-md"
                            >
                              Responder
                              <MoveRight className="h-4 w-4" />
                            </Link>
                          ) : (
                            // Para los demás cuestionarios, botón gris con "Próximamente"
                            <button
                              className="flex items-center gap-2 bg-gray-400 text-white py-2 px-4 rounded-md cursor-not-allowed"
                              disabled
                            >
                              Próximamente
                            </button>
                          )}
                        </div>
                      </AccordionItem>
                    ))
                  ) : (
                    <AccordionItem key="no-data" aria-label="Sin datos" title="No hay cuestionarios disponibles">
                      <div className="p-2">
                        <p className="text-gray-500">No hay cuestionarios en la base de datos.</p>
                      </div>
                    </AccordionItem>
                  )}
                </Accordion>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Tarjeta de Mi Perfil: Ahora independiente y sin estar afectada por el Accordion */}
        <div className="flex items-start w-[45rem]">
          <Card className="w-full rounded-md">
            <CardHeader>
              <div className="flex items-center px-2 text-2xl">
                <User className="w-5 h-5 mr-2 stroke-YankeesBlue" />
                <h2 className="font-bold text-YankeesBlue">Mi Perfil</h2>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-gray-500 px-2">
                Visualiza y edita la información de tu perfil de educador.
              </p>
            </CardBody>
            <CardFooter className="px-4">
              <button className="flex items-center bg-YankeesBlue text-white py-2 px-4 rounded-md">
                Ver Perfil
              </button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EducadorPage;
