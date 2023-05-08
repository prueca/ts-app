import app from '@/app'
import routes from './route'

const PORT = process.env.PORT || '8000'

app.use(routes)
app.listen(PORT || '8000', () => {
  console.log(`App running on port ${PORT}!`)
})
