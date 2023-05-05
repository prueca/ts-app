import 'dotenv/config'
import 'module-alias/register'
import express from 'express'
import cors from 'cors'
import response from './middleware/response'
import routes from './route'
import { connect } from '@/util/db'

(async () => {
    await connect()

    const app = express()
    const PORT = process.env.PORT || '8000'

    app.use(cors())
    app.use(express.json())
    app.use(response)
    app.use(routes)

    app.listen(PORT, () => console.log(`App running on port ${PORT}!`))
})()