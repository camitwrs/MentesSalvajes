import { Card } from "@heroui/card"
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@heroui/react"
import {
  Loader2,
  CheckCircle2,
  CloudUpload,
  CheckCircle,
  Calendar,
  User,
  FileText,
  Clock,
  ExternalLink,
} from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { FilePond, registerPlugin } from "react-filepond"
import FilePondPluginImagePreview from "filepond-plugin-image-preview"
import PropTypes from "prop-types"

import { guardarArchivoRequest } from "../../api/ilustraciones"
import { useAuth } from "../../autenticacion/context/AuthContext"

registerPlugin(FilePondPluginImagePreview)

const CartaIlustracion = ({ estadoFiltro, orden, ilustraciones, fetchIlustraciones, searchQuery }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [modalContent, setModalContent] = useState(null)
  const { user } = useAuth()
  const [files, setFiles] = useState([])
  const pondRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [filteredIlustraciones, setFilteredIlustraciones] = useState([])
  const [uploadedImage, setUploadedImage] = useState(null)

  useEffect(() => {
    let filtered = [...ilustraciones]

    // Corregimos aquí: usamos lowercase para evitar problemas de mayúsculas
    if (estadoFiltro !== "todas") {
      filtered = filtered.filter(
        (item) =>
          (estadoFiltro === "pendientes" && item.estadoilustracion.toLowerCase() === "pendiente") ||
          (estadoFiltro === "completadas" && item.estadoilustracion.toLowerCase() === "completado"),
      )
    }

    // Filtrar por búsqueda
    if (searchQuery) {
      filtered = filtered.filter((item) => item.tituloilustracion.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Ordenar
    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.fechaasignacionilustracion)
      const dateB = new Date(b.fechaasignacionilustracion)
      return orden === "reciente" ? dateB - dateA : dateA - dateB
    })

    setFilteredIlustraciones(filtered)
  }, [ilustraciones, estadoFiltro, orden, searchQuery])

  const handleOpenModal = (tarjeta) => {
    setModalContent(tarjeta)
    setFiles([])
    setSuccess(false)
    setLoading(false)
    setUploadedImage(null)
    onOpen()
  }

  const handleCloseModal = () => {
    onClose()
  }

  const handleUpload = async (file, load, clearFile) => {
    setLoading(true)
    setSuccess(false)
    const formData = new FormData()
    formData.append("archivoilustracion", file.file)
    formData.append("iddisenador", user.idusuario)
    formData.append("idilustracion", modalContent.idilustracion)

    try {
      await guardarArchivoRequest(formData)
      setSuccess(true)
      load("unique-file-id")
      setTimeout(() => {
        clearFile()
      }, 1000)
      setTimeout(() => {
        handleCloseModal()
        setSuccess(false)
        fetchIlustraciones() // 👈 Ahora recargamos después de cerrar
      }, 2500)
    } catch (error) {
      console.error("Error al subir el archivo:", error)
      load(null)
    } finally {
      setLoading(false)
    }
  }

  const resetUpload = () => {
    setFiles([])
    setSuccess(false)
    setUploadedImage(null)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {filteredIlustraciones.length > 0 ? (
        filteredIlustraciones.map((tarjeta) => (
          <Card key={tarjeta.idilustracion} className="rounded-lg border border-gray-200 shadow-sm p-5 bg-white">
            <div className="space-y-4">
              {/* Encabezado con docente y estado */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <h2 className="text-base font-medium text-gray-900">Docente: {tarjeta.tituloilustracion}</h2>
                </div>

                <div
                  className={`px-3 py-1 rounded-full text-sm flex items-center gap-1.5 ${
                    tarjeta.estadoilustracion.toLowerCase() === "completado"
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {tarjeta.estadoilustracion.toLowerCase() === "completado" ? (
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 flex-shrink-0" />
                  )}
                  <span>{tarjeta.estadoilustracion.toLowerCase()}</span>
                </div>
              </div>

              {/* Fechas */}
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span>Solicitud: {new Date(tarjeta.fechaasignacionilustracion).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CloudUpload className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span>
                    Subida:{" "}
                    {tarjeta.fechacargailustracion
                      ? new Date(tarjeta.fechacargailustracion).toLocaleDateString()
                      : "No disponible"}
                  </span>
                </div>
              </div>

              {/* Botón Ver descripción */}
              <button
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2.5 rounded-md font-medium transition"
                onClick={() => handleOpenModal(tarjeta)}
              >
                <div className="flex text-center justify-center items-center gap-2">
                  Ver descripción
                  <ExternalLink className="w-4 h-4 flex-shrink-0" />
                </div>
              </button>
            </div>
          </Card>
        ))
      ) : (
        <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-8 sm:py-12 bg-gray-50 rounded-lg border border-dashed">
          <FileText className="h-10 sm:h-12 w-10 sm:w-12 mx-auto text-gray-400" />
          <h3 className="mt-4 text-base sm:text-lg font-medium">No se encontraron ilustraciones</h3>
          <p className="mt-2 text-xs sm:text-sm text-gray-500">Prueba con otros filtros o términos de búsqueda</p>
          <button
            className="mt-4 px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium"
            onClick={() => window.location.reload()}
          >
            Restablecer filtros
          </button>
        </div>
      )}

      {modalContent && (
        <Modal isOpen={isOpen} onOpenChange={handleCloseModal} isDismissable={false} isKeyboardDismissDisabled={true}>
          <ModalContent
            className={`w-[95%] ${
              modalContent?.urlarchivoilustracion || files.length > 0 ? "max-w-4xl" : "max-w-md"
            } bg-white shadow-lg rounded-lg p-4 sm:p-6 overflow-y-auto max-h-[90vh]`}
          >
            <ModalHeader className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-cyan-600 flex-shrink-0" />
                <h2 className="text-base sm:text-lg font-bold">Detalles de la Ilustración</h2>
              </div>
              <p className="text-xs sm:text-sm text-gray-500">Información completa sobre la solicitud de ilustración</p>
            </ModalHeader>

            <ModalBody className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                <span className="text-sm sm:text-base font-semibold">{modalContent.tituloilustracion}</span>

                <div
                  className={`px-3 py-1 rounded-full text-sm flex items-center gap-1.5 self-start sm:self-auto ${
                    modalContent.estadoilustracion === "Completado"
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {modalContent.estadoilustracion === "Completado" ? (
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 flex-shrink-0" />
                  )}
                  <span>{modalContent.estadoilustracion.toLowerCase()}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <p className="text-gray-500">Fecha de solicitud:</p>
                  <p className="font-medium">
                    {modalContent.fechaasignacionilustracion
                      ? new Date(modalContent.fechaasignacionilustracion).toLocaleDateString()
                      : "No disponible"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-500">Fecha de subida:</p>
                  <p className="font-medium">
                    {modalContent.fechacargailustracion
                      ? new Date(modalContent.fechacargailustracion).toLocaleDateString()
                      : "No disponible"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Descripción:</h4>
                <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border max-h-32 sm:max-h-40 overflow-y-auto whitespace-pre-line">
                  {modalContent.descripcionilustracion || "No disponible"}
                </div>
              </div>

              {modalContent.estadoilustracion !== "Completado" && (
                <div className="space-y-4">
                  {success && uploadedImage ? (
                    <div className="text-center space-y-4">
                      <div className="flex justify-center items-center">
                        <div className="relative w-full max-w-md">
                          <img
                            src={uploadedImage || "/placeholder.svg"}
                            alt="Imagen subida"
                            className="rounded-lg border border-gray-200 max-h-48 sm:max-h-64 mx-auto object-contain"
                          />
                        </div>
                      </div>

                      <div className="flex justify-center items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                        <span className="font-medium text-sm sm:text-base">¡Imagen subida correctamente!</span>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 mt-4">
                        <button
                          className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium transition flex items-center justify-center gap-2 text-sm"
                          onClick={resetUpload}
                        >
                          Subir otra imagen
                        </button>

                        <button
                          className="px-3 sm:px-4 py-1.5 sm:py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md font-medium transition text-sm mt-2 sm:mt-0"
                          onClick={handleCloseModal}
                        >
                          Cerrar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Área de carga simplificada - Más intuitiva */}
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="p-3 sm:p-6">
                          <FilePond
                            ref={pondRef}
                            files={files}
                            allowMultiple={false}
                            acceptedFileTypes={["image/png", "image/jpeg", "image/webp", "image/svg+xml"]}
                            onupdatefiles={setFiles}
                            labelIdle="Arrastra tu imagen aquí"
                            credits={false}
                            className="filepond-container"
                            server={{
                              process: (_fieldName, file, _metadata, load, _error, _progress, _abort, clear) => {
                                handleUpload({ file }, load, () => clear())
                              },
                            }}
                          />
                          <div className="text-center text-xs sm:text-sm text-gray-500 mt-2">
                            Formatos aceptados: PNG, JPG, WEBP, SVG
                          </div>
                        </div>
                      </div>

                      {/* Indicadores de estado */}
                      {loading && (
                        <div className="flex justify-center items-center gap-2 mt-2">
                          <Loader2 className="w-4 sm:w-5 h-4 sm:h-5 animate-spin text-cyan-600" />
                          <span className="text-xs sm:text-sm text-gray-600">Subiendo imagen...</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </div>
  )
}

CartaIlustracion.propTypes = {
  estadoFiltro: PropTypes.string.isRequired,
  orden: PropTypes.string.isRequired,
  ilustraciones: PropTypes.array.isRequired,
  fetchIlustraciones: PropTypes.func.isRequired,
  searchQuery: PropTypes.string,
}

CartaIlustracion.defaultProps = {
  searchQuery: "",
}

export default CartaIlustracion

