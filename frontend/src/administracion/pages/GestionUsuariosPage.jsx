"use client"

import { useState, useEffect } from "react"
import { Button } from "@heroui/button"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal"
import { Input } from "@heroui/input"
import { Pencil, Trash, Plus, X, ArrowLeft, Save, Users, Search } from "lucide-react"
import { useNavigate } from "react-router-dom"
import {
  getUsuariosRequest,
  actualizarDatosUsuarioRequest,
  eliminarUsuarioRequest,
  registrarUsuarioSinTokenRequest,
} from "../../api/usuarios"
import { useAlert } from "../../shared/context/AlertContext"

const GestionUsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const { showAlert } = useAlert()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedUsuario, setSelectedUsuario] = useState(null)

  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombreusuario: "",
    apellidousuario: "",
    correousuario: "",
    contrasenausuario: "",
    idrol: 2, // Por defecto, el rol será "administrador"
  })

  const navigate = useNavigate()

  // Obtener la lista de usuarios al cargar la página
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await getUsuariosRequest()
        setUsuarios(response.data || [])
      } catch (err) {
        console.error("Error al obtener los usuarios:", err)
        setError("Error al cargar los usuarios.")
      } finally {
        setLoading(false)
      }
    }

    fetchUsuarios()
  }, [])

  // Filtrar usuarios según término de búsqueda
  const filteredUsuarios = usuarios.filter(
    (usuario) =>
      usuario.nombreusuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.apellidousuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.correousuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.nombrerol.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Manejar la apertura del modal para crear o editar un usuario
  const handleOpenModal = (usuario = null) => {
    setIsEditMode(!!usuario)
    setSelectedUsuario(usuario)
    setNuevoUsuario(
      usuario || {
        nombreusuario: "",
        apellidousuario: "",
        correousuario: "",
        contrasenausuario: "",
        idrol: 2, // Por defecto, el rol será "administrador"
      },
    )
    setIsModalOpen(true)
  }

  // Manejar el cierre del modal
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedUsuario(null)
  }

  // Manejar los cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNuevoUsuario((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Crear un nuevo usuario administrador
  const handleCrearUsuario = async () => {
    try {
      await registrarUsuarioSinTokenRequest(nuevoUsuario)

      setUsuarios((prev) => [
        ...prev,
        {
          ...nuevoUsuario,
          nombrerol: "administrador",
          fecharegistrousuario: new Date().toISOString(),
        },
      ])
      handleCloseModal()
      showAlert("Cambio exitoso", "success")
    } catch (err) {
      showAlert("Error, inténtelo denuevo más tarde", "warning")
      console.error("Error al crear el usuario:", err)
    }
  }

  // Editar un usuario existente
  const handleEditarUsuario = async () => {
    try {
      await actualizarDatosUsuarioRequest(selectedUsuario.idusuario, nuevoUsuario)

      setUsuarios((prev) =>
        prev.map((usuario) =>
          usuario.idusuario === selectedUsuario.idusuario ? { ...usuario, ...nuevoUsuario } : usuario,
        ),
      )
      handleCloseModal()
      showAlert("Cambio exitoso", "success")
    } catch (err) {
      console.error("Error al editar el usuario:", err)
    }
  }

  // Eliminar un usuario
  const handleEliminarUsuario = async (idusuario) => {
    try {
      await eliminarUsuarioRequest(idusuario)

      setUsuarios((prev) => prev.filter((usuario) => usuario.idusuario !== idusuario))
      showAlert("Usuario eliminado", "success")
    } catch (err) {
      showAlert("Error, inténtelo denuevo más tarde", "warning")
      console.error("Error al eliminar el usuario:", err)
    }
  }

  // Renderizado condicional para el estado de carga o error
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-gray-600">Cargando datos...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 sm:p-6 md:p-8 bg-gray-50">
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
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
    )
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 bg-gray-50">
      {/* Cabecera y navegación */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Button
          onPress={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 self-start"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </Button>

        <h1 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6 text-green-500" />
          Usuarios en la plataforma
        </h1>
      </div>

      {/* Barra de herramientas */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <Button color="primary" onPress={() => handleOpenModal()} className="flex items-center gap-2 w-full sm:w-auto">
          <Plus className="w-5 h-5" />
          Crear Usuario Administrador
        </Button>

        <div className="relative w-full sm:w-64 md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar usuarios..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Vista de escritorio: Tabla de usuarios */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Apellido
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha de Registro
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsuarios.map((usuario) => (
              <tr key={usuario.idusuario} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{usuario.nombreusuario}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{usuario.apellidousuario}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 max-w-[200px] truncate">
                  {usuario.correousuario}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(usuario.fecharegistrousuario).toLocaleDateString()}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {usuario.nombrerol}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {(usuario.nombrerol === "administrador" || usuario.nombrerol === "educador") && (
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

      {/* Vista móvil: Tarjetas de usuarios */}
      <div className="md:hidden space-y-4">
        {filteredUsuarios.map((usuario) => (
          <div key={usuario.idusuario} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">
                  {usuario.nombreusuario} {usuario.apellidousuario}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{usuario.correousuario}</p>
              </div>
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                {usuario.nombrerol}
              </span>
            </div>

            <div className="mt-3 text-xs text-gray-500">
              Registrado: {new Date(usuario.fecharegistrousuario).toLocaleDateString()}
            </div>

            {(usuario.nombrerol === "administrador" || usuario.nombrerol === "educador") && (
              <div className="mt-4 flex justify-end gap-2">
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
          </div>
        ))}

        {filteredUsuarios.length === 0 && (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-500">No se encontraron usuarios</p>
          </div>
        )}
      </div>

      {/* Modal para crear o editar un usuario */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} className="max-w-lg mx-auto">
          <ModalContent className="w-full mx-auto p-0">
            <ModalHeader className="border-b p-4 bg-gray-50">
              <h2 className="text-lg font-medium">{isEditMode ? "Editar Usuario" : "Crear Usuario Administrador"}</h2>
            </ModalHeader>
            <ModalBody className="p-4 sm:p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nombreusuario" className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre
                    </label>
                    <Input
                      type="text"
                      id="nombreusuario"
                      name="nombreusuario"
                      value={nuevoUsuario.nombreusuario}
                      onChange={handleInputChange}
                      className="block w-full"
                      placeholder="Nombre"
                    />
                  </div>
                  <div>
                    <label htmlFor="apellidousuario" className="block text-sm font-medium text-gray-700 mb-1">
                      Apellido
                    </label>
                    <Input
                      type="text"
                      id="apellidousuario"
                      name="apellidousuario"
                      value={nuevoUsuario.apellidousuario}
                      onChange={handleInputChange}
                      className="block w-full"
                      placeholder="Apellido"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="correousuario" className="block text-sm font-medium text-gray-700 mb-1">
                    Correo electrónico
                  </label>
                  <Input
                    type="email"
                    id="correousuario"
                    name="correousuario"
                    value={nuevoUsuario.correousuario}
                    onChange={handleInputChange}
                    className="block w-full"
                    placeholder="ejemplo@ejemplo.com"
                  />
                </div>
                {!isEditMode && (
                  <div>
                    <label htmlFor="contrasenausuario" className="block text-sm font-medium text-gray-700 mb-1">
                      Contraseña
                    </label>
                    <Input
                      type="password"
                      id="contrasenausuario"
                      name="contrasenausuario"
                      value={nuevoUsuario.contrasenausuario}
                      onChange={handleInputChange}
                      className="block w-full"
                      placeholder="Mínimo 6 caracteres"
                    />
                    <p className="mt-1 text-xs text-gray-500">La contraseña debe tener al menos 6 caracteres</p>
                  </div>
                )}
              </div>
            </ModalBody>
            <ModalFooter className="border-t p-4 bg-gray-50 flex flex-col sm:flex-row-reverse gap-2">
              <Button
                color="success"
                onPress={isEditMode ? handleEditarUsuario : handleCrearUsuario}
                className="w-full sm:w-auto justify-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {isEditMode ? "Guardar Cambios" : "Crear Usuario"}
              </Button>
              <Button
                color="default"
                variant="flat"
                onPress={handleCloseModal}
                className="w-full sm:w-auto justify-center"
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  )
}

export default GestionUsuariosPage
