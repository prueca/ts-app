const errors = {
    unknown_error: 'Unknown server error',
    invalid_data: 'Invalid data',
    not_found: 'Record not found',
    conflict: 'Record already exists',
}

export default class Exception {
    code = 'unknown_error'
    message = errors[this.code as keyof typeof errors]

    constructor(code: string, message?: string) {
        this.code = code
        this.message = message || errors[code as keyof typeof errors]
    }
}
