const http = require('http')
const {App} = require('../app')
const model = require('../model')

class Main {
  async run () {
    try {
      await model.sequelize.sync({force: true}) // <1>

      for (let i = 1; i <= 3; i += 1) {
        const second = 1000
        const minute = 60 * second
        const hour = 60 * minute
        const day = 24 * hour

        await model.todo.create({
          date: new Date(Date.now() - (3 - i) * day),
          content: `ここにToDoの内容が入ります${i}`,
        }) // <2>
      }
    } finally {
      model.sequelize.close() // <3>
    }
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
