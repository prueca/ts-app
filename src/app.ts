import 'dotenv/config'
import 'module-alias/register'
import express from 'express'
import cors from 'cors'
import routes from './route'
import context from '@/middleware/bind-context'
import { connect } from '@/util/db'

(async () => {
    await connect()

    const app = express()
    const PORT = process.env.PORT || '8000'

    app.use(cors())
    app.use(express.json())
    app.use(context)
    app.use(routes)

    app.listen(PORT, () => console.log(`App running on port ${PORT}!`))
})()