import { Request, Response } from 'express'
import { CustomError, db } from '@/util'

export default async (req: Request, res: Response) => {
  const doc = await db.findOne('products', {
    product_code: req.params.code
  })

  if (!doc) {
    throw new CustomError('not_found', 404)
  }

  res.data(doc)
}
