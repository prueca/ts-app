import { Router } from 'express'
import wrap from '@/core/wrap-handler'
import ping from '@/handler/ping'
import products from './products'

const router = Router()

router.get('/ping', wrap(ping))
router.use('/products', products)

export default router
