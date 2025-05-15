import PropTypes from "prop-types";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import {
  BarChartIcon as ChartBarIcon,
  Trash2Icon,
  EditIcon,
  KeyRound,
} from "lucide-react";
import { eliminarCuestionarioRequest } from "../../api/cuestionarios";
import { useAlert } from "../../shared/context/AlertContext";
import { useState } from "react";

const TablaCuestionarios = ({ cuestionarios, setCuestionarios }) => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [cuestionarioAEliminar, setCuestionarioAEliminar] = useState(null);

  const handleVerEstadisticas = (idcuestionario) => {
    navigate(`/resumen/${idcuestionario}`);
  };

  const handleEditarCuestionario = (idcuestionario) => {
    navigate(`/editar-cuestionario/${idcuestionario}`);
  };

  const handleGestionarSesiones = (idcuestionario) => {
    navigate(`/sesiones/${idcuestionario}`);
  };

  const handleEliminarCuestionario = (cuestionario) => {
    setCuestionarioAEliminar(cuestionario);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCuestionarioAEliminar(null);
  };

  const handleConfirmarEliminar = async () => {
    if (!cuestionarioAEliminar) return;
    const idcuestionario =
      cuestionarioAEliminar.idcuestionario || cuestionarioAEliminar.id;

    try {
      const response = await eliminarCuestionarioRequest(idcuestionario);
      if (response.status === 200 || response.status === 204) {
        setCuestionarios((prev) =>
          prev.filter((c) => (c.idcuestionario || c.id) !== idcuestionario)
        );
        showAlert("Cuestionario eliminado exitosamente.", "success");
        handleCloseDeleteModal();
      } else {
        console.error("Error al eliminar:", response);
        showAlert("No se pudo eliminar. Intenta nuevamente.", "warning");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      showAlert("Ocurrió un error al eliminar. Intenta nuevamente.", "warning");
    }
  };

  if (!cuestionarios || cuestionarios.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        No se encontraron cuestionarios
      </div>
    );
  }

  const cellBaseStyle = "px-6 py-3 block md:table-cell";
  const cellLabelStyle = "font-bold mr-2 md:hidden";
  const cellContentStyle = "text-right md:text-left";

  return (
    <div className="shadow-sm rounded-lg border border-gray-200 overflow-x-auto">
      <table className="w-full min-w-[640px] md:min-w-full divide-y divide-gray-200 border-collapse">
        <thead className="bg-gray-50 hidden md:table-header-group">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Título
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Preguntas
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Respuestas
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha Creación
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 block md:table-row-group">
          {cuestionarios.map((cuestionario) => {
            if (!cuestionario) return null;

            const isActive =
              cuestionario.estadocuestionario?.toLowerCase() === "activo";
            const idcuestionario =
              cuestionario.idcuestionario || cuestionario.id;

            if (!idcuestionario) {
              console.warn(
                "Cuestionario sin ID válido encontrado:",
                cuestionario
              );
              return null;
            }

            return (
              <tr
                key={`view-${idcuestionario}`}
                className="block md:table-row hover:bg-gray-50 mb-4 md:mb-0 border md:border-none rounded-lg md:rounded-none shadow-md md:shadow-none"
              >
                <td className={`${cellBaseStyle} border-b md:border-none`}>
                  <span className={cellLabelStyle}>Título:</span>
                  <div className={`${cellContentStyle} inline-block md:block`}>
                    <div className="font-medium text-gray-900">
                      {cuestionario.titulocuestionario || "Sin título"}
                    </div>
                  </div>
                </td>
                <td className={`${cellBaseStyle} border-b md:border-none`}>
                  <span className={cellLabelStyle}>Preguntas:</span>
                  <div
                    className={`${cellContentStyle} inline-block md:block text-gray-600 font-semibold`}
                  >
                    {cuestionario.total_preguntas || 0}
                  </div>
                </td>
                <td className={`${cellBaseStyle} border-b md:border-none`}>
                  <span className={cellLabelStyle}>Respuestas:</span>
                  <div
                    className={`${cellContentStyle} inline-block md:block text-gray-600 font-semibold`}
                  >
                    {cuestionario.total_respuestas}
                  </div>
                </td>
                <td className={`${cellBaseStyle} border-b md:border-none`}>
                  <span className={cellLabelStyle}>Estado:</span>
                  <div className={`${cellContentStyle} inline-block md:block`}>
                    <Chip
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {cuestionario.estadocuestionario || "Desconocido"}
                    </Chip>
                  </div>
                </td>
                <td className={`${cellBaseStyle} border-b md:border-none`}>
                  <span className={cellLabelStyle}>Creado:</span>
                  <div
                    className={`${cellContentStyle} inline-block md:block text-gray-600`}
                  >
                    {cuestionario.fechacreacioncuestionario
                      ? new Date(
                          cuestionario.fechacreacioncuestionario
                        ).toLocaleDateString()
                      : "N/A"}
                  </div>
                </td>
                <td className={`${cellBaseStyle} text-right`}>
                  <div className="flex gap-2 justify-end">
                    <Button
                      color={isActive ? "primary" : "neutral"}
                      size="sm"
                      onPress={() =>
                        isActive && handleVerEstadisticas(idcuestionario)
                      }
                      disabled={!isActive}
                      className={`flex items-center gap-1 transition-all ${
                        isActive
                          ? "hover:bg-blue-600 hover:shadow-md"
                          : "opacity-70 cursor-not-allowed"
                      }`}
                    >
                      <ChartBarIcon className="w-4 h-4" />
                      <span className="hidden lg:inline">
                        Estadísticas generales
                      </span>
                    </Button>
                    <Button
                      color={isActive ? "default" : "neutral"}
                      size="sm"
                      onPress={() =>
                        isActive && handleGestionarSesiones(idcuestionario)
                      }
                      disabled={!isActive}
                      className={`flex items-center gap-1 transition-all ${
                        isActive
                          ? "hover:bg-gray-400 hover:shadow-md"
                          : "opacity-70 cursor-not-allowed"
                      }`}
                    >
                      <KeyRound className="w-4 h-4" />
                      <span className="hidden lg:inline">Sesiones</span>
                    </Button>
                    <Button
                      color="secondary"
                      size="sm"
                      onPress={() => handleEditarCuestionario(idcuestionario)}
                      className="flex items-center gap-1 transition-all hover:bg-purple-800 hover:shadow-md"
                    >
                      <EditIcon className="w-4 h-4" />
                      <span className="hidden lg:inline">Editar</span>
                    </Button>
                    <Button
                      color="danger"
                      size="sm"
                      onPress={() => handleEliminarCuestionario(cuestionario)}
                      className="flex items-center gap-1 transition-all hover:bg-red-700 hover:shadow-md"
                    >
                      <Trash2Icon className="w-4 h-4" />
                      <span className="hidden lg:inline">Eliminar</span>
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Modal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal}>
        <ModalContent>
          <ModalHeader>Confirmar Eliminación</ModalHeader>
          <ModalBody>
            <p>
              ¿Estás seguro de que deseas eliminar el cuestionario{" "}
              <strong>
                &ldquo;{cuestionarioAEliminar?.titulocuestionario || ""}&rdquo;
              </strong>
              ?
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Esta acción no se puede deshacer.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              onPress={handleCloseDeleteModal}
              className="mr-2"
            >
              Cancelar
            </Button>
            <Button color="danger" onPress={handleConfirmarEliminar}>
              Eliminar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

TablaCuestionarios.propTypes = {
  cuestionarios: PropTypes.arrayOf(PropTypes.object).isRequired,
  setCuestionarios: PropTypes.func.isRequired,
};

export default TablaCuestionarios;
