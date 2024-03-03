import { Router } from 'express'
import Context from '@/lib/context'
import ping from '@/handler/ping'

const router = Router()

router.get('/ping', Context.handle(ping))

export default router
