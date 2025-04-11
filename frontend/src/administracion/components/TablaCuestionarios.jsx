import PropTypes from "prop-types";
import { useState } from "react";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Switch } from "@heroui/react";
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

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [cuestionarioAEliminar, setCuestionarioAEliminar] = useState(null);

  const handleVerEstadisticas = (idcuestionario) => {
    navigate(`/resumen/${idcuestionario}`);
  };

  const handleEditarCuestionario = (cuestionario) => {
    setEditingId(cuestionario.idcuestionario || cuestionario.id);
    const estadoNormalizado =
      cuestionario.estadocuestionario?.toLowerCase() === "activo"
        ? "activo"
        : "inactivo";
    setEditedCuestionario({
      ...cuestionario,
      estadocuestionario: estadoNormalizado,
    });
  };

  const handleGuardarEdicion = async () => {
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
              ? { ...cuestionario, ...cuestionarioActualizadoBackend }
              : cuestionario
          )
        );
        setEditingId(null);
        setEditedCuestionario({});
        showAlert("Cuestionario actualizado exitosamente.", "success");
      } else {
        console.error("Error al actualizar:", response);
        showAlert("No se pudo actualizar. Intenta nuevamente.", "danger");
      }
    } catch (error) {
      console.error("Error al guardar:", error);
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
        console.error("Error al eliminar:", response);
        showAlert("No se pudo eliminar. Intenta nuevamente.", "danger");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
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

  // --- Estilos para celdas responsivas ---
  const cellBaseStyle = "px-6 py-3 block md:table-cell"; // Base para todas las celdas
  const cellLabelStyle = "font-bold mr-2 md:hidden"; // Estilo para la etiqueta en móvil
  const cellContentStyle = "text-right md:text-left"; // Alineación del contenido

  return (
    // El div exterior ya tiene overflow-x-auto, lo cual es un buen fallback
    <div className="shadow-sm rounded-lg border border-gray-200 overflow-x-auto">
      <table className="w-full min-w-[640px] md:min-w-full divide-y divide-gray-200 border-collapse">
        {" "}
        {/* Añadido min-w para scroll en pantallas muy pequeñas */}
        <thead className="bg-gray-50 hidden md:table-header-group">
          {" "}
          {/* Ocultar thead en pantallas pequeñas */}
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
          {" "}
          {/* tbody se comporta como block en móvil */}
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

            // --- Fila se comporta como block en móvil ---
            return (
              <tr
                key={
                  editingId === idcuestionario
                    ? `edit-${idcuestionario}`
                    : `view-${idcuestionario}`
                }
                className="block md:table-row hover:bg-gray-50 mb-4 md:mb-0 border md:border-none rounded-lg md:rounded-none shadow-md md:shadow-none"
              >
                {/* --- Celda Título --- */}
                <td className={`${cellBaseStyle} border-b md:border-none`}>
                  <span className={cellLabelStyle}>Título:</span>
                  <div className={`${cellContentStyle} inline-block md:block`}>
                    {" "}
                    {/* Ajuste para inline en móvil */}
                    {editingId === idcuestionario ? (
                      <Input
                        value={editedCuestionario.titulocuestionario || ""}
                        onChange={(e) =>
                          setEditedCuestionario((prev) => ({
                            ...prev,
                            titulocuestionario: e.target.value,
                          }))
                        }
                        placeholder="Título"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md border-2 border-blue-500 bg-blue-50"
                      />
                    ) : (
                      <div className="font-medium text-gray-900">
                        {cuestionario.titulocuestionario || "Sin título"}
                      </div>
                    )}
                  </div>
                </td>

                {/* --- Celda Preguntas --- */}
                <td className={`${cellBaseStyle} border-b md:border-none`}>
                  <span className={cellLabelStyle}>Preguntas:</span>
                  <div
                    className={`${cellContentStyle} inline-block md:block text-gray-600`}
                  >
                    {cuestionario.preguntas?.length || 0}
                  </div>
                </td>

                {/* --- Celda Respuestas --- */}
                <td className={`${cellBaseStyle} border-b md:border-none`}>
                  <span className={cellLabelStyle}>Respuestas:</span>
                  <div
                    className={`${cellContentStyle} inline-block md:block text-gray-600 font-semibold`}
                  >
                    {cuestionario.totalRespuestas}
                  </div>
                </td>

                {/* --- Celda Estado --- */}
                <td className={`${cellBaseStyle} border-b md:border-none`}>
                  <span className={cellLabelStyle}>Estado:</span>
                  <div className={`${cellContentStyle} inline-block md:block`}>
                    {editingId === idcuestionario ? (
                      <Switch
                        isSelected={
                          editedCuestionario.estadocuestionario === "activo"
                        }
                        onValueChange={(newIsSelected) => {
                          setEditedCuestionario((prev) => ({
                            ...prev,
                            estadocuestionario: newIsSelected
                              ? "activo"
                              : "inactivo",
                          }));
                        }}
                      >
                        {editedCuestionario.estadocuestionario === "activo"
                          ? "Activo"
                          : "Inactivo"}
                      </Switch>
                    ) : (
                      <Chip
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {cuestionario.estadocuestionario || "Desconocido"}
                      </Chip>
                    )}
                  </div>
                </td>

                {/* --- Celda Fecha Creación --- */}
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

                {/* --- Celda Acciones --- */}
                <td className={`${cellBaseStyle} text-right`}>
                  {" "}
                  {/* No necesita etiqueta, alineado a la derecha */}
                  <div
                    className={`flex gap-2 ${
                      editingId === idcuestionario
                        ? "justify-end"
                        : "justify-end md:justify-end"
                    }`}
                  >
                    {" "}
                    {/* Ajusta justificación */}
                    {editingId === idcuestionario ? (
                      <>
                        <Button
                          color="success"
                          size="sm"
                          onPress={handleGuardarEdicion}
                          className="flex items-center gap-1 transition-all text-white hover:bg-green-600 hover:shadow-md"
                        >
                          <SaveIcon className="w-4 h-4" />
                          <span className="hidden sm:inline">Guardar</span>{" "}
                          {/* Oculta texto en pantallas muy pequeñas */}
                        </Button>
                        <Button
                          color="danger"
                          size="sm"
                          onPress={handleCancelarEdicion}
                          className="flex items-center gap-1 transition-all hover:bg-red-600 hover:shadow-md"
                        >
                          <XIcon className="w-4 h-4" />
                          <span className="hidden sm:inline">
                            Cancelar
                          </span>{" "}
                          {/* Oculta texto en pantallas muy pequeñas */}
                        </Button>
                      </>
                    ) : (
                      <>
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
                            Ver estadísticas
                          </span>{" "}
                          {/* Oculta texto en pantallas pequeñas/medianas */}
                        </Button>
                        <Button
                          color="secondary"
                          size="sm"
                          onPress={() => handleEditarCuestionario(cuestionario)}
                          className="flex items-center gap-1 transition-all hover:bg-purple-800 hover:shadow-md"
                        >
                          <EditIcon className="w-4 h-4" />
                          <span className="hidden lg:inline">Editar</span>{" "}
                          {/* Oculta texto en pantallas pequeñas/medianas */}
                        </Button>
                        <Button
                          color="danger"
                          size="sm"
                          onPress={() =>
                            handleEliminarCuestionario(cuestionario)
                          }
                          className="flex items-center gap-1 transition-all hover:bg-red-700 hover:shadow-md"
                        >
                          <Trash2Icon className="w-4 h-4" />
                          <span className="hidden lg:inline">
                            Eliminar
                          </span>{" "}
                          {/* Oculta texto en pantallas pequeñas/medianas */}
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Modal de Confirmación de Eliminación */}
      <Modal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal}>
        {/* ... contenido del modal sin cambios ... */}
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
