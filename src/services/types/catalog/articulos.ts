import { ArticuloDTO } from "../../../models/dto/ArticuloDTO";
import { ArticuloDTOJson } from "../../../models/interface/ArticuloDTOJson";
export type Page = {
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type PaginatedApiArticulo = {
  page: Page;
  content: ArticuloDTOJson[];
  first: boolean;
  last: boolean;
  empty: boolean;
};

export type PaginatedArticulo = {
  page: Page;
  content: ArticuloDTO[];
  first: boolean;
  last: boolean;
  empty: boolean;
};
