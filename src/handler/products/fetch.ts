import Context from '@/util/context'

export default async (ctx: Context) => {
  const doc = await ctx.db.findOne('products', {
    productCode: ctx.params.productCode
  })

  if (!doc) {
    return ctx.throw('not_found')
  }

  ctx.data(doc)
}
