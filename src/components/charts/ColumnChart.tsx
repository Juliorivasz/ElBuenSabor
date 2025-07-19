import { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import { interceptorsApiClient } from "../../services/interceptors/axios.interceptors";

export const ColumnChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const options = {
    title: "Pedidos Distribuídos Por Hora",
    titleTextStyle: {
      fontSize: 18,
      bold: true,
      color: "#233238",
    },
    bar: {
      groupWidth: "50%",
    },    
    vAxis: {
      title: "Promedio cantidad de pedidos",
      format: "##'%'",
      slantedText: true,
      slantedTextAngle: 45,
      textStyle: { fontSize: 12, color: "#333" },
    },
    hAxis: {
      slantedText: true,
      slantedTextAngle: 45,
      textStyle: { fontSize: 13, color: "#333" },
    },
    colors: ["#4285F4"],
    chartArea: {
      left: 60,
      top: 60,
      width: "85%",
      height: "70%",
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await interceptorsApiClient.get("/estadisticas/promedioPedidosPorHora");
        setData(response.data);
        setError(null);
      } catch (err) {
        setError("Error al cargar los datos del gráfico");
        console.error("Error fetching column chart data:", err);
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
        chartType="ColumnChart"
        width="100%"
        height="400px"
        data={data}
        options={options}
      />
    </div>
  );
};
