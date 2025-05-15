import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Input } from "@heroui/input";
import { Pencil, Trash, Plus, X, ArrowLeft, Save, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getUsuariosRequest,
  actualizarDatosEducadorRequest,
  actualizarDatosUsuarioRequest,
  eliminarUsuarioRequest,
  registrarUsuarioSinTokenRequest,
} from "../../api/usuarios";
import { useAlert } from "../../shared/context/AlertContext";

const GestionUsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { showAlert } = useAlert();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);

  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombreusuario: "",
    apellidousuario: "",
    correousuario: "",
    contrasenausuario: "",
    idrol: 2, // Por defecto, el rol será "administrador"
  });

  const navigate = useNavigate();

  // Obtener la lista de usuarios al cargar la página
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getUsuariosRequest();
        setUsuarios(response.data || []);
      } catch (err) {
        console.error("Error al obtener los usuarios:", err);
        setError("Error al cargar los usuarios.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  // Manejar la apertura del modal para crear o editar un usuario
  const handleOpenModal = (usuario = null) => {
    setIsEditMode(!!usuario);
    setSelectedUsuario(usuario);
    setNuevoUsuario(
      usuario || {
        nombreusuario: "",
        apellidousuario: "",
        correousuario: "",
        contrasenausuario: "",
        idrol: 2, // Por defecto, el rol será "administrador"
      }
    );
    setIsModalOpen(true);
  };

  // Manejar el cierre del modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUsuario(null);
  };

  // Manejar los cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Crear un nuevo usuario administrador
  const handleCrearUsuario = async () => {
    try {
      await registrarUsuarioSinTokenRequest(nuevoUsuario);

      setUsuarios((prev) => [
        ...prev,
        {
          ...nuevoUsuario,
          nombrerol: "administrador",
          fecharegistrousuario: new Date().toISOString(),
        },
      ]);
      handleCloseModal();
      showAlert("Cambio exitoso", "success");
    } catch (err) {
      showAlert("Error, inténtelo denuevo más tarde", "warning");
      console.error("Error al crear el usuario:", err);
    }
  };

  // Editar un usuario existente
  const handleEditarUsuario = async () => {
    try {
      await actualizarDatosUsuarioRequest(
        selectedUsuario.idusuario,
        nuevoUsuario
      );

      setUsuarios((prev) =>
        prev.map((usuario) =>
          usuario.idusuario === selectedUsuario.idusuario
            ? { ...usuario, ...nuevoUsuario }
            : usuario
        )
      );
      handleCloseModal();
      showAlert("Cambio exitoso", "success");
    } catch (err) {
      console.error("Error al editar el usuario:", err);
      console.error("Error al eliminar el usuario:", err);
    }
  };

  // Eliminar un usuario
  const handleEliminarUsuario = async (idusuario) => {
    try {
      await eliminarUsuarioRequest(idusuario);

      setUsuarios((prev) =>
        prev.filter((usuario) => usuario.idusuario !== idusuario)
      );
      showAlert("Usuario eliminado", "success");
    } catch (err) {
      showAlert("Error, inténtelo denuevo más tarde", "warning");
      console.error("Error al eliminar el usuario:", err);
    }
  };

  // Renderizado condicional para el estado de carga o error
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-gray-600">Cargando datos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 space-y-6 bg-gray-50">
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
    <div className="min-h-screen p-8 space-y-6 bg-gray-50">
      {/* Botón Volver */}
      <div>
        <Button
          onPress={() => navigate(-1)} // Navegar hacia atrás
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </Button>
      </div>

      <h1 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2">
        <Users className="w-6 h-6 text-green-500" />
        Usuarios en la plataforma
      </h1>

      {/* Botón para crear un nuevo usuario */}
      <div>
        <Button
          color="primary"
          onPress={() => handleOpenModal()}
          className="flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Crear Usuario Administrador
        </Button>
      </div>

      {/* Tabla de usuarios */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Apellido
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Correo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha de Registro
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {usuarios.map((usuario) => (
              <tr key={usuario.idusuario}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {usuario.nombreusuario}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {usuario.apellidousuario}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {usuario.correousuario}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {usuario.fecharegistrousuario}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {usuario.nombrerol}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {(usuario.nombrerol === "administrador" ||
                    usuario.nombrerol === "educador") && (
                    <div className="flex justify-end gap-2">
                      <Button
                        color="warning"
                        size="sm"
                        onPress={() => handleOpenModal(usuario)}
                        className="flex items-center gap-1"
                      >
                        <Pencil className="w-4 h-4" />
                        Editar
                      </Button>
                      <Button
                        color="danger"
                        size="sm"
                        onPress={() => handleEliminarUsuario(usuario.idusuario)}
                        className="flex items-center gap-1"
                      >
                        <Trash className="w-4 h-4" />
                        Eliminar
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para crear o editar un usuario */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <ModalContent>
            <ModalHeader>
              {isEditMode ? "Editar Usuario" : "Crear Usuario Administrador"}
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="nombreusuario"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nombre
                  </label>
                  <Input
                    type="text"
                    id="nombreusuario"
                    name="nombreusuario"
                    value={nuevoUsuario.nombreusuario}
                    onChange={handleInputChange}
                    className="mt-1 block w-full"
                  />
                </div>
                <div>
                  <label
                    htmlFor="apellidousuario"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Apellido
                  </label>
                  <Input
                    type="text"
                    id="apellidousuario"
                    name="apellidousuario"
                    value={nuevoUsuario.apellidousuario}
                    onChange={handleInputChange}
                    className="mt-1 block w-full"
                  />
                </div>
                <div>
                  <label
                    htmlFor="correousuario"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Correo (ejemplo@ejemplo.com)
                  </label>
                  <Input
                    type="email"
                    id="correousuario"
                    name="correousuario"
                    value={nuevoUsuario.correousuario}
                    onChange={handleInputChange}
                    className="mt-1 block w-full"
                  />
                </div>
                {!isEditMode && (
                  <div>
                    <label
                      htmlFor="contrasenausuario"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Contraseña (6 carácteres mínimo)
                    </label>
                    <Input
                      type="password"
                      id="contrasenausuario"
                      name="contrasenausuario"
                      value={nuevoUsuario.contrasenausuario}
                      onChange={handleInputChange}
                      className="mt-1 block w-full"
                    />
                  </div>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="success"
                onPress={isEditMode ? handleEditarUsuario : handleCrearUsuario}
                className="text-white hover:bg-green-700"
              >
                <Save className="w-4 h-4" />
                {isEditMode ? "Guardar Cambios" : "Crear"}
              </Button>
              <Button
                color="danger"
                onPress={handleCloseModal}
                className="text-white hover:bg-red-600"
              >
                <X className="w-4 h-4" />
                Cancelar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default GestionUsuariosPage;
