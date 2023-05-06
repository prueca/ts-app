import { Router } from 'express'
import wrap from '@/util/wrap-handler'
import * as products from '@/handler/products'

const router = Router()

router.get('/:product_code', wrap(products.fetch))
router.post('/', wrap(products.create))
router.post('/update', wrap(products.update))

export default router
