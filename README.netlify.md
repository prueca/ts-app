### Install netlify-cli and follow the steps

```
npm i -g netlify-cli
```

### Create netlify functions. By default, netflify will create '<project root>/netlify/functions/'.

```
// netlify/functions/<function name>.ts

import serverless from 'serverless-http'
import app from '@/app'

export const handler = serverless(app)
```

### Update netlify.toml with the functions directory

```
[build]
  command = "npm run build"
  functions = "<function directory>"
  publish = "."
```

Add script in package.json

```
"ntl": "netlify functions:serve"
// or
"ntl:dev": "netlify dev"
```

Run script the script to access function

```
npm run ntl
// sample url
http://localhost:9999/.netlify/functions/api/ping
```