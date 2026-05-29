/** HTTP transport status codes. This API always returns HTTP 200 regardless of outcome. */
export const HttpStatus = {
  OK: 200,
} as const;

/** Application-level response codes returned in the JSON body's `responseCode` field. */
export const ApiResponseCode = {
  OK:                 200,
  CREATED:            201,
  BAD_REQUEST:        400,
  NOT_FOUND:          404,
  METHOD_NOT_ALLOWED: 405,
} as const;
