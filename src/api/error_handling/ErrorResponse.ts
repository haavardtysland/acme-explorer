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

export function isErrorResponse(obj: any): obj is ErrorResponse {
  return (
    typeof obj == 'object' &&
    obj !== null &&
    'errorMessage' in obj &&
    'code' in obj &&
    typeof obj.errorMessage === 'string' &&
    typeof obj.code === 'number'
  );
}
