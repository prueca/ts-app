import { Request } from 'express'
import { RequestHandler } from '@/type-def'
import CustomError from './custom-error'
import Context from './context'

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