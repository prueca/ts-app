import Context from '@/core/context'
import { Dictionary } from '@/core/types'
import Joi from 'joi'
import _ from 'lodash'

const extract = (ctx: Context) => {
  const data = _.pick(ctx.params, [
    'productCode',
    'archive',
  ])

  const schema = Joi.object()
    .keys({
      productCode: Joi.string().required(),
      archive: Joi.bool().required(),
    })

  const result = schema.validate(data)

  if (result.error) {
    ctx.throw('validation_error', result.error.message)
  }

  return data
}

const archival = async (ctx: Context, data: Dictionary) => {
  let update: Dictionary = {
    $set: {
      archived: data.archive
    }
  }

  if (!data.archive) {
    update = {
      $unset: {
        archived: null
      }
    }
  }

  const doc = await ctx.db.findOneAndUpdate(
    'products',
    _.pick(data, ['productCode']),
    update
  )

  if (!doc) {
    ctx.throw('not_found')
  }

  return doc
}

export default async (ctx: Context) => {
  const data = extract(ctx)
  const doc = await archival(ctx, data)

  ctx.data(doc as Dictionary)
}
