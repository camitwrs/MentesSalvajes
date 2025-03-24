import { MoreHorizontal } from "lucide-react"

const TablaCuestionarios = () => {
  // Datos de ejemplo (hardcoded como se muestra en la imagen)
  const cuestionarios = [
    {
      id: 1,
      titulo: "Cuestionario 8.0 ",
      preguntas: 10,
      respuestas: 145,
      estado: "Activo",
      fechaCreacion: "15/03/2025",
    },
  ]

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-3 px-4 text-left text-gray-500 font-medium">Título</th>
            <th className="py-3 px-4 text-left text-gray-500 font-medium">Preguntas</th>
            <th className="py-3 px-4 text-left text-gray-500 font-medium">Respuestas</th>
            <th className="py-3 px-4 text-left text-gray-500 font-medium">Estado</th>
            <th className="py-3 px-4 text-left text-gray-500 font-medium">Fecha de Creación</th>
            <th className="py-3 px-4 text-right text-gray-500 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cuestionarios.map((cuestionario) => (
            <tr key={cuestionario.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="py-4 px-4 text-gray-900 font-medium">{cuestionario.titulo}</td>
              <td className="py-4 px-4 text-gray-700">{cuestionario.preguntas}</td>
              <td className="py-4 px-4 text-gray-700">{cuestionario.respuestas}</td>
              <td className="py-4 px-4">
                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-black text-white">
                  {cuestionario.estado}
                </span>
              </td>
              <td className="py-4 px-4 text-gray-700">{cuestionario.fechaCreacion}</td>
              <td className="py-4 px-4 text-right">
                <button className="text-gray-500 hover:text-gray-700">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TablaCuestionarios

