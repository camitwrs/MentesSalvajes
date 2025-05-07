import { useState, useEffect } from "react"; // Añadir useEffect
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import EstadisticaCuestionarios from "../components/EstadisticaCuestionarios";
import TablaCuestionarios from "../components/TablaCuestionarios";
import {
  crearCuestionarioRequest,
  getCuestionariosRequest, 
} from "../../api/cuestionarios";
import { getTotalRespuestasPorCuestionarioRequest } from "../../api/respuestas"; 
import { getTotalPreguntasPorCuestionarioRequest } from "../../api/preguntas"; 

import { PlusIcon } from "lucide-react";
import { useAlert } from "../../shared/context/AlertContext";

const AdminPage = () => {
  // Estados movidos aquí
  const [cuestionarios, setCuestionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Estados del modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nuevoCuestionario, setNuevoCuestionario] = useState({
    titulocuestionario: "",
    descripcioncuestionario: "",
    estadocuestionario: "activo",
  });
  const { showAlert } = useAlert();

  useEffect(() => {
    console.log(cuestionarios)
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null); // Resetear error al iniciar la carga

        const response = await getCuestionariosRequest();

        let data = [];
        if (Array.isArray(response?.data)) {
          data = response.data;
        } else if (Array.isArray(response)) {
          data = response;
        } else {
          data = [];
        }

        const cuestionariosConDatos = await Promise.all(
          data.map(async (cuestionario) => {
            const id =
              cuestionario.idcuestionario 
            if (!id) return cuestionario;

            try {
              const respuestasResponse = await getTotalRespuestasPorCuestionarioRequest(id);
              const preguntasResponse = await getTotalPreguntasPorCuestionarioRequest(id);
              return {
                ...cuestionario,
                total_respuestas:
                  respuestasResponse?.data?.total_respuestas || 0,
                total_preguntas:
                preguntasResponse?.data?.total_preguntas || 0,
              };

            } catch (error) {
              console.error(
                error
              );
              return {
                ...cuestionario,
                total_respuestas: 0,
                total_preguntas:0,
              };
            }
          })
        );

        setCuestionarios(cuestionariosConDatos);
      } catch (err) {
        setError(err.message || "Error al cargar los cuestionarios");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Se ejecuta solo una vez al montar AdminPage

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    setNuevoCuestionario({
      ...nuevoCuestionario,
      [e.target.name]: e.target.value,
    });
  };

  const handleCrearCuestionario = async () => {
    try {
      const response = await crearCuestionarioRequest(nuevoCuestionario);

      if (response.status === 201 && response.data.cuestionario) {
        setCuestionarios((prevCuestionarios) => [
          ...prevCuestionarios,
          // Asegúrate de que el nuevo cuestionario tenga el campo total_respuestas inicializado
          { ...response.data.cuestionario, total_respuestas: 0, total_preguntas: 0 },
        ]);
        showAlert("Cuestionario creado exitosamente.", "success");
        handleCloseModal();
        setNuevoCuestionario({
          titulocuestionario: "",
          descripcioncuestionario: "",
          estadocuestionario: "activo",
        });
      } else {
        console.error("Error al crear el cuestionario:", response);
        showAlert("No se pudo crear. Intenta nuevamente.", "danger");
      }
    } catch (error) {
      console.error("Error al crear el cuestionario:", error);
      showAlert("Ocurrió un error al crear. Intenta nuevamente.", "danger");
    }
  };

  // Renderizado condicional basado en loading y error
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-gray-600">Cargando datos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen p-8 space-y-6 bg-gray-50">
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <h3 className="font-bold">Error</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-100 rounded hover:bg-red-200"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen p-8 space-y-6 bg-gray-50">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">
          Panel de Cuestionarios
        </h1>
      </div>
      <div>
        <EstadisticaCuestionarios />
      </div>
      <div>
        <Button
          color="warning"
          size="sm"
          onPress={handleOpenModal}
          className="flex items-center gap-1 transition-all text-white"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Crear Cuestionario</span>
        </Button>
      </div>
      <div className="mt-6">
        <TablaCuestionarios
          cuestionarios={cuestionarios}
          setCuestionarios={setCuestionarios}
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModalContent>
          <ModalHeader>Crear Nuevo Cuestionario</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="titulocuestionario"
                  className="block text-sm font-medium text-gray-700"
                >
                  Título del Cuestionario
                </label>
                <div className="mt-1">
                  <Input
                    type="text"
                    id="titulocuestionario"
                    name="titulocuestionario"
                    value={nuevoCuestionario.titulocuestionario}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="descripcioncuestionario"
                  className="block text-sm font-medium text-gray-700"
                >
                  Descripción del Cuestionario
                </label>
                <div className="mt-1">
                  <Input
                    type="text"
                    id="descripcioncuestionario"
                    name="descripcioncuestionario"
                    value={nuevoCuestionario.descripcioncuestionario}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="estadocuestionario"
                  className="block text-sm font-medium text-gray-700"
                >
                  Estado del Cuestionario
                </label>
                <div className="mt-1">
                  <select
                    id="estadocuestionario"
                    name="estadocuestionario"
                    value={nuevoCuestionario.estadocuestionario}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              onPress={handleCloseModal}
              className="text-white hover:bg-gray-500"
            >
              Cancelar
            </Button>
            <Button
              color="primary"
              onPress={handleCrearCuestionario}
              className="text-white hover:bg-blue-700"
            >
              Crear
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AdminPage;
