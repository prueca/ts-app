import { Router } from 'express'
import wrap from '@/core/wrap-handler'
import * as products from '@/handler/products'

const router = Router()

router.get('/list/:lastKey?', wrap(products.list))
router.get('/:productCode', wrap(products.fetch))
router.post('/create', wrap(products.create))
router.post('/update', wrap(products.update))
router.post('/restock', wrap(products.restock))
router.post('/archival', wrap(products.archival))

export default router
