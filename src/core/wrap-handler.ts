import { Request } from 'express'
import Context from '@/core/context'
import CustomError from './custom-error'
import { RequestHandler } from './types'

export default (handler: RequestHandler) => {
  const wrapper = async (req: Request) => {
    const ctx = Context.get(req)

    try {
      await handler(ctx)
    } catch (error) {
      ctx.error(error as CustomError)
    }
  }

  return wrapper
}