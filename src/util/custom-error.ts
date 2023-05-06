const errors = {
  unknown_error: 'Unknown server error',
  validation_error: 'Schema validation error',
  invalid_id: 'Invalid object id',
  not_found: 'Record not found',
}

export default class CustomError extends Error {
  status = 500
  code = 'unknown_error'
  message = 'Unknown server error'

  constructor(code: string, status = 500, message?: string) {
    super()
    this.status = status
    this.code = code
    this.message = message || errors[code as keyof typeof errors]
  }
}