import { Router } from 'express'
import Context from '@/core/context'
import ping from '@/handler/ping'
import products from './products'
import orders from './orders'

const router = Router()

router.get('/ping', Context.handle(ping))
router.use('/products', products)
router.use('/orders', orders)

export default router
