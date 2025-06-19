export class ImagenArticulo {
  private idImagen: number;
  private url: string;

  constructor(idImagen: number, url: string) {
    this.idImagen = idImagen;
    this.url = url;
  }

  public getIdImagen(): number {
    return this.idImagen;
  }

  public getUrl(): string {
    return this.url;
  }

  public setIdImagen(idImagen: number): void {
    this.idImagen = idImagen;
  }
  public setUrl(url: string): void {
    this.url = url;
  }
}
