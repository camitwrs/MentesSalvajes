import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import {
  Loader2,
  CheckCircle2,
  Upload,
  Clock,
  CheckCircle,
  Calendar,
  User,
  FileText,
  Eye,
} from "lucide-react";
import { useState, useRef } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import { Chip } from "@heroui/chip";
import PropTypes from "prop-types";

import { guardarArchivoRequest } from "../../api/ilustraciones";
import { useAuth } from "../../autenticacion/context/AuthContext";

registerPlugin(FilePondPluginImagePreview);

const CartaIlustracion = ({ estadoFiltro, orden, ilustraciones, fetchIlustraciones }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalContent, setModalContent] = useState(null);
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const pondRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleOpenModal = (tarjeta) => {
    setModalContent(tarjeta);
    setFiles([]);
    setSuccess(false);
    setLoading(false);
    onOpen();
  };

  const handleCloseModal = () => {
    onClose();
  };

  const handleUpload = async (file, load, clearFile) => {
    setLoading(true);
    setSuccess(false);
    const formData = new FormData();
    formData.append("archivoilustracion", file.file);
    formData.append("iddisenador", user.idusuario);
    formData.append("idilustracion", modalContent.idilustracion);

    try {
      await guardarArchivoRequest(formData);
      fetchIlustraciones();
      setSuccess(true);
      load("unique-file-id");
      setTimeout(() => {
        clearFile();
      }, 1000);
      setTimeout(() => {
        handleCloseModal();
        setSuccess(false);
      }, 2500);
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      load(null);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoStyles = (estado) => {
    return estado === "Completado"
      ? "bg-green-100 text-green-800 border-green-300"
      : "bg-gray-100 text-gray-800 border-gray-300";
  };

  const getEstadoIcon = (estado) => {
    return estado === "Completado" ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <Clock className="w-4 h-4 text-gray-600" />
    );
  };

  let ilustracionesFiltradas = [...ilustraciones];
  if (estadoFiltro !== "todas") {
    ilustracionesFiltradas = ilustracionesFiltradas.filter(
      (item) =>
        (estadoFiltro === "pendientes" && item.estadoilustracion === "Pendiente") ||
        (estadoFiltro === "completadas" && item.estadoilustracion === "Completado")
    );
  }

  ilustracionesFiltradas = ilustracionesFiltradas.sort((a, b) => {
    const dateA = new Date(a.fechaasignacionilustracion);
    const dateB = new Date(b.fechaasignacionilustracion);
    return orden === "reciente" ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(360px,1fr))] gap-8">
      {ilustracionesFiltradas.length > 0 ? (
        ilustracionesFiltradas.map((tarjeta) => (
          <Card
            key={tarjeta.idilustracion}
            className="rounded-xl border border-gray-200 shadow-lg p-6 max-w-[420px] mx-auto"
          >
            <CardHeader className="flex items-center justify-between mb-4 p-0">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-500" />
                <h2 className="text-xl font-semibold">Docente: {tarjeta.tituloilustracion}</h2>
              </div>

              <Chip
                variant="bordered"
                className={`text-sm py-1 px-3 capitalize font-medium flex items-center gap-1.5 ${getEstadoStyles(
                  tarjeta.estadoilustracion
                )}`}
                startContent={getEstadoIcon(tarjeta.estadoilustracion)}
              >
                {tarjeta.estadoilustracion}
              </Chip>
            </CardHeader>

            <CardBody className="space-y-3 text-sm text-gray-700 p-0 py-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>
                  <span className="text-gray-600 font-medium">Solicitud:</span>{" "}
                  {new Date(tarjeta.fechaasignacionilustracion).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span>
                  <span className="text-gray-600 font-medium">Carga:</span>{" "}
                  {tarjeta.fechacargailustracion
                    ? new Date(tarjeta.fechacargailustracion).toLocaleDateString()
                    : "No disponible"}
                </span>
              </div>
            </CardBody>

            <CardFooter className="flex justify-center mt-6 p-0 pt-2">
              <button
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg font-medium transition flex justify-center gap-2"
                onClick={() => handleOpenModal(tarjeta)}
              >
                <Eye className="w-4 h-4" /> Ver más
              </button>
            </CardFooter>
          </Card>
        ))
      ) : (
        <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border border-dashed">
          <FileText className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">No se encontraron ilustraciones</h3>
          <p className="mt-2 text-sm text-gray-500">Prueba con otros filtros o términos de búsqueda</p>
          <button
            className="mt-4 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium"
            onClick={() => window.location.reload()}
          >
            Restablecer filtros
          </button>
        </div>
      )}

      {modalContent && (
        <Modal
          isOpen={isOpen}
          onOpenChange={handleCloseModal}
          isDismissable={false}
          isKeyboardDismissDisabled={true}
        >
          <ModalContent className="w-[90%] max-w-md bg-white shadow-lg rounded-lg p-4">
            <ModalHeader className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-cyan-600" />
                <h2 className="text-lg font-bold">Detalles de la Ilustración</h2>
              </div>
              <p className="text-sm text-gray-500">Información completa sobre la solicitud de ilustración</p>
            </ModalHeader>

            <ModalBody className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-base font-semibold">{modalContent.tituloilustracion}</span>

                <Chip
                  variant="bordered"
                  className={`text-sm py-1 px-3 capitalize font-medium flex items-center gap-1.5 ${getEstadoStyles(
                    modalContent.estadoilustracion
                  )}`}
                  startContent={getEstadoIcon(modalContent.estadoilustracion)}
                >
                  {modalContent.estadoilustracion}
                </Chip>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <p className="text-gray-500">Fecha de solicitud:</p>
                  <p className="font-medium">
                    {modalContent.fechaasignacionilustracion
                      ? new Date(modalContent.fechaasignacionilustracion).toLocaleDateString()
                      : "No disponible"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-500">Fecha de carga:</p>
                  <p className="font-medium">
                    {modalContent.fechacargailustracion
                      ? new Date(modalContent.fechacargailustracion).toLocaleDateString()
                      : "No disponible"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Descripción:</h4>
                <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border max-h-40 overflow-y-auto whitespace-pre-line">
                  {modalContent.descripcionilustracion || "No disponible"}
                </div>
              </div>

              {modalContent.estadoilustracion !== "Completado" && (
                <>
                  <FilePond
                    ref={pondRef}
                    files={files}
                    allowMultiple={false}
                    acceptedFileTypes={["image/png", "image/jpeg", "image/webp", "image/svg+xml"]}
                    onupdatefiles={setFiles}
                    labelIdle='Arrastra tu imagen o <span class="filepond--label-action text-blue-600">Explora</span>'
                    credits={false}
                    className="rounded-lg border-2 border-blue-300 bg-gray-100 text-base p-4"
                    server={{
                      process: (_fieldName, file, _metadata, load, _error, _progress, abort, clear) => {
                        handleUpload({ file }, load, () => clear());
                      },
                    }}
                  />

                  {loading && (
                    <div className="flex justify-center mt-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </div>
                  )}

                  {success && (
                    <div className="flex justify-center mt-2 text-green-600 animate-pulse">
                      <CheckCircle2 className="w-5 h-5" /> ¡Archivo subido!
                    </div>
                  )}
                </>
              )}
            </ModalBody>

            <ModalFooter>
              <button
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2"
                onClick={() => pondRef.current && pondRef.current.browse()}
              >
                <Upload className="w-5 h-5" />
                Subir Imágenes
              </button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

CartaIlustracion.propTypes = {
  estadoFiltro: PropTypes.string.isRequired,
  orden: PropTypes.string.isRequired,
  ilustraciones: PropTypes.array.isRequired,
  fetchIlustraciones: PropTypes.func.isRequired,
};

export default CartaIlustracion;
