export class HttpErrorHandler extends Error {
  private static instance: HttpErrorHandler | null = null;
  public status: number;

  private constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }

  public static getInstance(message: string, status: number): HttpErrorHandler {
    if (!HttpErrorHandler.instance) {
      HttpErrorHandler.instance = new HttpErrorHandler(message, status);
    }
    return HttpErrorHandler.instance;
  }
}

export const httpErrorHandler = (status: number, message: string) => {
  throw HttpErrorHandler.getInstance(message, status);
};