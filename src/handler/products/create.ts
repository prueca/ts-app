import { Request, Response } from 'express'

/**
 * Product
 * _id: ObjectId
 * name: string
 * description: string
 * unit_price: number
 * case_price: number
 * case_quantity: number
 * stock: [
 *  {
 *    quantity: number
 *    user: User._id
 *    date: Date
 *  }
 * ]
 */

export default async (_req: Request, res: Response) => {
  res.data({ success: true })
}
