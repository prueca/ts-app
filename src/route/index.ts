import { Router } from 'express'

const router = Router()

router.get('/ping', (_req, res) => res.data({ ping: 'pong' }))

export default router
