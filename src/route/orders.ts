import { Router } from 'express'
import Context from '@/core/context'
import * as orders from '@/handler/orders'

const router = Router()

router.post('/', Context.handle(orders.create))

export default router
