import { Request, Response } from 'express'
import Joi from 'joi'
import _ from 'lodash'
import { CustomError, db } from '@/util'
import { JSON } from '@/type-def'

const extract = (req: Request) => {
  const data = _.pick(req.body, [
    '_id',
    'productCode',
    'name',
    'description',
    'unitPrice',
    'srp',
    'itemsPerCase',
    'stock',
  ])

  const schema = Joi.object()
    .keys({
      _id: Joi.any().required(),
      productCode: Joi.string(),
      name: Joi.string(),
      description: Joi.string(),
      unitPrice: Joi.number(),
      srp: Joi.number(),
      itemsPerCase: Joi.number().allow(null),
      stock: Joi.number(),
    })

  const result = schema.validate(data)

  if (result.error) {
    throw new CustomError('validation_error')
  }

  try {
    _.assign(result.value, {
      _id: db.oid(result.value._id)
    })
  } catch (error) {
    throw new CustomError('invalid_id')
  }

  return result.value
}

const update = async (data: JSON) => {
  const filter = _.pick(data, ['_id'])
  const update = {
    $set: _.pick(data, [
      'productCode',
      'name',
      'description',
      'unitPrice',
      'srp',
      'itemsPerCase',
      'stock',
    ])
  }

  let doc = await db.findOne('products', {
    _id: { $ne: data._id },
    productCode: data.productCode
  })

  if (doc) {
    throw new CustomError('conflict', 'Product code already exists')
  }

  doc = await db.findOneAndUpdate('products', filter, update)

  return { ...doc }
}

export default async (req: Request, res: Response) => {
  const data = extract(req)
  const doc = await update(data)

  res.data(doc)
}
