"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Chart } from "react-google-charts"
import axios from "axios"

export const PieChart = () => {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categorias, setCategorias] = useState<string[]>([])
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>("")
  const [loadingCategorias, setLoadingCategorias] = useState(true)

  const options = {
    title: `Artículos Más Vendidos: ${categoriaSeleccionada}`,
    titleTextStyle: {      
      fontSize: 24,
      bold: true,
      color: "#233238",
    },
    is3D: true,
    pieStartAngle: 0,
    sliceVisibilityThreshold: 0.02,
    legend: {
      position: "bottom",
      alignment: "center",
      textStyle: {
        color: "#233238",
        fontSize: 14,
      },
    },
    colors: ["#8AD1C2", "#9F8AD1", "#D18A99", "#BCD18A", "#D1C28A"],
  }

  // Cargar categorías al montar el componente
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setLoadingCategorias(true)
        const response = await axios.get("http://localhost:8080/categoria/nombres")
        setCategorias(response.data)
        // Seleccionar la primera categoría por defecto
        if (response.data.length > 0) {
          setCategoriaSeleccionada(response.data[0])
        }
      } catch (err) {
        console.error("Error fetching categorias:", err)
        setError("Error al cargar las categorías")
      } finally {
        setLoadingCategorias(false)
      }
    }

    fetchCategorias()
  }, [])

  // Cargar datos del gráfico cuando cambia la categoría seleccionada
  useEffect(() => {
    if (!categoriaSeleccionada) return

    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await axios.get(
          `http://localhost:8080/estadisticas/articulosMasVendidos?categoria=${categoriaSeleccionada}`,
        )
        setData(response.data)
        setError(null)
      } catch (err) {
        setError("Error al cargar los datos del gráfico")
        console.error("Error fetching pie chart data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [categoriaSeleccionada])

  const handleCategoriaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoriaSeleccionada(event.target.value)
  }

  if (loadingCategorias) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Cargando categorías...</div>
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
      {/* Selector de categoría */}
      <div className="mb-6 flex items-center space-x-4">
  <label
    htmlFor="categoria-select"
    className="text-sm font-medium text-gray-700"
  >
    Seleccionar Categoría:
  </label>
  <select
    id="categoria-select"
    value={categoriaSeleccionada}
    onChange={handleCategoriaChange}
    className="text-gray-800 block w-[190px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
  >
    {categorias.map((categoria) => (
      <option key={categoria} value={categoria}>
        {categoria}
      </option>
    ))}
  </select>
</div>


      {/* Gráfico */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      ) : (
        <Chart chartType="PieChart" width="100%" height="400px" data={data} options={options} />
      )}
    </div>
  )
}
