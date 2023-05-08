import Context from '@/core/context'
import { Dictionary } from '@/core/types'
import Joi from 'joi'
import _ from 'lodash'

const extract = (ctx: Context) => {
  const data = _.pick(ctx.params, [
    'store',
    'address',
    'items',
  ])

  const schema = Joi.object()
    .keys({
      store: Joi.string().required(),
      address: Joi.string().required(),
      items: Joi.array().min(1).items(
        Joi.object().keys({
          productCode: Joi.string().required(),
          quantity: Joi.number().min(1).required(),
        }),
        Joi.object().keys({
          productCode: Joi.string().required(),
          case: Joi.number().min(1).required(),
        }),
      )
    })

  const result = schema.validate(data)

  if (result.error) {
    ctx.throw('validation_error', result.error.message)
  }

  return data
}

const create = async (ctx: Context, data: Dictionary) => {
  const doc = await ctx.db.insertOne(
    'orders',
    _.assign(data, {
      status: 'placed',
      dateCreated: new Date,
    })
  )

  return doc
}

const available = (ctx: Context, item: Dictionary, product: Dictionary) => {
  if (_.has(item, 'quantity')) {
    return item.quantity <= product.stock
  }

  if (!_.has(product, 'itemsPerCase')) {
    ctx.throw('missing_data', `Product '${product.productCode}' has no 'itemsPerCase'`)
  }

  return item.case <= (product.stock / product.itemsPerCase)
}

const inStock = async (ctx: Context, data: Dictionary) => {
  const outOfStock: Dictionary[] = []
  const items = _.map(data.items, async (item) => {
    const product = await ctx.db.findOne('products', _.pick(item, 'productCode'))

    if (!product) {
      return ctx.throw('not_found', `Product '${item.productCode}' not found`)
    }

    if (!available(ctx, item, product)) {
      outOfStock.push(_.pick(product, ['productCode', 'name', 'stock']))
    }
  })

  await Promise.all(items)

  return outOfStock
}

export default async (ctx: Context) => {
  const data = extract(ctx)
  const outOfStock = await inStock(ctx, data)

  if (outOfStock.length) {
    return ctx.data(_.assign(data, { outOfStock }))
  }

  const doc = await create(ctx, data)

  return ctx.data(doc)
}
