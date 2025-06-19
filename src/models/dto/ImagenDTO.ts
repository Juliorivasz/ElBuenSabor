import { ImagenDTOJson } from "../interface/ImagenDTOJson";

export class ImagenDTO {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  public getUrl() {
    return this.url;
  }

  public setUrl(newURl: string) {
    this.url = newURl;
  }
  public toJSON(): ImagenDTOJson {
    return {
      url: this.url,
    };
  }
  public static fromJSON(json: ImagenDTOJson | null): ImagenDTO | null {
    if (json === null) {
      return null;
    }
    return new ImagenDTO(json.url);
  }
}
