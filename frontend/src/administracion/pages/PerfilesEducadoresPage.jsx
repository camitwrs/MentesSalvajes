"use client"

import { useState, useEffect, useRef } from "react"
import { Accordion, AccordionItem } from "@heroui/accordion"
import { Button } from "@heroui/button"
import { useNavigate } from "react-router-dom"
import { getHistorialRespuestasRequest, getDetallePorRespuestaRequest } from "../../api/respuestas"
import { getIlustracionPorRespuestaRequest, guardarArchivoRequest } from "../../api/ilustraciones"
import { getEducadoresRequest } from "../../api/usuarios"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal"
import { useAlert } from "../../shared/context/AlertContext"
import {
  FileQuestion,
  PencilLine,
  X,
  User,
  ImageIcon,
  Eye,
  ArrowLeft,
  Calendar,
  Search,
  Upload,
  ChevronDown,
} from "lucide-react"

import { FilePond, registerPlugin } from "react-filepond"
import FilePondPluginImagePreview from "filepond-plugin-image-preview"

// Registrar plugins de FilePond
registerPlugin(FilePondPluginImagePreview)

// Importar estilos de FilePond
import "filepond/dist/filepond.min.css"
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css"

const PerfilesEducadoresPage = () => {
  const [educadores, setEducadores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [historial, setHistorial] = useState([])
  const [detalleRespuesta, setDetalleRespuesta] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeEducadorId, setActiveEducadorId] = useState(null)

  const [modalVisible, setModalVisible] = useState(false)
  const [loadingDetalle, setLoadingDetalle] = useState(false)

  const [modalImagenVisible, setModalImagenVisible] = useState(false)
  const [imagenData, setImagenData] = useState({
    idilustracion: "",
    urlarchivoilustracion: "",
    descripcionilustracion: "",
  })
  const [loadingImagen, setLoadingImagen] = useState(false)

  const [files, setFiles] = useState([])
  const [uploadMessage, setUploadMessage] = useState("")
  const pondRef = useRef(null)

  const navigate = useNavigate()
  const { showAlert } = useAlert()

  // Obtener la lista de educadores al cargar la página
  useEffect(() => {
    const fetchEducadores = async () => {
      try {
        setLoading(true)
        const response = await getEducadoresRequest()
        setEducadores(response.data || [])
      } catch (err) {
        console.error("Error al obtener los educadores:", err)
        setError("Error al cargar los educadores.")
      } finally {
        setLoading(false)
      }
    }

    fetchEducadores()
  }, [])

  // Filtrar educadores según término de búsqueda
  const filteredEducadores = educadores.filter(
    (educador) =>
      educador.nombreusuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      educador.apellidousuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      educador.correousuario.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Obtener el historial de respuestas de un educador
  const fetchHistorial = async (idusuario) => {
    if (activeEducadorId === idusuario) {
      // Si ya está activo, no hacemos nada (el acordeón se cerrará)
      return
    }

    try {
      setActiveEducadorId(idusuario)
      const response = await getHistorialRespuestasRequest(idusuario)
      setHistorial(response.data || [])
    } catch (err) {
      console.error("Error al obtener el historial de respuestas:", err)
      showAlert("Error al cargar el historial", "warning")
    }
  }

  // Obtener el detalle de una respuesta
  const handleVerDetalle = async (idrespuesta) => {
    try {
      setLoadingDetalle(true)
      const response = await getDetallePorRespuestaRequest(idrespuesta)
      setDetalleRespuesta(response.data || [])
      setModalVisible(true)
    } catch (err) {
      console.error("Error al obtener el detalle de la respuesta:", err)
      showAlert("Error al cargar los detalles", "warning")
    } finally {
      setLoadingDetalle(false)
    }
  }

  const handleVerImagen = async (idrespuesta) => {
    try {
      setLoadingImagen(true)
      const response = await getIlustracionPorRespuestaRequest(idrespuesta)
      setImagenData(response.data)
      setModalImagenVisible(true)
    } catch (error) {
      console.error("Error al obtener la ilustración:", error)
      showAlert("Error al cargar la imagen", "warning")
    } finally {
      setLoadingImagen(false)
    }
  }

  // Subir o actualizar una imagen
  const handleUpload = async (file, load, clearFile) => {
    const formData = new FormData()
    formData.append("archivoilustracion", file.file)
    formData.append("idilustracion", imagenData.idilustracion)

    try {
      const response = await guardarArchivoRequest(formData)
      setUploadMessage(response.data.mensaje)

      // Actualizar la imagen en el estado
      setImagenData((prev) => ({
        ...prev,
        urlarchivoilustracion: response.data.urlarchivoilustracion,
      }))

      load("unique-file-id")

      // Cerrar el modal después de subir la imagen
      setTimeout(() => {
        clearFile()
        setModalImagenVisible(false)
        showAlert("Imagen subida exitosamente", "success")
        setFiles([])
        setUploadMessage("")
      }, 2000)
    } catch (_error) {
      showAlert("Error al subir la imagen", "warning")
      setUploadMessage("Error al subir la imagen")
      load(null)
    }
  }

  // Formatear fecha para mostrar
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    return new Date(dateString).toLocaleDateString("es-ES", options)
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
          <User className="w-6 h-6 text-blue-500" />
          Perfiles de Educadores
        </h1>
      </div>

      {/* Barra de búsqueda */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar educadores..."
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Lista de educadores */}
      {filteredEducadores.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <Accordion
            variant="shadow"
            className="divide-y divide-gray-200"
            selectedKeys={activeEducadorId ? new Set([activeEducadorId.toString()]) : new Set()}
            onSelectionChange={(keys) => {
              const newKey = keys.size > 0 ? Array.from(keys)[0] : null
              if (newKey) {
                fetchHistorial(Number.parseInt(newKey))
              } else {
                setActiveEducadorId(null)
              }
            }}
          >
            {filteredEducadores.map((educador) => (
              <AccordionItem
                key={educador.idusuario.toString()}
                title={
                  <div className="flex items-center gap-2 py-1">
                    <div className="flex items-center justify-center bg-blue-100 rounded-full w-10 h-10 shrink-0">
                      <User className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {`${educador.nombreusuario} ${educador.apellidousuario}`}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{educador.correousuario}</p>
                    </div>
                    <ChevronDown className="w-5 h-5 text-gray-400 transform transition-transform duration-200" />
                  </div>
                }
                aria-label={`Perfil de ${educador.nombreusuario} ${educador.apellidousuario}`}
                className="px-4 py-3 hover:bg-gray-50 transition-colors duration-150"
              >
                <div className="pt-2 pb-4 px-2">
                  <h3 className="text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <FileQuestion className="w-5 h-5 text-blue-500" />
                    Historial de Respuestas
                  </h3>

                  {historial.length > 0 ? (
                    <ul className="space-y-3">
                      {historial.map((respuesta) => (
                        <li
                          key={respuesta.idrespuesta}
                          className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden shadow-sm"
                        >
                          <div className="p-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <h4 className="font-medium text-gray-900">{respuesta.titulocuestionario}</h4>
                              <div className="flex items-center text-sm text-gray-500">
                                <Calendar className="w-4 h-4 mr-1" />
                                {formatDate(respuesta.fecharespuesta)}
                              </div>
                            </div>

                            <div className="mt-4 flex flex-col sm:flex-row gap-2">
                              <Button
                                className="flex items-center justify-center gap-1 py-2 px-4 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                onPress={() => handleVerDetalle(respuesta.idrespuesta)}
                              >
                                <Eye className="w-4 h-4" />
                                Ver Detalle
                              </Button>
                              <Button
                                className="flex items-center justify-center gap-1 py-2 px-4 rounded-md text-sm bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                                onPress={() => handleVerImagen(respuesta.idrespuesta)}
                              >
                                <ImageIcon className="w-4 h-4" />
                                Ver Imagen
                              </Button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">No hay respuestas registradas</p>
                    </div>
                  )}
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No se encontraron educadores</p>
        </div>
      )}

      {/* Modal para mostrar el detalle de una respuesta */}
      {modalVisible && (
        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)} className="max-w-4xl mx-auto">
          <ModalContent className="w-[95%] max-w-4xl mx-auto">
            <ModalHeader className="border-b p-4 bg-gray-50 flex items-center gap-2">
              <FileQuestion className="w-5 h-5 text-blue-500" />
              <span>Detalle de la Respuesta</span>
            </ModalHeader>
            <ModalBody className="p-0 max-h-[70vh] overflow-y-auto">
              {loadingDetalle ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  <p className="ml-4 text-gray-600">Cargando detalles...</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {detalleRespuesta.map((detalle, index) => (
                    <li key={index} className="p-4 sm:p-6 hover:bg-gray-50">
                      <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                        <div className="flex items-center justify-center bg-blue-100 rounded-full w-10 h-10 shrink-0">
                          <FileQuestion className="w-6 h-6 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <div className="mb-3">
                            <h4 className="font-medium text-gray-900 mb-1">Pregunta:</h4>
                            <p className="text-gray-700">{detalle.textopregunta}</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <PencilLine className="w-5 h-5 text-green-500 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-gray-900 mb-1">Respuesta:</h4>
                              <p className="text-gray-700">{detalle.respuestaelegida}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {detalleRespuesta.length === 0 && !loadingDetalle && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No hay detalles disponibles</p>
                </div>
              )}
            </ModalBody>
            <ModalFooter className="border-t p-4 bg-gray-50">
              <Button
                color="default"
                onPress={() => setModalVisible(false)}
                className="w-full sm:w-auto justify-center"
              >
                <X className="w-4 h-4 mr-2" />
                Cerrar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {/* Modal para mostrar y subir imágenes */}
      {modalImagenVisible && (
        <Modal isOpen={modalImagenVisible} onClose={() => setModalImagenVisible(false)} className="max-w-4xl mx-auto">
          <ModalContent className="w-[95%] max-w-4xl mx-auto">
            <ModalHeader className="border-b p-4 bg-gray-50 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-blue-500" />
              <span>Ilustración</span>
            </ModalHeader>
            <ModalBody className="p-6 max-h-[70vh] overflow-y-auto">
              {loadingImagen ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  <p className="ml-4 text-gray-600">Cargando imagen...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  {/* Imagen actual */}
                  {imagenData.urlarchivoilustracion ? (
                    <div className="w-full mb-6">
                      <div className="bg-gray-100 p-2 rounded-lg border border-gray-200 flex justify-center">
                        <img
                          src={imagenData.urlarchivoilustracion || "/placeholder.svg"}
                          alt="Ilustración"
                          className="rounded-md shadow-sm object-contain"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "300px",
                          }}
                        />
                      </div>

                      {imagenData.descripcionilustracion && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Descripción:</h4>
                          <p className="text-gray-600">{imagenData.descripcionilustracion}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full mb-6 p-12 bg-gray-100 rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
                      <p className="text-gray-500 text-center">No hay imagen disponible</p>
                    </div>
                  )}

                  {/* Subir nueva imagen */}
                  <div className="w-full">
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-1">
                      <Upload className="w-4 h-4" />
                      Actualizar imagen
                    </h4>
                    <FilePond
                      ref={pondRef}
                      files={files}
                      allowMultiple={false}
                      acceptedFileTypes={["image/png", "image/jpeg", "image/webp", "image/svg+xml"]}
                      onupdatefiles={setFiles}
                      labelIdle='Arrastra tu imagen aquí o <span class="filepond--label-action">haz clic para buscar</span>'
                      credits={false}
                      className="filepond-container"
                      server={{
                        process: (_fieldName, file, _metadata, load, _error, _progress, _abort, clear) => {
                          handleUpload({ file }, load, () => clear())
                        },
                      }}
                    />
                    {uploadMessage && <p className="mt-2 text-sm text-center text-gray-500">{uploadMessage}</p>}
                  </div>
                </div>
              )}
            </ModalBody>
            <ModalFooter className="border-t p-4 bg-gray-50">
              <Button
                color="default"
                onPress={() => setModalImagenVisible(false)}
                className="w-full sm:w-auto justify-center"
              >
                <X className="w-4 h-4 mr-2" />
                Cerrar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  )
}

export default PerfilesEducadoresPage
