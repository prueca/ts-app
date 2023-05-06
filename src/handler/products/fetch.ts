import Context from '@/core/context'
import { Dictionary } from '@/core/types'

export default async (ctx: Context) => {
  const doc = await ctx.db.findOne('products', {
    productCode: ctx.params.productCode
  })

  if (!doc) {
    ctx.throw('not_found')
  }

  ctx.data(doc as Dictionary)
}
