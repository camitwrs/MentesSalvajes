import EstadisticaCuestionarios from "../components/EstadisticaCuestionarios";
import TablaCuestionarios from "../components/TablaCuestionarios";

const AdminPage = () => {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">
          Panel de Cuestionarios
        </h1>
      </div>
      <div>
        <EstadisticaCuestionarios />
      </div>
      <div className="mt-6">
        <TablaCuestionarios />
      </div>

    </div>
  );
};

export default AdminPage;
