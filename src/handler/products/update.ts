import { Request, Response } from 'express'
import Joi from 'joi'
import _ from 'lodash'
import { db } from '@/util'
import { JSON } from '@/type-def'

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

const update = async (data: JSON) => {
  const filter = _.pick(data, ['_id'])
  const update = {
    $set: _.pick(data, [
      'product_code',
      'name',
      'description',
      'unit_price',
      'srp',
      'pcs_per_case',
      'stock',
    ])
  }
  const doc = await db.findOneAndUpdate('products', filter, update)

  return { ...doc }
}

export default async (req: Request, res: Response) => {
  const { value, error } = extract(req)

  if (error) {
    return res.error('validation_error', error.message)
  }

  const doc = await update(value)

  res.data(doc)
}
