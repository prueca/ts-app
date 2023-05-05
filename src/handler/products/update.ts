import { Request, Response } from 'express'
import Joi from 'joi'
import _ from 'lodash'
import { db } from '@/util'

const extract = (req: Request) => {
  const data = _.pick(req.body, [
    '_id',
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
      _id: Joi.any().required(),
      product_code: Joi.string(),
      name: Joi.string(),
      description: Joi.string(),
      unit_price: Joi.number(),
      srp: Joi.number(),
      pcs_per_case: Joi.number().allow(null),
      stock: Joi.number(),
    })

  const result = schema.validate(data)

  if (result.error) {
    return result
  }

  _.assign(result.value, {
    _id: db.oid(result.value._id)
  })

  return result
}

export default async (req: Request, res: Response) => {
  const { value, error } = extract(req)

  if (error) {
    return res.error('validation_error', error.message)
  }

  const filter = _.pick(value, ['_id'])
  const update = {
    $set: _.pick(value, [
      'product_code',
      'name',
      'description',
      'unit_price',
      'srp',
      'pcs_per_case',
      'stock',
    ])
  }
  const result = await db.findOneAndUpdate('products', filter, update)

  res.data({ ...result.value })
}
