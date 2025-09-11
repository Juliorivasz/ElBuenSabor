import { useAuth0 } from "@auth0/auth0-react"
import { useEffect, useState } from "react"
import { Chart } from "react-google-charts"
import { interceptorsApiClient } from "../../services/interceptors/axios.interceptors"

export const LineChart = () => {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { isAuthenticated, isLoading: isAuth0Loading, getAccessTokenSilently } = useAuth0()

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
      if (!isAuthenticated || isAuth0Loading) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        await getAccessTokenSilently()
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
  }, [isAuthenticated, isAuth0Loading, getAccessTokenSilently])

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
      <Chart chartType="LineChart" width="100%" height="400px" data={data} options={options} />
    </div>
  )
}
