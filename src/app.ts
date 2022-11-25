import 'dotenv/config'
import express, { Request, Response } from 'express'

const app = express()
const PORT = process.env.PORT || '3000'

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello')
})

app.listen(PORT, () => console.log(`App running on port ${PORT}!`))