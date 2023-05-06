import { Request, Response } from 'express'
import Joi from 'joi'
import _ from 'lodash'
import { CustomError, db } from '@/util'
import { JSON } from '@/type-def'

const extract = (req: Request) => {
  const data = _.pick(req.body, [
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
      productCode: Joi.string().required(),
      name: Joi.string().required(),
      description: Joi.string().required(),
      unitPrice: Joi.number().required(),
      srp: Joi.number().required(),
      itemsPerCase: Joi.number().allow(null),
      stock: Joi.number().required(),
    })

  const result = schema.validate(data)

  if (result.error) {
    throw new CustomError(
      'validation_error',
      400,
      result.error.message
    )
  }

  _.assign(result.value, {
    stockUp: [
      {
        pcs: result.value.stock,
        date: new Date
      }
    ]
  })

  return result.value
}

const create = async (data: JSON) => {
  let doc = await db.findOne('products', {
    productCode: data.productCode
  })

  if (doc) {
    throw new CustomError(
      'conflict',
      409,
      'Product code already exists'
    )
  }

  doc = await db.insertOne('products', data)

  return doc
}

export default async (req: Request, res: Response) => {
  const data = extract(req)
  const doc = await create(data)

  res.data(doc)
}
