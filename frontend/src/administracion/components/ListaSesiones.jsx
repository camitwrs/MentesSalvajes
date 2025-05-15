import { useState } from "react";
import { Button } from "@heroui/button";
import { BarChart, Users, Copy, CheckCircle, Trash2 } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { useAlert } from "../../shared/context/AlertContext";
import { eliminarSesionRequest } from "../../api/sesiones";

const ListaSesiones = ({ sesiones, onDeleteSession }) => {
  const [deleteModal, setDeleteModal] = useState({ open: false, sesion: null });
  const [codigoCopiado, setCodigoCopiado] = useState(null);
  const { showAlert } = useAlert();

  const handleCopiarCodigo = (code) => {
    navigator.clipboard.writeText(code);
    setCodigoCopiado(code);
    setTimeout(() => setCodigoCopiado(null), 2000);
  };

  const confirmarEliminacion = (sesion) => {
    setDeleteModal({ open: true, sesion });
  };

  const handleEliminar = async () => {
    if (!deleteModal.sesion) return;

    try {
      await eliminarSesionRequest(deleteModal.sesion.idsesion);

      if (onDeleteSession) {
        onDeleteSession(deleteModal.sesion.idsesion);
      }
      showAlert("Sesión eliminada exitosamente", "success");
      setDeleteModal({ open: false, sesion: null });
    } catch (error) {
      console.error("Error al eliminar la sesión:", error);
      showAlert("Error al eliminar la sesión", "warning");
    }
  };

  if (!sesiones || sesiones.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">
          No hay sesiones creadas para este cuestionario
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Código de la sesión
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre de la sesión
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha y Hora
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sesiones.map((sesion) => (
            <tr key={sesion.idsesion} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <span className="font-medium text-blue-600">
                    {sesion.codigosesion}
                  </span>
                  <button
                    onClick={() => handleCopiarCodigo(sesion.codigosesion)}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                  >
                    {codigoCopiado === sesion.codigosesion ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {sesion.nombresesion}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(sesion.fechacreacionsesion).toLocaleDateString()}{" "}
                {new Date(sesion.fechacreacionsesion).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <Button
                    color="warning"
                    size="sm"
                    onPress={() => confirmarEliminacion(sesion)}
                    className="flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Eliminar</span>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, sesion: null })}
      >
        <ModalContent>
          <ModalHeader>Confirmar Eliminación</ModalHeader>
          <ModalBody>
            <p>
              ¿Estás seguro de que deseas eliminar la sesión{" "}
              <strong>{deleteModal.sesion?.nombresesion}</strong> con código{" "}
              <strong>{deleteModal.sesion?.codigosesion}</strong>?
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Esta acción no se puede deshacer y eliminará todas las respuestas
              asociadas a esta sesión.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              onPress={() => setDeleteModal({ open: false, sesion: null })}
              className="mr-2"
            >
              Cancelar
            </Button>
            <Button color="warning" onPress={handleEliminar}>
              Eliminar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ListaSesiones;
