import { Request, Response } from 'express'
import { CustomError, db } from '@/util'

export default async (req: Request, res: Response) => {
  const doc = await db.findOne('products', {
    productCode: req.params.productCode
  })

  if (!doc) {
    throw new CustomError('not_found')
  }

  res.data(doc)
}
