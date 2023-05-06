import Context from '@/core/context'
import { Dictionary } from '@/core/types'
import Joi from 'joi'
import _ from 'lodash'

const extract = (ctx: Context) => {
  const data = _.pick(ctx.params, [
    'productCode',
    'items',
  ])

  const schema = Joi.object()
    .keys({
      productCode: Joi.string().required(),
      items: Joi.number().required(),
    })

  const result = schema.validate(data)

  if (result.error) {
    ctx.throw('validation_error', result.error.message)
  }

  return result.value
}

const restock = async (ctx: Context, data: Dictionary) => {
  const update = {
    $inc: {
      stock: data.items
    },
    $push: {
      stockUp: {
        items: data.items,
        date: new Date
      }
    }
  }

  const doc = await ctx.db.findOneAndUpdate(
    'products',
    _.pick(data, ['productCode']),
    update,
  )

  if (!doc) {
    ctx.throw('not_found')
  }

  return doc
}

export default async (ctx: Context) => {
  const data = extract(ctx)
  const doc = await restock(ctx, data)

  ctx.data(doc as Dictionary)
}
