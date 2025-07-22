import { CategoriaExtendidaDto } from "../models/dto/CategoriaExtendidaDto";
import { ImagenDTO } from "../models/dto/ImagenDTO";
import type { NuevaCategoriaDto } from "../models/dto/NuevaCategoriaDto";

const BASE_URL = "https://localhost:8080";

interface CategoriaApiResponse {
  idCategoria: number;
  nombre: string;
  idCategoriaPadre: number;
  imagenModel: {
    url: string;
  } | null;
  margenGanancia?: number;
  fechaBaja?: string | null;
}

export class CategoriaGestionServicio {
  // GET /categoria/lista
  static async listarCategorias(): Promise<CategoriaExtendidaDto[]> {
    try {
      const response = await fetch(`${BASE_URL}/categoria/lista`);
      if (!response.ok) {
        throw new Error(`Error al obtener categorías: ${response.status}`);
      }

      const data: CategoriaApiResponse[] = await response.json();

      // Convertir a CategoriaExtendidaDto
      const categorias = data.map((item) => {
        const imagenDto = item.imagenModel ? new ImagenDTO(item.imagenModel.url) : new ImagenDTO("");
        return new CategoriaExtendidaDto(
          item.idCategoria,
          item.nombre,
          item.idCategoriaPadre || 0,
          imagenDto,
          typeof item.margenGanancia === "number" ? item.margenGanancia : 0,
          item.fechaBaja ? new Date(item.fechaBaja) : null,
        );
      });

      return categorias;
    } catch (error) {
      console.error("Error al listar categorías:", error);
      throw error;
    }
  }

  // POST /categoria/nueva
  static async crearCategoria(nuevaCategoria: NuevaCategoriaDto): Promise<CategoriaExtendidaDto> {
    try {
      const response = await fetch(`${BASE_URL}/categoria/nueva`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevaCategoria.toJSON()),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al crear categoría: ${response.status} - ${errorText}`);
      }

      const data: CategoriaApiResponse = await response.json();
      const imagenDto = data.imagenModel ? new ImagenDTO(data.imagenModel.url) : new ImagenDTO("");

      return new CategoriaExtendidaDto(
        data.idCategoria,
        data.nombre,
        data.idCategoriaPadre || 0,
        imagenDto,
        typeof data.margenGanancia === "number" ? data.margenGanancia : 0,
        data.fechaBaja ? new Date(data.fechaBaja) : null,
      );
    } catch (error) {
      console.error("Error al crear categoría:", error);
      throw error;
    }
  }

  // PUT /categoria/actualizar (asumiendo que existe este endpoint para edición)
  static async actualizarCategoria(idCategoria: number, categoria: NuevaCategoriaDto): Promise<CategoriaExtendidaDto> {
    try {
      console.log("Actualizando categoría:", idCategoria, categoria.toJSON());

      const response = await fetch(`${BASE_URL}/categoria/actualizar/${idCategoria}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoria.toJSON()),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error en actualización:", response.status, errorText);
        throw new Error(`Error al actualizar categoría: ${response.status} - ${errorText}`);
      }

      const data: CategoriaApiResponse = await response.json();
      console.log("Respuesta de actualización:", data);

      const imagenDto = data.imagenModel ? new ImagenDTO(data.imagenModel.url) : new ImagenDTO("");

      return new CategoriaExtendidaDto(
        data.idCategoria,
        data.nombre,
        data.idCategoriaPadre || 0,
        imagenDto,
        typeof data.margenGanancia === "number" ? data.margenGanancia : 0,
        data.fechaBaja ? new Date(data.fechaBaja) : null,
      );
    } catch (error) {
      console.error("Error al actualizar categoría:", error);
      throw error;
    }
  }

  // POST /categoria/altaBaja/{idCategoria}
  static async toggleEstadoCategoria(idCategoria: number): Promise<void> {
    try {
      console.log("Cambiando estado de categoría:", idCategoria);

      const response = await fetch(`${BASE_URL}/categoria/altaBaja/${idCategoria}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Respuesta toggle estado:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error en toggle estado:", response.status, errorText);
        throw new Error(`Error al cambiar estado de categoría: ${response.status} - ${errorText}`);
      }

      console.log("Estado cambiado exitosamente");
    } catch (error) {
      console.error("Error al cambiar estado de categoría:", error);
      throw error;
    }
  }

  // GET /categoria/obtenerNombre/{idCategoria}
  static async obtenerNombreCategoria(idCategoria: number): Promise<string> {
    try {
      const response = await fetch(`${BASE_URL}/categoria/obtenerNombre/${idCategoria}`);
      if (!response.ok) {
        throw new Error(`Error al obtener nombre de categoría: ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      console.error("Error al obtener nombre de categoría:", error);
      throw error;
    }
  }
}
