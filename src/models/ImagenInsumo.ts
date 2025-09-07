import { ArticuloInsumo } from "./ArticuloInsumo";

export class ImagenInsumo {
  private idImagenInsumo: number;
  private url: string;
  private articuloInsumo: ArticuloInsumo;

  constructor(idImagenInsumo: number, url: string, articuloInsumo: ArticuloInsumo) {
    this.idImagenInsumo = idImagenInsumo;
    this.url = url;
    this.articuloInsumo = articuloInsumo;
  }
  getIdImagenInsumo(): number {
    return this.idImagenInsumo;
  }
  getUrl(): string {
    return this.url;
  }
  getArticuloInsumo(): ArticuloInsumo {
    return this.articuloInsumo;
  }
  setIdImagenInsumo(idImagenInsumo: number): void {
    this.idImagenInsumo = idImagenInsumo;
  }
  setUrl(url: string): void {
    this.url = url;
  }
  setArticuloInsumo(articuloInsumo: ArticuloInsumo): void {
    this.articuloInsumo = articuloInsumo;
  }
}
