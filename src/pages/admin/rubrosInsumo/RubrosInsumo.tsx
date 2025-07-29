"use client"

import { useEffect, useState } from "react"
import { PageAdminHeader } from "../../../components/Admin/siderbar/PageAdminHeader"
import { RubroInsumoDetailsModal } from "../../../components/rubrosInsumo/RubroInsumoDetailsModal"
import { RubroInsumoForm } from "../../../components/rubrosInsumo/RubroInsumoForm"
import { RubrosInsumoTable } from "../../../components/rubrosInsumo/RubrosInsumoTable"
import type { RubroInsumoAbmDto } from "../../../models/dto/RubroInsumoAbmDto"
import type { NuevoRubroInsumoDto } from "../../../models/dto/NuevoRubroInsumoDto"
import { rubroInsumoAbmServicio } from "../../../services/rubroInsumoAbmServicio"
import { useRubrosInsumoStore } from "../../../store/rubrosInsumo/useRubrosInsumoStore"
import { NotificationService } from "../../../utils/notifications"

export const RubrosInsumo = () => {
  const { rubros, loading, error, fetchRubros, altaBajaRubro, clearError } = useRubrosInsumoStore()

  const [selectedRubro, setSelectedRubro] = useState<RubroInsumoAbmDto | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showFormModal, setShowFormModal] = useState(false)
  const [editingRubro, setEditingRubro] = useState<RubroInsumoAbmDto | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  // Cargar rubros al montar el componente
  useEffect(() => {
    fetchRubros()
  }, [fetchRubros])

  // Mostrar errores
  useEffect(() => {
    if (error) {
      NotificationService.error(error)
      clearError()
    }
  }, [error, clearError])

  // Función recursiva para obtener todos los descendientes de un rubro
  const getAllDescendants = (parentId: number, allRubros: RubroInsumoAbmDto[]): RubroInsumoAbmDto[] => {
    const directChildren = allRubros.filter((r) => r.getIdRubroPadre() === parentId)
    let allDescendants: RubroInsumoAbmDto[] = [...directChildren]

    // Para cada hijo directo, obtener sus descendientes recursivamente
    for (const child of directChildren) {
      const childDescendants = getAllDescendants(child.getIdRubroInsumo(), allRubros)
      allDescendants = [...allDescendants, ...childDescendants]
    }

    return allDescendants
  }

  const handleViewDetails = (rubro: RubroInsumoAbmDto) => {
    setSelectedRubro(rubro)
    setShowDetailsModal(true)
  }

  const handleEdit = (rubro: RubroInsumoAbmDto) => {
    setEditingRubro(rubro)
    setShowFormModal(true)
  }

  const handleNuevoRubro = () => {
    setEditingRubro(null)
    setShowFormModal(true)
  }

  const handleToggleStatus = async (rubro: RubroInsumoAbmDto) => {
    try {
      const estadoActual = rubro.isDadoDeAlta()
      const nuevoEstado = !estadoActual

      // Obtener todos los descendientes del rubro
      const descendientes = getAllDescendants(rubro.getIdRubroInsumo(), rubros)

      // Cambiar el estado del rubro actual
      await altaBajaRubro(rubro.getIdRubroInsumo())

      // Si tiene descendientes, cambiar su estado también
      if (descendientes.length > 0) {
        for (const descendiente of descendientes) {
          // Solo cambiar si el estado del descendiente es diferente al nuevo estado del rubro
          if (descendiente.isDadoDeAlta() === estadoActual) {
            await altaBajaRubro(descendiente.getIdRubroInsumo())
          }
        }
      }

      const accion = estadoActual ? "desactivado" : "activado"
      const mensaje =
        descendientes.length > 0
          ? `Rubro ${accion} correctamente junto con ${descendientes.length} descendiente${descendientes.length !== 1 ? "s" : ""}`
          : `Rubro ${accion} correctamente`

      NotificationService.success(mensaje, "Estado actualizado")
    } catch (error) {
      NotificationService.error(error instanceof Error ? error.message : "Error al cambiar el estado del rubro")
    }
  }

  const handleFormSubmit = async (rubroData: NuevoRubroInsumoDto) => {
    setFormLoading(true)
    try {
      if (editingRubro) {
        // Editar rubro existente
        await rubroInsumoAbmServicio.modificarRubro(editingRubro.getIdRubroInsumo(), rubroData)
        NotificationService.success("Rubro actualizado correctamente", "Actualización exitosa")
      } else {
        // Crear nuevo rubro
        await rubroInsumoAbmServicio.crearRubro(rubroData)
        NotificationService.success("Rubro creado correctamente", "Creación exitosa")
      }

      // Refrescar la lista
      await fetchRubros()

      // Cerrar modal
      setShowFormModal(false)
      setEditingRubro(null)
    } catch (error) {
      NotificationService.error(error instanceof Error ? error.message : "Error al guardar el rubro")
    } finally {
      setFormLoading(false)
    }
  }

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false)
    setSelectedRubro(null)
  }

  const handleCloseFormModal = () => {
    setShowFormModal(false)
    setEditingRubro(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageAdminHeader title="Rubros de Insumo" subtitle="Gestiona los rubros para organizar tus insumos" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RubrosInsumoTable
          rubros={rubros}
          loading={loading}
          onEdit={handleEdit}
          onViewDetails={handleViewDetails}
          onToggleStatus={handleToggleStatus}
          onNuevoRubro={handleNuevoRubro}
        />
      </div>

      {/* Modal de detalles */}
      {showDetailsModal && selectedRubro && (
        <RubroInsumoDetailsModal rubro={selectedRubro} rubros={rubros} onClose={handleCloseDetailsModal} />
      )}

      {/* Modal de formulario */}
      {showFormModal && (
        <RubroInsumoForm
          rubro={editingRubro}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseFormModal}
          loading={formLoading}
        />
      )}
    </div>
  )
}
