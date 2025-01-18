import { useState } from "react";
import CerrarSesionBoton from "../../autenticacion/components/CerrarSesionBoton";
import ListaIlustraciones from "../components/ListaIlustraciones";
import InstruccionesIlustracion from "../components/InstruccionesIlustracion";

const IlustradorPage = () => {
  const [view, setView] = useState("list");
  const [selectedIlustracion, setSelectedIlustracion] = useState(null);

  const ilustraciones = [
    {
      idIlustracion: 1,
      idEducador: 101,
      idDisenador: 201,
      prompt: "Diseño minimalista",
      imagen: "https://via.placeholder.com/300",
      titulo: "Ilustración 1",
      fechaentrega: "2024-12-15",
      estado: "Pendiente",
    },
    {
      idIlustracion: 2,
      idEducador: 102,
      idDisenador: 202,
      prompt: "Estilo abstracto",
      imagen: "https://via.placeholder.com/300",
      titulo: "Ilustración 2",
      fechaentrega: "2024-12-20",
      estado: "Aprobado",
    },
    {
      idIlustracion: 3,
      idEducador: 103,
      idDisenador: 202,
      prompt: "Estilo abstracto",
      imagen: "https://via.placeholder.com/300",
      titulo: "Ilustración 3",
      fechaentrega: "2024-12-22",
      estado: "Pendiente",
    },
    {
      idIlustracion: 4,
      idEducador: 104,
      idDisenador: 200,
      prompt: "Estilo abstracto",
      imagen: "https://via.placeholder.com/300",
      titulo: "Ilustración 4",
      fechaentrega: "2024-12-22",
      estado: "Pendiente",
    },
  ];

  const handleSelect = (id) => {
    const ilustracion = ilustraciones.find((item) => item.idIlustracion === id);
    setSelectedIlustracion(ilustracion);
    setView("details");
  };

  const handleBack = () => {
    setSelectedIlustracion(null);
    setView("list");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex justify-between items-center p-4 bg-YankeesBlue text-white shadow-md">
        <h1 className="text-xl font-bold">Ilustraciones Pendientes</h1>
        <CerrarSesionBoton />
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4">
        {view === "list" && (
          <ListaIlustraciones
            ilustraciones={ilustraciones}
            onSelect={handleSelect}
          />
        )}
        {view === "details" && (
          <InstruccionesIlustracion
            ilustracion={selectedIlustracion}
            onBack={handleBack}
          />
        )}
      </main>
    </div>
  );
};

export default IlustradorPage;
