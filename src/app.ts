import express from 'express'
import cors from 'cors'
import Context from '@/lib/context'
import routes from './route'
import { connect } from '@/lib/db'

const run = async () => {
    if (process.env.MONGO_URI) {
        await connect()
    }

    const app = express()
    const PORT = process.env.PORT || '8000'

    app.use(cors())
    app.use(express.json())
    app.use(Context.attach())
    app.use(routes)

    app.listen(PORT, () => console.log(`App running on port ${PORT}`))
}

run()
