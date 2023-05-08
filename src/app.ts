import 'dotenv/config'
import 'module-alias/register'
import express from 'express'
import cors from 'cors'
import routes from './route'
import Context from '@/core/context'
import { connect } from '@/core/db'

const app = express()

const start = async () => {
    await connect()
    app.use(cors())
    app.use(express.json())
    app.use(Context.attach())
    app.use('/.netlify/functions/api', routes)
}

start()
export default app