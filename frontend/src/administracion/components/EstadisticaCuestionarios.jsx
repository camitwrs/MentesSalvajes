import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card"
import { ClipboardIcon, BarChartIcon as ChartBarIcon, UserIcon } from "lucide-react"

const EstadisticaCuestionarios = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Card 1: Total Cuestionarios */}
      <Card className="bg-white rounded-lg shadow-sm border border-gray-100">
        <CardHeader className="flex justify-between items-center p-4">
          <h3 className="text-gray-700 font-medium">Total Cuestionarios</h3>
          <div className="p-2 text-gray-500">
            <ClipboardIcon className="w-5 h-5" />
          </div>
        </CardHeader>
        <CardBody className="px-4 pb-2">
          <div className="text-4xl font-bold text-gray-900">5</div>
        </CardBody>
        <CardFooter className="px-4 pb-4 pt-0">
          <p className="text-sm text-gray-500">
            <span className="text-green-500">+2</span> desde el mes pasado
          </p>
        </CardFooter>
      </Card>

      {/* Card 2: Total Respuestas */}
      <Card className="bg-white rounded-lg shadow-sm border border-gray-100">
        <CardHeader className="flex justify-between items-center p-4">
          <h3 className="text-gray-700 font-medium">Total Respuestas</h3>
          <div className="p-2 text-gray-500">
            <ChartBarIcon className="w-5 h-5" />
          </div>
        </CardHeader>
        <CardBody className="px-4 pb-2">
          <div className="text-4xl font-bold text-gray-900">322</div>
        </CardBody>
        <CardFooter className="px-4 pb-4 pt-0">
          <p className="text-sm text-gray-500">
            <span className="text-green-500">+89</span> desde el mes pasado
          </p>
        </CardFooter>
      </Card>

      {/* Card 3: Participantes Únicos */}
      <Card className="bg-white rounded-lg shadow-sm border border-gray-100">
        <CardHeader className="flex justify-between items-center p-4">
          <h3 className="text-gray-700 font-medium">Participantes Únicos</h3>
          <div className="p-2 text-gray-500">
            <UserIcon className="w-5 h-5" />
          </div>
        </CardHeader>
        <CardBody className="px-4 pb-2">
          <div className="text-4xl font-bold text-gray-900">245</div>
        </CardBody>
        <CardFooter className="px-4 pb-4 pt-0">
          <p className="text-sm text-gray-500">
            <span className="text-green-500">+62</span> desde el mes pasado
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default EstadisticaCuestionarios
