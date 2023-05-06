import Context from '@/util/context'

export default async (ctx: Context) => {
  ctx.data({ ping: 'pong' })
}