const errors = {
  unknown_error: {
    status: 500,
    message: 'Unknown server error'
  },
  validation_error: {
    status: 400,
    message: 'Schema validation error'
  },
  invalid_id: {
    status: 400,
    message: 'Invalid id'
  },
  not_found: {
    status: 404,
    message: 'Record not found'
  },
  conflict: {
    status: 409,
    message: 'Record already exists'
  },
}

export default class CustomError extends Error {
  status = 500
  code = 'unknown_error'
  message = 'Unknown server error'

  constructor(code: string, message?: string) {
    super()
    this.code = code
    this.status = errors[code as keyof typeof errors].status
    this.message = message || errors[code as keyof typeof errors].message
  }
}