import { ArticuloDTO } from "../../../models/dto/ArticuloDTO";
import { ArticuloDTOJson } from "../../../models/interface/ArticuloDTOJson";

export type PaginatedApiArticulo = {
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  content: ArticuloDTOJson[];
  first: boolean;
  last: boolean;
  empty: boolean;
};

export type PaginatedArticulo = {
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  content: ArticuloDTO[];
  first: boolean;
  last: boolean;
  empty: boolean;
};
