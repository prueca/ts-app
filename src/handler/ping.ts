import Context from '@/lib/context'

export default async (ctx: Context) => {
    ctx.data({ ping: 'pong' })
}
