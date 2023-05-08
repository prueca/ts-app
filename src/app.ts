import 'dotenv/config'
import 'module-alias/register'
import express from 'express'
import cors from 'cors'
import Context from '@/core/context'
import { connect } from '@/core/db'

const app = express()

connect()
app.use(cors())
app.use(express.json())
app.use(Context.attach())

export default app
