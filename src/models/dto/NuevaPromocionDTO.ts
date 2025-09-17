import { DetallePromocionDto } from "./DetallePromocionDTO";

export interface NuevaPromocionDto {
  titulo: string;
  descripcion: string;
  precioPromocional: number;
  horarioInicio: string;
  horarioFin: string;
  activo: boolean;
  detalles: DetallePromocionDto[];
  precio?: number; // Opcional si no se usa siempre
  eliminarImagen: boolean;
  
  // Campos para manejo de imagen (solo para frontend)
  file?: File;
  url?: string;
  }