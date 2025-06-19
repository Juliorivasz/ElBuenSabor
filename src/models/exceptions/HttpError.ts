export class HTTPError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = "HTTPError";
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, HTTPError.prototype);
  }
}
