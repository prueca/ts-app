import { Request, Response, NextFunction } from 'express'
import _ from 'lodash'
import { JSON } from '@/type-def'
import { errors } from '@/util'

export default (_req: Request, res: Response, next: NextFunction) => {
  const data = (data: JSON, filter?: string[]) => {
    if (filter) {
      return res.json({
        data: _.pick(data, filter)
      })
    }

    return res.json({ data })
  }

  const error = (error: string | Error, message?: string) => {
    if (error instanceof Error) {
      return res.json({
        error: {
          code: 'unknown_error',
          message: error.message || errors.unknown_error
        }
      })
    }

    return res.json({
      error: {
        code: error,
        message: message || errors[error as keyof typeof errors]
      }
    })
  }

  _.assign(res, { data, error })

  next()
}
