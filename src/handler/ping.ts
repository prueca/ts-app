import Context from '@/core/context'

export default async (ctx: Context) => {
  ctx.data({ ping: 'pong' })
}
