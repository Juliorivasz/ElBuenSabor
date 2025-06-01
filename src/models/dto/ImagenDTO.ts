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
}
