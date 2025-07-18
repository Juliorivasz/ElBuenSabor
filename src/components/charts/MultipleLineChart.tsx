import { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import { interceptorsApiClient } from "../../services/interceptors/axios.interceptors";

export const MultipleLineChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const options = {
    title: "Frecuencia de Clientes por Mes",
    titleTextStyle: {
      fontSize: 18,
      bold: true,
      color: "#233238",
    },

    hAxis: {
      // title: "Mes",
      slantedText: true,
      slantedTextAngle: 45,
      textStyle: { fontSize: 12, color: "#333" },
    },
    vAxis: {
      title: "Cantidad de Clientes",
      textStyle: { fontSize: 12, color: "#333" },
    },
    legend: {
      position: "bottom",
      alignment: "center",
      textStyle: {
        color: "#233238",
        fontSize: 12,
      },
    },
    chartArea: {
      left: 60,
      top: 60,
      bottom: 100,
      width: "85%",
      height: "100%",
    },
    colors: ["#FF6B6B", "#FFA726", "#66BB6A"],
    series: {
      0: {
        lineWidth: 3,
      },
      1: {
        lineWidth: 3,
      },
      2: {
        lineWidth: 3,
      },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await interceptorsApiClient.get("/estadisticas/frecuenciaClientes");
        setData(response.data);
        setError(null);
      } catch (err) {
        setError("Error al cargar los datos del gráfico");
        console.error("Error fetching multiple line chart data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Chart
        chartType="LineChart"
        width="100%"
        height="400px"
        data={data}
        options={options}
      />
    </div>
  );
};
