import { Request, Response, NextFunction } from 'express'
import _ from 'lodash'
import { JSON } from '@/type-def'
import { CustomError } from '@/util'

export default (_req: Request, res: Response, next: NextFunction) => {
  const data = (data: JSON, filter?: string[]) => {
    if (filter) {
      return res.json({
        data: _.pick(data, filter)
      })
    }

    return res.json({ data })
  }

  const error = (error: CustomError | Error) => {
    const status = _.get(error, 'status', 500)
    const code = _.get(error, 'code', 'unknown_error')
    const message = _.get(error, 'message', '')

    return res.status(status)
      .json({
        error: {
          code: code,
          message: message
        }
      })
  }

  _.assign(res, { data, error })

  next()
}
