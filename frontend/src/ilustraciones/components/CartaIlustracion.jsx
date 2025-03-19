import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/react";
import { Loader2, CheckCircle2, Info } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import {
  getAllIlustracionesRequest,
  guardarArchivoRequest,
} from "../../api/ilustraciones";
import { useAuth } from "../../autenticacion/context/AuthContext";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

registerPlugin(FilePondPluginImagePreview);

const CartaIlustracion = () => {
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
        setIlustraciones(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener las ilustraciones:", error);
      });
  };

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

  useEffect(() => {
    fetchIlustraciones();
  }, []);

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
    <div className="p-4">
      {/* Grid con las tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {ilustraciones.length > 0 ? (
          ilustraciones.map((tarjeta) => (
            <Card
              key={tarjeta.idilustracion}
              className="rounded-md border border-gray-300 shadow-md"
            >
              <CardHeader>
                <h2 className="text-lg font-bold">
                  {tarjeta.tituloilustracion}
                </h2>
              </CardHeader>
              <CardBody>
                <p>
                  <strong>Estado:</strong> {tarjeta.estadoilustracion}
                </p>
                <p>
                  <strong>Fecha de solicitud:</strong>{" "}
                  {new Date(
                    tarjeta.fechaasignacionllustracion
                  ).toLocaleDateString()}
                </p>
                <p>
                  <strong>Fecha de carga:</strong>{" "}
                  {tarjeta.fechacargallustracion
                    ? new Date(
                        tarjeta.fechacargallustracion
                      ).toLocaleDateString()
                    : "No disponible"}
                </p>
              </CardBody>
              <CardFooter className="flex justify-end">
                <button
                  className="flex items-center bg-Moonstone text-white py-2 px-4 rounded-md"
                  onClick={() => handleOpenModal(tarjeta)}
                >
                  Ver más
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

      {/* Modal */}
      <Modal
        isOpen={isOpen}
        onOpenChange={handleCloseModal}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        className="fixed inset-0 flex items-start justify-center"
      >
        <ModalContent
          className={`fixed top-0 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white shadow-lg 
                max-h-[80vh] overflow-y-auto rounded-t-lg 
                transform transition-transform duration-300 ease-out 
                ${isOpen ? "translate-y-0" : "-translate-y-full"}`}
        >
          <ModalHeader>
            <h2 className="text-lg font-bold">
              {modalContent?.titulollustracion}
            </h2>
          </ModalHeader>
          <ModalBody className="text-gray-500 flex flex-col gap-4">
            <div>
              <p>
                <strong>Estado:</strong> {modalContent?.estadollustracion}
              </p>
              <p>
                <strong>Fecha de solicitud:</strong>{" "}
                {modalContent?.fechaasignacionllustracion
                  ? new Date(
                      modalContent.fechaasignacionllustracion
                    ).toLocaleDateString()
                  : "No disponible"}
              </p>
              <p>
                <strong>Fecha de carga:</strong>{" "}
                {modalContent?.fechacargallustracion
                  ? new Date(
                      modalContent.fechacargallustracion
                    ).toLocaleDateString()
                  : "No disponible"}
              </p>
              <p>{modalContent?.descripcionllustracion}</p>
            </div>

            {modalContent?.estadollustracion !== "completado" ? (
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
                    <CheckCircle2 className="w-5 h-5" /> ¡Archivo subido!
                  </div>
                )}
              </>
            ) : (
              <div className="flex justify-center mt-4 text-blue-600">
                <Info className="w-5 h-5 mr-2" /> Archivo ya subido y
                completado.
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CartaIlustracion;
