import { Router } from 'express'
import wrapHandler from '@/util/wrap-handler'
import * as products from '@/handler/products'

const router = Router()

router.post('/', wrapHandler(products.create))
router.post('/update', wrapHandler(products.update))

export default router
