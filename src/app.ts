import express from 'express'
import 'dotenv/config'
import { PORT } from './config/core'

const app = express()

app.get('/', (_req, res) => {
  res.send('Hello')
})

app.listen(PORT, () => console.log(`App running on port ${PORT}!`))