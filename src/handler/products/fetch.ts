import Context from '@/util/context'
import { KeyVal } from '@/type-def'

export default async (ctx: Context) => {
  const doc = await ctx.db.findOne('products', {
    productCode: ctx.params.productCode
  })

  if (!doc) {
    ctx.throw('not_found')
  }

  ctx.data(doc as KeyVal)
}
