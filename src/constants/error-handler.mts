export class HttpErrorHandler extends Error {
  public status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "HttpErrorHandler";
    this.status = status;
  }
}

export const httpErrorHandler = (status: number, message: string) => {
  throw new HttpErrorHandler(message, status);
};
