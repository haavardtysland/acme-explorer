export type ErrorResponse = {
  errorMessage: string;
  code: number;
};

export function createErrorResponse(
  message: string,
  code: number = 500
): ErrorResponse {
  return {
    errorMessage: message,
    code: code,
  };
}

export function isErrorResponse(arg: any): arg is ErrorResponse {
  return typeof arg === 'object' && arg !== null && 'errorMessage' in arg;
}
