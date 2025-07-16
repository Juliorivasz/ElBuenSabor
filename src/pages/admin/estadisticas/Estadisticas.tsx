import { PieChart } from "../../../components/charts/PieChart"
import { ColumnChart } from "../../../components/charts/ColumnChart"
import { LineChart } from "../../../components/charts/LineChart"
import { BarChart } from "@mui/icons-material"
import { MultipleLineChart } from "../../../components/charts/MultipleLineChart"

export const Estadisticas = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Contenedor del título arriba */}
        <div className="flex items-center mb-6">
          <BarChart   className="text-black mr-3" fontSize="large" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Estadísticas del negocio</h1>
            <p className="text-gray-600 mt-1">Gestiona tus finanzas de manera eficiente</p>
          </div>
        </div>

        {/* Contenedor con los gráficos, separado debajo */}
        <div className="space-y-8 mt-8">
          {/* Primera fila - Gráfico de torta */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <MultipleLineChart />
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <PieChart />
            </div>
          </div>

          {/* Segunda fila - Gráficos de columnas y líneas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <ColumnChart />
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <LineChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}
