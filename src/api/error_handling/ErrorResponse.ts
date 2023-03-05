export type ErrorResponse = {
  errorMessage: string;
};

export function createErrorResponse(message: string): ErrorResponse {
  return {
    errorMessage: message,
  };
}

export function isErrorResponse(arg: any): arg is ErrorResponse {
  return typeof arg === 'object' && arg !== null && 'errorMessage' in arg;
}
