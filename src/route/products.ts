import { Router } from 'express'
import wrap from '@/core/wrap-handler'
import * as products from '@/handler/products'

const router = Router()

router.get('/:productCode', wrap(products.fetch))
router.post('/', wrap(products.create))
router.post('/update', wrap(products.update))
router.post('/restock', wrap(products.restock))

export default router
