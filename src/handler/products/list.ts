import Context from '@/core/context'
import { Dictionary } from '@/core/types'
import Joi from 'joi'
import _ from 'lodash'

const PAGE_LIMIT = 50

const extract = (ctx: Context) => {
  const data = _.pick(ctx.params, ['lastKey'])
  const schema = Joi.object()
    .keys({ lastKey: Joi.string() })

  const result = schema.validate(data)

  if (result.error) {
    ctx.throw('validation_error', result.error.message)
  }

  if (data.lastKey) {
    try {
      _.assign(data, {
        lastKey: ctx.db.oid(data.lastKey)
      })
    } catch (error) {
      ctx.throw('invalid_id')
    }
  }

  return data
}

const list = async (ctx: Context, data: Dictionary) => {
  const opts = { limit: PAGE_LIMIT }
  const query = {}

  if (data.lastKey) {
    _.assign(query, {
      _id: { $gt: data.lastKey }
    })
  }

  const docs = await ctx.db.find('products', query, opts)

  return docs
}

export default async (ctx: Context) => {
  const data = extract(ctx)
  const docs = await list(ctx, data)
  const response = { products: docs }

  if (docs.length) {
    _.assign(response, {
      lastKey: _.get(_.last(docs), ['_id'], null)
    })
  }

  ctx.data(response)
}
