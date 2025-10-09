export class Page {

  size: number;
  number: number;
  totalElements: number;
  totalPages: number;

  constructor(size: number,
    number: number,
    totalElements: number,
    totalPages: number) {
    
    this.size = size;
    this.number = number;
    this.totalElements = totalElements;
    this.totalPages = totalPages;
    }

}
export class PageResponse<T> {
  content: T[];
  page: Page;

  constructor(
    content: T[],
    page: Page
  ) {
    this.content = content;
    this.page = page;
  }
}
