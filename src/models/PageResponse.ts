export class PageResponse<T> {
  content: T[];
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;

  constructor(
    content: T[],
    size: number,
    number: number,
    totalElements: number,
    totalPages: number
  ) {
    this.content = content;
    this.size = size;
    this.number = number;
    this.totalElements = totalElements;
    this.totalPages = totalPages;
  }
}
