import 'dotenv/config'
import express, { Request, Response } from 'express'
import { PORT } from './config'

const app = express()

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello')
})

app.listen(PORT, () => console.log(`App running on port ${PORT}!`))