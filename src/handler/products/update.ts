import { Request, Response } from 'express'
import Joi from 'joi'
import _ from 'lodash'
import { CustomError, db } from '@/util'
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
    throw new CustomError('validation_error', 400)
  }

  try {
    _.assign(result.value, {
      _id: db.oid(result.value._id)
    })
  } catch (error) {
    throw new CustomError('invalid_id', 400)
  }

  return result.value
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
  const data = extract(req)
  const doc = await update(data)

  res.data(doc)
}
