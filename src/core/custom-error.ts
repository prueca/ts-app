const errors = {
  unknown_error: 'Unknown server error',
  validation_error: 'Schema validation error',
  invalid_id: 'Invalid id',
  not_found: 'Record not found',
  conflict: 'Record already exists',
  missing_data: 'Missing data',
}

export default class CustomError extends Error {
  code = 'unknown_error'
  message = 'Unknown server error'

  constructor(code: string, message?: string) {
    super()
    this.code = code
    this.message = message || errors[code as keyof typeof errors]
  }
}