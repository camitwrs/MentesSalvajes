import { useState, useEffect, useRef } from "react";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Button } from "@heroui/button";
import { useNavigate } from "react-router-dom";
import {
  getHistorialRespuestasRequest,
  getDetallePorRespuestaRequest,
} from "../../api/respuestas";
import {
  getIlustracionPorRespuestaRequest,
  guardarArchivoRequest,
} from "../../api/ilustraciones";
import { getEducadoresRequest } from "../../api/usuarios";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { useAlert } from "../../shared/context/AlertContext";
import {
  FileQuestion,
  PencilLine,
  X,
  User,
  Image,
  Eye,
  ArrowLeft,
  CloudUpload,
} from "lucide-react";

import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

registerPlugin(FilePondPluginImagePreview);

const PerfilesEducadoresPage = () => {
  const [educadores, setEducadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [detalleRespuesta, setDetalleRespuesta] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  const [modalImagenVisible, setModalImagenVisible] = useState(false);
  const [imagenData, setImagenData] = useState({
    idilustracion: "",
    urlarchivoilustracion: "",
    descripcionilustracion: "",
  });
  const [loadingImagen, setLoadingImagen] = useState(false);

  const [files, setFiles] = useState([]);
  const [uploadMessage, setUploadMessage] = useState("");
  const pondRef = useRef(null);

  const navigate = useNavigate();
  const { showAlert } = useAlert();

  // Obtener la lista de educadores al cargar la página
  useEffect(() => {
    const fetchEducadores = async () => {
      try {
        setLoading(true);
        const response = await getEducadoresRequest();
        setEducadores(response.data || []);
      } catch (err) {
        console.error("Error al obtener los educadores:", err);
        setError("Error al cargar los educadores.");
      } finally {
        setLoading(false);
      }
    };

    fetchEducadores();
  }, []);

  // Obtener el historial de respuestas de un educador
  const fetchHistorial = async (idusuario) => {
    try {
      const response = await getHistorialRespuestasRequest(idusuario);
      setHistorial(response.data);
    } catch (err) {
      console.error("Error al obtener el historial de respuestas:", err);
    }
  };

  // Obtener el detalle de una respuesta
  const handleVerDetalle = async (idrespuesta) => {
    try {
      setLoadingDetalle(true);
      const response = await getDetallePorRespuestaRequest(idrespuesta);
      setDetalleRespuesta(response.data || []);
      setModalVisible(true);
    } catch (err) {
      console.error("Error al obtener el detalle de la respuesta:", err);
    } finally {
      setLoadingDetalle(false);
    }
  };

  const handleVerImagen = async (idrespuesta) => {
    try {
      setLoadingImagen(true); // Activar el estado de carga
      const response = await getIlustracionPorRespuestaRequest(idrespuesta);
      setImagenData(response.data); // Guardar los datos de la imagen y descripción

      setModalImagenVisible(true); // Mostrar el modal
    } catch (error) {
      console.error("Error al obtener la ilustración:", error);
    } finally {
      setLoadingImagen(false); // Desactivar el estado de carga
    }
  };

  // Subir o actualizar una imagen
  const handleUpload = async (file, load, clearFile) => {
    const formData = new FormData();
    formData.append("archivoilustracion", file.file);
    formData.append("idilustracion", imagenData.idilustracion);

    try {
      const response = await guardarArchivoRequest(formData);
      setUploadMessage(response.data.mensaje);

      // Actualizar la imagen en el estado
      setImagenData((prev) => ({
        ...prev,
        urlarchivoilustracion: response.data.urlarchivoilustracion,
      }));

      load("unique-file-id");

      // Cerrar el modal después de subir la imagen
      setTimeout(() => {
        clearFile();
        setModalImagenVisible(false);
        showAlert("Imagen subida exitosamente", "success");
        setFiles([]);
        setUploadMessage("");
      }, 2000);
    } catch (error) {
      showAlert("rror al subir la imagen", "warning");
      setUploadMessage("Error al subir la imagen");
      load(null);
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
      <div>
        <Button
          onPress={() => navigate(-1)} // Navegar hacia atrás
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </Button>
      </div>
      <h1 className="text-xl sm:text-2xl font-bold mb-4">
        Perfiles de Educadores
      </h1>
      <Accordion variant="shadow">
        {educadores.map((educador) => (
          <AccordionItem
            key={educador.idusuario}
            title={
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />{" "}
                {/* Ícono de usuario */}
                <span className="font-semibold">{`${educador.nombreusuario} ${educador.apellidousuario}`}</span>
              </div>
            }
            subtitle={educador.correousuario}
            textValue={`${educador.nombreusuario} ${educador.apellidousuario}`} // Texto plano para accesibilidad
            onPress={() => fetchHistorial(educador.idusuario)} // Cargar historial al expandir
          >
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-700 mb-2">
                Historial de Respuestas
              </h3>

              <ul className="space-y-2">
                {historial.map((respuesta) => (
                  <li
                    key={respuesta.idrespuesta}
                    className="flex justify-between items-center bg-gray-100 p-3 rounded-md"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {respuesta.titulocuestionario}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(respuesta.fecharespuesta).toLocaleString(
                          "es-ES"
                        )}
                      </p>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        className="flex items-center gap-1 py-1.5 px-3 rounded-md text-sm bg-Moonstone text-white"
                        onPress={() => handleVerDetalle(respuesta.idrespuesta)}
                      >
                        <Eye className="w-4 h-4" />
                        Ver Detalle
                      </Button>
                      <button
                        className="flex items-center gap-1 py-1.5 px-3 rounded-md text-sm bg-YankeesBlue text-white"
                        onClick={() => handleVerImagen(respuesta.idrespuesta)}
                      >
                        <Image className="w-4 h-4" />
                        Ver Imagen
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Modal para mostrar el detalle de una respuesta */}
      {modalVisible && (
        <Modal
          className="max-w-4xl mx-auto"
          isOpen={modalVisible}
          onClose={() => setModalVisible(false)}
        >
          <ModalContent>
            <ModalHeader>Detalle de la Respuesta</ModalHeader>
            <ModalBody className="max-h-[70vh] overflow-y-auto">
              {loadingDetalle ? (
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  <p className="ml-4 text-gray-600">Cargando detalles...</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {detalleRespuesta.map((detalle, index) => (
                    <li key={index} className="border-b pb-2">
                      <div className="flex items-start gap-4">
                        {/* Ícono para la pregunta */}
                        <div className="flex items-center justify-center bg-blue-100 rounded-full w-10 h-10 shrink-0">
                          <FileQuestion className="w-6 h-6 text-blue-500" />
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm font-medium text-gray-700">
                            <span className="font-bold">Pregunta:</span>{" "}
                            {detalle.textopregunta}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            {/* Ícono para la respuesta */}
                            <PencilLine className="w-5 h-5 text-green-500" />
                            <span className="font-bold">Respuesta:</span>{" "}
                            {detalle.respuestaelegida}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                color="default"
                onPress={() => setModalVisible(false)}
                className="text-black hover:bg-gray-300"
              >
                <X className="w-4 h-4" />
                Cerrar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {modalImagenVisible && (
        <Modal
          isOpen={modalImagenVisible}
          onClose={() => setModalImagenVisible(false)}
          className="max-w-4xl mx-auto"
        >
          <ModalContent>
            <ModalHeader>Ilustración</ModalHeader>
            <ModalBody className="max-h-[70vh] overflow-y-auto">
              {loadingImagen ? (
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  <p className="ml-4 text-gray-600">Cargando imagen...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  {imagenData.urlarchivoilustracion && (
                    <img
                      src={imagenData.urlarchivoilustracion}
                      alt="Ilustración"
                      className="rounded-md shadow-md"
                      style={{
                        width: "200px",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                  )}

                  <div className="mt-4 w-full">
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
                      labelIdle="Arrastra tu imagen aquí o haz clic para actualizar"
                      credits={false}
                      className="filepond-container"
                      server={{
                        process: (
                          _fieldName,
                          file,
                          _metadata,
                          load,
                          _error,
                          _progress,
                          _abort,
                          clear
                        ) => {
                          handleUpload({ file }, load, () => clear());
                        },
                      }}
                    />
                    {uploadMessage && (
                      <p className="text-center text-sm text-gray-500 mt-2">
                        {uploadMessage}
                      </p>
                    )}
                    {imagenData.descripcionilustracion && (
                      <p className="mt-4 text-gray-700 text-center">
                        {imagenData.descripcionilustracion}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <button
                className="bg-gray-500 text-white py-1.5 px-3 rounded-md text-sm"
                onClick={() => setModalImagenVisible(false)}
              >
                Cerrar
              </button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default PerfilesEducadoresPage;
