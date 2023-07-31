import 'dotenv/config'
import 'module-alias/register'
import express from 'express'
import cors from 'cors'
import Context from '@/core/context'
import routes from './route'
import { connect } from '@/core/db'

const run = async () => {
  if (!Number(process.env.DB_OFF)) {
    await connect()
  }

  const app = express()
  const PORT = process.env.PORT || '8000'

  app.use(cors())
  app.use(express.json())
  app.use(Context.attach())
  app.use(routes)

  app.listen(PORT, () => console.log(`App running on port ${PORT}!`))
}

run()
