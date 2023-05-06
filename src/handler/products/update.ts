import Context from '@/util/context'
import { KeyVal } from '@/type-def'
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
    return ctx.throw('validation_error')
  }

  try {
    _.assign(result.value, {
      _id: ctx.db.oid(result.value._id)
    })
  } catch (error) {
    return ctx.throw('invalid_id')
  }

  return result.value
}

const update = async (ctx: Context, data: KeyVal) => {
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
    return ctx.throw('conflict', 'Product code already exists')
  }

  doc = await ctx.db.findOneAndUpdate('products', filter, update)

  return { ...doc }
}

export default async (ctx: Context) => {
  const data = extract(ctx)
  const doc = await update(ctx, data)

  ctx.data(doc as KeyVal)
}
