import { ArticuloManufacturado } from "./ArticuloManufacturado";

export class ImagenManufacturado {
  private idImagenManufacturado: number;
  private url: string;
  private articuloManufacturado: ArticuloManufacturado;

  constructor(idImagenManufacturado: number, url: string, articuloManufacturado: ArticuloManufacturado) {
    this.idImagenManufacturado = idImagenManufacturado;
    this.url = url;
    this.articuloManufacturado = articuloManufacturado;
  }

  public getIdImagenManufacturado(): number {
    return this.idImagenManufacturado;
  }

  public setIdImagenManufacturado(idImagenManufacturado: number): void {
    this.idImagenManufacturado = idImagenManufacturado;
  }
  public getUrl(): string {
    return this.url;
  }
  public setUrl(url: string): void {
    this.url = url;
  }
  public getArticuloManufacturado(): ArticuloManufacturado {
    return this.articuloManufacturado;
  }
  public setArticuloManufacturado(articuloManufacturado: ArticuloManufacturado): void {
    this.articuloManufacturado = articuloManufacturado;
  }
}
