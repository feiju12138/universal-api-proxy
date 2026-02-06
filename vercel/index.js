{
  "version": 2,
  "name": "universal-api-proxy",
  "public": true,
  "routes": [
    {
      "src": "/",
      "dest": "/vercel/index.js"
    },
    {
      "src": "/api",
      "dest": "/vercel/index.js"
    }
  ],
  "build": {
    "env": {
      "NODE_ENV": "production"
    }
  },
  "functions": {
    "vercel/index.js": {
      "runtime": "@vercel/node",
      "maxDuration": 10
    }
  }
}
