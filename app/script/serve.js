const http = require('http')
const {App} = require('../app')

class Main {
  async run () {
    const server = http.createServer() // <1>
    const app = new App() // <2>

    server.on('request', app.onRequest.bind(app)) // <3>
    server.on('error', app.onError.bind(app)) // <4>
    server.listen(process.env.PORT || '3000') // <5>
  }
}

if (require.main == module) {
  main()
}

async function main () {
  try {
    await new Main().run()
  } catch (err) {
    console.error(err.message)
    console.error(err.stack)
  }
}
