import serverless from 'serverless-http'
import app from '@/app'
import routes from '@/route'

app.use('/.netlify/functions/api', routes)

export const handler = serverless(app)