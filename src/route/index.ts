import { Router } from 'express'
import wrap from '@/core/wrap-handler'
import ping from '@/handler/ping'

const router = Router()

router.get('/ping', wrap(ping))

export default router
