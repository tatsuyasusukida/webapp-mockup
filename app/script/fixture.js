const http = require('http')
const {App} = require('../app')
const model = require('../model')

class Main {
  async run () {
    try {
      await model.sequelize.sync({force: true})

      for (let i = 1; i <= 3; i += 1) {
        await model.todo.create({
          date: new Date(Date.now() - (3 - i) * 24 * 60 * 60 * 1000),
          content: `ここにToDoの内容が入ります${i}`,
        })
      }
    } finally {
      model.sequelize.close()
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
