import { Request, Response } from 'express'
import { db } from '@/util'

export default async (req: Request, res: Response) => {
  const doc = await db.findOne('products', {
    product_code: req.params.code
  })

  if (!doc) {
    return res.error('not_found')
  }

  res.data(doc)
}
