export class Imagen {
  private id: number;
  private publicId: string;
  private name: string;
  private url: string;

  constructor(id: number, publicId: string, name: string, url: string) {
    this.id = id;
    this.publicId = publicId;
    this.name = name;
    this.url = url;
  }

  // Getters
  public getId(): number {
    return this.id;
  }

  public getPublicId(): string {
    return this.publicId;
  }

  public getName(): string {
    return this.name;
  }

  public getUrl(): string {
    return this.url;
  }

  // Setters
  public setId(id: number): void {
    this.id = id;
  }

  public setPublicId(publicId: string): void {
    this.publicId = publicId;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public setUrl(url: string): void {
    this.url = url;
  }
}
