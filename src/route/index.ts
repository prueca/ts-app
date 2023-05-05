import { Router } from 'express'
import products from './products'

const router = Router()

router.get('/ping', (_req, res) => res.data({ ping: 'pong' }))
router.use('/products', products)

export default router
