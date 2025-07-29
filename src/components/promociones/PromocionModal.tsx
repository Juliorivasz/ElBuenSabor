"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Close as CloseIcon, CloudUpload as UploadIcon, Link as LinkIcon } from "@mui/icons-material";
import type { Promocion } from "../../models/Promocion";
import { promocionServicio, type PromocionData, type ArticuloListado } from "../../services/promocionServicio";
import { NotificationService } from "../../utils/notifications";

interface PromocionModalProps {
  promocion?: Promocion | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const PromocionModal: React.FC<PromocionModalProps> = ({ promocion, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<PromocionData>({
    titulo: "",
    descripcion: "",
    descuento: 0,
    horarioInicio: "",
    horarioFin: "",
    activo: true,
    idArticulo: 0,
  });

  const [articulos, setArticulos] = useState<ArticuloListado[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageOption, setImageOption] = useState<"file" | "url">("file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const isEditing = !!promocion;

  useEffect(() => {
    cargarArticulos();
    if (promocion) {
      setFormData({
        titulo: promocion.getTitulo(),
        descripcion: promocion.getDescripcion(),
        descuento: promocion.getDescuento(),
        horarioInicio: promocion.getHorarioInicio(),
        horarioFin: promocion.getHorarioFin(),
        activo: promocion.getActivo(),
        idArticulo: promocion.getIdArticulo(),
      });
      if (promocion.getUrl()) {
        setImageUrl(promocion.getUrl());
        setPreviewUrl(promocion.getUrl());
        setImageOption("url");
      }
    }
  }, [promocion]);

  const cargarArticulos = async () => {
    try {
      const data = await promocionServicio.obtenerArticulos();
      setArticulos(data);
    } catch (error) {
      console.error("Error al cargar artículos:", error);
      NotificationService.error("Error al cargar la lista de artículos");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? Number.parseFloat(value) || 0
          : type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setImageUrl("");
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    setPreviewUrl(url);
    setSelectedFile(null);
  };

  const handleImageOptionChange = (option: "file" | "url") => {
    setImageOption(option);
    if (option === "file") {
      setImageUrl("");
    } else {
      setSelectedFile(null);
    }
    setPreviewUrl("");
  };

  const validateForm = () => {
    if (!formData.titulo.trim()) {
      NotificationService.error("El título es obligatorio");
      return false;
    }
    if (!formData.descripcion.trim()) {
      NotificationService.error("La descripción es obligatoria");
      return false;
    }
    if (formData.descuento <= 0 || formData.descuento > 1) {
      NotificationService.error("El descuento debe ser un valor entre 0.01 y 1");
      return false;
    }
    if (formData.idArticulo === 0) {
      NotificationService.error("Debe seleccionar un artículo");
      return false;
    }
    if (imageOption === "file" && !selectedFile && !isEditing) {
      NotificationService.error("Debe seleccionar una imagen");
      return false;
    }
    if (imageOption === "url" && !imageUrl.trim()) {
      NotificationService.error("Debe proporcionar una URL de imagen");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      if (isEditing) {
        await promocionServicio.modificarPromocion(
          promocion.getIdPromocion(),
          formData,
          imageOption === "file" ? selectedFile || undefined : undefined,
          imageOption === "url" ? imageUrl : undefined,
        );
        NotificationService.success("Promoción actualizada correctamente");
      } else {
        await promocionServicio.crearPromocion(
          formData,
          imageOption === "file" ? selectedFile || undefined : undefined,
          imageOption === "url" ? imageUrl : undefined,
        );
        NotificationService.success("Promoción creada correctamente");
      }

      onSuccess();
    } catch (error) {
      console.error("Error al guardar promoción:", error);
      NotificationService.error("Error al guardar la promoción");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">{isEditing ? "Editar Promoción" : "Nueva Promoción"}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <CloseIcon />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Columna izquierda */}
            <div className="space-y-4">
              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  className="text-gray-600 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Ingrese el título de la promoción"
                  required
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción *</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  rows={3}
                  className="text-gray-600 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Ingrese la descripción de la promoción"
                  required
                />
              </div>

              {/* Artículo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Artículo *</label>
                <select
                  name="idArticulo"
                  value={formData.idArticulo}
                  onChange={handleInputChange}
                  className="text-gray-600 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required>
                  <option value={0}>Seleccione un artículo</option>
                  {articulos.map((articulo) => (
                    <option
                      key={articulo.idArticulo}
                      value={articulo.idArticulo}>
                      {articulo.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Descuento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descuento (0.01 - 1.00) *</label>
                <input
                  type="number"
                  name="descuento"
                  value={formData.descuento}
                  onChange={handleInputChange}
                  min="0.01"
                  max="1"
                  step="0.01"
                  className="text-gray-600 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="0.15 (15%)"
                  required
                />
              </div>

              {/* Horarios */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Horario Inicio</label>
                  <input
                    type="time"
                    name="horarioInicio"
                    value={formData.horarioInicio}
                    onChange={handleInputChange}
                    className="text-gray-600 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Horario Fin</label>
                  <input
                    type="time"
                    name="horarioFin"
                    value={formData.horarioFin}
                    onChange={handleInputChange}
                    className="text-gray-600 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Estado */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="activo"
                  checked={formData.activo}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">Promoción activa</label>
              </div>
            </div>

            {/* Columna derecha - Imagen */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Imagen de la Promoción *</label>

                {/* Radio buttons para seleccionar tipo de imagen */}
                <div className="flex gap-6 mb-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="imageOption"
                      value="file"
                      checked={imageOption === "file"}
                      onChange={() => handleImageOptionChange("file")}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Subir archivo</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="imageOption"
                      value="url"
                      checked={imageOption === "url"}
                      onChange={() => handleImageOptionChange("url")}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Pegar URL</span>
                  </label>
                </div>

                {/* Upload de archivo */}
                {imageOption === "file" && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer">
                      <UploadIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-sm text-gray-600">Haz clic para seleccionar o arrastra una imagen aquí</p>
                      <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF hasta 10MB</p>
                    </label>
                  </div>
                )}

                {/* Input de URL */}
                {imageOption === "url" && (
                  <div>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                        <LinkIcon fontSize="small" />
                      </span>
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={handleUrlChange}
                        className="text-gray-600 flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="https://ejemplo.com/imagen.jpg"
                      />
                    </div>
                  </div>
                )}

                {/* Preview de imagen */}
                {previewUrl && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Vista previa:</p>
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                      <img
                        src={previewUrl || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                        onError={() => setPreviewUrl("")}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
              {loading ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
