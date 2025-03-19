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
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import { Chip } from "@heroui/chip";
import PropTypes from "prop-types";

import {
  getAllIlustracionesRequest,
  guardarArchivoRequest,
} from "../../api/ilustraciones";
import { useAuth } from "../../autenticacion/context/AuthContext";

registerPlugin(FilePondPluginImagePreview);

const CartaIlustracion = ({ estadoFiltro, orden }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalContent, setModalContent] = useState(null);
  const [ilustraciones, setIlustraciones] = useState([]);
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const pondRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const fetchIlustraciones = () => {
    getAllIlustracionesRequest()
      .then((response) => {
        let data = response.data;

        if (estadoFiltro !== "todas") {
          data = data.filter(
            (item) =>
              (estadoFiltro === "pendientes" &&
                item.estadoilustracion === "Pendiente") ||
              (estadoFiltro === "completadas" &&
                item.estadoilustracion === "Completado")
          );
        }

        data = data.sort((a, b) => {
          const dateA = new Date(a.fechaasignacionilustracion);
          const dateB = new Date(b.fechaasignacionilustracion);
          return orden === "reciente" ? dateB - dateA : dateA - dateB;
        });

        setIlustraciones(data);
      })
      .catch((error) => {
        console.error("Error al obtener las ilustraciones:", error);
      });
  };

  useEffect(() => {
    fetchIlustraciones();
  }, [estadoFiltro, orden]);

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

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {ilustraciones.length > 0 ? (
          ilustraciones.map((tarjeta) => (
            <Card
              key={tarjeta.idilustracion}
              className="rounded-lg border border-gray-200 shadow-md"
            >
              <CardHeader className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-500" />
                  <h2 className="text-base font-semibold">
                    {tarjeta.tituloilustracion}
                  </h2>
                </div>

                {tarjeta.estadoilustracion === "Pendiente" ? (
                  <Chip
                    variant="bordered"
                    color="default"
                    className="bg-gray-100 border-gray-300 text-gray-800 text-sm"
                    startContent={<Clock className="w-4 h-4 text-gray-700" />}
                  >
                    Pendiente
                  </Chip>
                ) : (
                  <Chip
                    variant="bordered"
                    color="success"
                    className="bg-green-100 border-green-400 text-green-700 text-sm"
                    startContent={
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    }
                  >
                    Completado
                  </Chip>
                )}
              </CardHeader>

              <CardBody className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>
                    <strong>Solicitud:</strong>{" "}
                    {new Date(
                      tarjeta.fechaasignacionilustracion
                    ).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>
                    <strong>Subida:</strong>{" "}
                    {tarjeta.fechacargailustracion
                      ? new Date(
                          tarjeta.fechacargailustracion
                        ).toLocaleDateString()
                      : "No disponible"}
                  </span>
                </div>
              </CardBody>

              <CardFooter className="flex justify-center">
                <button
                  className="w-full bg-Moonstone text-white py-2 rounded-md font-medium hover:bg-opacity-90 transition"
                  onClick={() => handleOpenModal(tarjeta)}
                >
                  Ver descripción
                </button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="text-center text-xl col-span-4 text-gray-500">
            No hay ilustraciones disponibles por el momento :(
          </p>
        )}
      </div>

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
                <User className="h-6 w-6 text-Moonstone" />
                <h2 className="text-lg font-bold">
                  {modalContent.tituloilustracion}
                </h2>
              </div>
              <p className="text-sm text-gray-500">
                Información completa sobre la solicitud de ilustración
              </p>
            </ModalHeader>

            <ModalBody className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-base font-semibold">
                  {modalContent.tituloilustracion}
                </span>

                {modalContent.estadoilustracion === "Pendiente" ? (
                  <Chip
                    variant="bordered"
                    color="default"
                    className="bg-gray-100 border-gray-300 text-gray-800 text-sm"
                    startContent={<Clock className="w-4 h-4 text-gray-700" />}
                  >
                    Pendiente
                  </Chip>
                ) : (
                  <Chip
                    variant="bordered"
                    color="success"
                    className="bg-green-100 border-green-400 text-green-700 text-sm"
                    startContent={
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    }
                  >
                    Completado
                  </Chip>
                )}
              </div>

              <div className="flex justify-between text-sm">
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500">Fecha de solicitud:</span>
                  <span>
                    {modalContent.fechaasignacionilustracion
                      ? new Date(
                          modalContent.fechaasignacionilustracion
                        ).toLocaleDateString()
                      : "No disponible"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500">Fecha de subida:</span>
                  <span>
                    {modalContent.fechacargailustracion
                      ? new Date(
                          modalContent.fechacargailustracion
                        ).toLocaleDateString()
                      : "No disponible"}
                  </span>
                </div>
              </div>

              <div>
                <p className="font-semibold mb-1">Descripción:</p>
                <div className="border rounded-md bg-gray-50 p-2 max-h-32 overflow-y-auto text-sm text-gray-700 whitespace-pre-line">
                  {modalContent.descripcionilustracion || "No disponible"}
                </div>
              </div>

              {modalContent.estadoilustracion !== "completado" && (
                <>
                  <FilePond
                    ref={pondRef}
                    files={files}
                    allowMultiple={false}
                    acceptedFileTypes={[
                      "image/png",
                      "image/jpeg",
                      "image/webp",
                      "image/svg+xml",
                    ]}
                    onupdatefiles={setFiles}
                    labelIdle='Arrastra tu imagen o <span class="filepond--label-action text-blue-600">Explora</span>'
                    credits={false}
                    className="rounded-lg border-2 border-blue-300 bg-gray-100 text-base p-4"
                    server={{
                      process: (
                        _fieldName,
                        file,
                        _metadata,
                        load,
                        _error,
                        _progress,
                        abort,
                        clear
                      ) => {
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
                      <CheckCircle2 className="w-5 h-5" /> 隆Archivo subido!
                    </div>
                  )}
                </>
              )}
            </ModalBody>

            <ModalFooter>
              <button
                className="w-full bg-Moonstone text-white py-2 px-4 rounded-md flex items-center justify-center gap-2"
                onClick={() => pondRef.current && pondRef.current.browse()}
              >
                <Upload className="w-5 h-5" />
                Subir Im谩genes
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
};

export default CartaIlustracion;
