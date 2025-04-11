import PropTypes from "prop-types";
import { useState } from "react";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import {
  BarChartIcon as ChartBarIcon,
  EditIcon,
  SaveIcon,
  XIcon,
  Trash2Icon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  actualizarCuestionarioRequest,
  eliminarCuestionarioRequest,
} from "../../api/cuestionarios";
import { useAlert } from "../../shared/context/AlertContext";

const TablaCuestionarios = ({ cuestionarios, setCuestionarios }) => {
  const [editingId, setEditingId] = useState(null);
  const [editedCuestionario, setEditedCuestionario] = useState({});
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  // Estados para el modal de eliminación
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [cuestionarioAEliminar, setCuestionarioAEliminar] = useState(null);

  const handleVerEstadisticas = (idcuestionario) => {
    navigate(`/resumen/${idcuestionario}`);
  };

  const handleEditarCuestionario = (cuestionario) => {
    setEditingId(cuestionario.idcuestionario || cuestionario.id);
    setEditedCuestionario({ ...cuestionario });
  };

  const handleGuardarEdicion = async () => {
    // ... (código sin cambios) ...
    try {
      const idcuestionario = editingId;
      const datosParaActualizar = {
        titulocuestionario: editedCuestionario.titulocuestionario,
        estadocuestionario: editedCuestionario.estadocuestionario,
      };

      const response = await actualizarCuestionarioRequest(
        idcuestionario,
        datosParaActualizar
      );

      if (response.status === 200 || response.status === 204) {
        const cuestionarioActualizadoBackend = response.data.cuestionario;
        setCuestionarios((prev) =>
          prev.map((cuestionario) =>
            (cuestionario.idcuestionario || cuestionario.id) === idcuestionario
              ? {
                  ...cuestionario,
                  ...cuestionarioActualizadoBackend,
                }
              : cuestionario
          )
        );
        setEditingId(null);
        setEditedCuestionario({});
        showAlert("Cuestionario actualizado exitosamente.", "success");
      } else {
        console.error("Error al actualizar el cuestionario:", response);
        showAlert("No se pudo actualizar. Intenta nuevamente.", "danger");
      }
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      showAlert("Ocurrió un error al guardar. Intenta nuevamente.", "danger");
    }
  };

  const handleCancelarEdicion = () => {
    setEditingId(null);
    setEditedCuestionario({});
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
        console.error("Error al eliminar el cuestionario:", response);
        showAlert("No se pudo eliminar. Intenta nuevamente.", "danger");
      }
    } catch (error) {
      console.error("Error al eliminar el cuestionario:", error);
      showAlert("Ocurrió un error al eliminar. Intenta nuevamente.", "danger");
    }
  };

  if (!cuestionarios || cuestionarios.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        No se encontraron cuestionarios
      </div>
    );
  }

  return (
    <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200">
      <table className="w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
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
        <tbody className="bg-white divide-y divide-gray-200">
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

            if (editingId === idcuestionario) {
              // Modo edición
              return (
                <tr key={`edit-${idcuestionario}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Input
                      value={editedCuestionario.titulocuestionario || ""}
                      onChange={(e) =>
                        setEditedCuestionario((prev) => ({
                          ...prev,
                          titulocuestionario: e.target.value,
                        }))
                      }
                      placeholder="Título del cuestionario"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm  rounded-md border-1 border-red-500 bg-blue-50"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-600">
                      {cuestionario.preguntas?.length || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-600 font-semibold">
                      {cuestionario.totalRespuestas}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Input
                      value={editedCuestionario.estadocuestionario || ""}
                      onChange={(e) =>
                        setEditedCuestionario((prev) => ({
                          ...prev,
                          estadocuestionario: e.target.value,
                        }))
                      }
                      placeholder="Estado"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm  rounded-md border-1 border-red-500 bg-blue-50"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {cuestionario.fechacreacioncuestionario
                      ? new Date(
                          cuestionario.fechacreacioncuestionario
                        ).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        color="success"
                        size="sm"
                        onPress={handleGuardarEdicion}
                        className="flex items-center gap-1 transition-all text-white hover:bg-green-600 hover:shadow-md"
                      >
                        <SaveIcon className="w-4 h-4" />
                        <span>Guardar</span>
                      </Button>
                      <Button
                        color="danger"
                        size="sm"
                        onPress={handleCancelarEdicion}
                        className="flex items-center gap-1 transition-all hover:bg-red-600 hover:shadow-md"
                      >
                        <XIcon className="w-4 h-4" />
                        <span>Cancelar</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            }

            // Vista normal
            return (
              <tr key={`view-${idcuestionario}`} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">
                    {cuestionario.titulocuestionario || "Sin título"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-600">
                    {cuestionario.preguntas?.length || 0}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-600 font-semibold">
                    {cuestionario.totalRespuestas}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Chip
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {cuestionario.estadocuestionario || "Desconocido"}
                  </Chip>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {cuestionario.fechacreacioncuestionario
                    ? new Date(
                        cuestionario.fechacreacioncuestionario
                      ).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex justify-end gap-2">
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
                      <span>Ver estadísticas</span>
                    </Button>
                    <Button
                      color="secondary"
                      size="sm"
                      onPress={() => handleEditarCuestionario(cuestionario)}
                      className="flex items-center gap-1 transition-all hover:bg-purple-800 hover:shadow-md"
                    >
                      <EditIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      color="danger"
                      size="sm"
                      onPress={() => handleEliminarCuestionario(cuestionario)}
                      className="flex items-center gap-1 transition-all hover:bg-red-700 hover:shadow-md"
                    >
                      <Trash2Icon className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* Modal de Confirmación de Eliminación */}
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
