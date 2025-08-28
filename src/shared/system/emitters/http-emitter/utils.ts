const CLIENT_ERRORS = new Set([401, 403, 405, 410, 423, 429])
const SERVER_ERRORS = new Set([500, 503])

export const shouldHttpErrorEmit = (code: number): boolean => {
  return CLIENT_ERRORS.has(code) || SERVER_ERRORS.has(code)
}
