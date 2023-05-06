import Context from '@/util/context'
import Joi from 'joi'
import _ from 'lodash'

const extract = (ctx: Context) => {
  const data = _.pick(ctx.params, [
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
    return ctx.throw('validation_error', result.error.message)
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

const create = async (ctx: Context) => {
  let doc = await ctx.db.findOne('products', {
    productCode: ctx.params.productCode
  })

  if (doc) {
    ctx.throw('conflict', 'Product code already exists')
  }

  doc = await ctx.db.insertOne('products', ctx.params)

  return doc
}

export default async (ctx: Context) => {
  const data = extract(ctx)
  const doc = await create(data)

  ctx.data(doc)
}
