import { Request, Response } from 'express'
import { RequestHandler } from '@/type-def'

export default (handler: RequestHandler) => {
  const wrapper = async (req: Request, res: Response) => {
    try {
      await handler(req, res)
    } catch (error) {
      res.status(500).error(error as Error)
    }
  }

  return wrapper
}