import { Request, Response } from 'express'
import Joi from 'joi'
import _ from 'lodash'
import { db } from '@/util'

const extract = (req: Request) => {
  const data = _.pick(req.body, [
    'product_code',
    'name',
    'description',
    'unit_price',
    'srp',
    'pcs_per_case',
    'stock',
  ])

  const schema = Joi.object()
    .keys({
      product_code: Joi.string().required(),
      name: Joi.string().required(),
      description: Joi.string().required(),
      unit_price: Joi.number().required(),
      srp: Joi.number().required(),
      pcs_per_case: Joi.number().allow(null),
      stock: Joi.number().required(),
    })

  const result = schema.validate(data)

  if (!result.error) {
    _.assign(result.value, {
      stock_up: [
        {
          quantity: result.value.stock,
          date: new Date
        }
      ]
    })
  }

  return result
}

export default async (req: Request, res: Response) => {
  const { value, error } = extract(req)

  if (error) {
    return res.error('validation_error', error.message)
  }

  const doc = await db.insertOne('products', value)

  res.data(doc)
}
