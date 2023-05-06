import { Request, Response } from 'express'
import { RequestHandler } from '@/type-def'
import CustomError from './custom-error'

export default (handler: RequestHandler) => {
  const wrapper = async (req: Request, res: Response) => {
    try {
      await handler(req, res)
    } catch (error) {
      res.error(error as CustomError)
    }
  }

  return wrapper
}