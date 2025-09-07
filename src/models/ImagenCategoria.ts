export class ImagenCategoria {
  private idCategoria: number;
  private url: string;

  constructor(idCategoria: number, url: string) {
    this.idCategoria = idCategoria;
    this.url = url;
  }

  public getIdCategoria(): number {
    return this.idCategoria;
  }

  public getUrl(): string {
    return this.url;
  }

  public setIdCategoria(idCategoria: number): void {
    this.idCategoria = idCategoria;
  }

  public setUrl(url: string): void {
    this.url = url;
  }
}
