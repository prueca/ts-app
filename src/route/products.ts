import { Router } from 'express'
import Context from '@/core/context'
import * as products from '@/handler/products'

const router = Router()

router.get('/list/:lastKey?', Context.handle(products.list))
router.get('/:productCode', Context.handle(products.fetch))
router.post('/create', Context.handle(products.create))
router.post('/update', Context.handle(products.update))
router.post('/restock', Context.handle(products.restock))
router.post('/archival', Context.handle(products.archival))

export default router
