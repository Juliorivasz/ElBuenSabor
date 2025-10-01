"use client"

import { useState, useEffect } from "react"
import { Chart } from "react-google-charts"
import { interceptorsApiClient } from "../../services/interceptors/axios.interceptors"
import { exportarDatosGraficoAExcel } from "../../utils/exportUtils"

export const LineChart = () => {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const options = {
    title: "Total Recaudado Por Mes",
    titleTextStyle: {
      fontSize: 18,
      bold: true,
      color: "#233238",
    },
    curveType: "function",
    hAxis: {
      slantedText: true,
      slantedTextAngle: 55,
      textStyle: { fontSize: 13, color: "#333" },
    },
    vAxis: {
      format: "'$ '##",
    },
    chartArea: {
      left: 60,
      top: 60,
      width: "85%",
      height: "60%",
    },

    tooltip: { isHtml: true },
    series: {
      0: {
        pointSize: 6,
        lineWidth: 4,
        color: "#34a853",
      },
    },
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await interceptorsApiClient.get("/estadisticas/recaudadoPorMes")
        setData(response.data)
        setError(null)
      } catch (err) {
        setError("Error al cargar los datos del gráfico")
        console.error("Error fetching line chart data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleExport = () => {
    if (data && data.length > 0) {
      const datosFormateados = data.slice(1).map((row, index) => ({
        "N°": index + 1,
        Mes: row[0],
        "Total Recaudado": `$${Number(row[1]).toFixed(2)}`,
      }))

      exportarDatosGraficoAExcel(datosFormateados, "Recaudado Por Mes", "recaudado_por_mes", [
        { wch: 5 }, // N°
        { wch: 20 }, // Mes
        { wch: 18 }, // Total Recaudado
      ])
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Exportar Excel
        </button>
      </div>
      <Chart chartType="LineChart" width="100%" height="400px" data={data} options={options} />
    </div>
  )
}
