import { Request, Response, NextFunction } from 'express'
import Context from './context'

export default async (req: Request, res: Response, next: NextFunction) => {
  Context.bind(req, res)

  next()
}
