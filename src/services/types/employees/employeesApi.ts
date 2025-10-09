import { EmpleadoResponseDto, IEmpleadoResponseDto } from "../../../models/dto/Empleado/EmpleadoResponseDto";
import { Page } from "../catalog/articulos";

export type PaginatedEmpleadosResponseApi = {
  content: IEmpleadoResponseDto[];
  page: Page
}

export type PaginatedEmpleadosResponse = {
  content: EmpleadoResponseDto[];
  page: Page
}
