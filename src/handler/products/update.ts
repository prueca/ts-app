import Context from '@/core/context'
import { Dictionary } from '@/core/types'
import Joi from 'joi'
import _ from 'lodash'

const extract = (ctx: Context) => {
  const data = _.pick(ctx.params, [
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
    ctx.throw('validation_error')
  }

  _.assign(data, {
    _id: ctx.db.oid(data._id)
  })

  return data
}

const update = async (ctx: Context, data: Dictionary) => {
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

  let doc = await ctx.db.findOne('products', {
    _id: { $ne: data._id },
    productCode: data.productCode
  })

  if (doc) {
    ctx.throw('conflict', 'Product code already exists')
  }

  doc = await ctx.db.findOneAndUpdate('products', filter, update)

  return { ...doc }
}

export default async (ctx: Context) => {
  const data = extract(ctx)
  const doc = await update(ctx, data)

  ctx.data(doc as Dictionary)
}
