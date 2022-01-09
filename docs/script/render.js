const path = require('path')
const puppeteer = require('puppeteer')
const fsPromises = require('fs/promises')

class Main {
  async run () {
    const browser = await puppeteer.launch()

    try {
      const page = await browser.newPage()
      const tasks = [
        ['/private/todo/', 'todo/private-index.png'],
        ['/private/todo/add/', 'todo/private-add.png'],
        ['/private/todo/add/finish/', 'todo/private-add-finish.png'],
        ['/private/todo/1/', 'todo/private-view.png'],
        ['/private/todo/1/edit/', 'todo/private-edit.png'],
        ['/private/todo/1/edit/finish/', 'todo/private-edit-finish.png'],
        ['/private/todo/1/delete/', 'todo/private-delete.png'],
        ['/private/todo/delete/finish/', 'todo/private-delete-finish.png'],
      ]

      await page.setViewport({width: 800, height: 1050, deviceScaleFactor: 2})

      for (const [pathname, filename] of tasks) {
        const url = 'http://127.0.0.1:3000' + pathname
        const destination = path.join(__dirname, '../dist/img', filename)

        await fsPromises.mkdir(path.dirname(destination), {recursive: true})
        await page.goto(url)
        await page.screenshot({path: destination})
      }
    } finally {
      await browser.close()
    }
  }
}

if (require.main === module) {
  main()
}

async function main () {
  try {
    await new Main().run()
  } catch (err) {
    console.error(err.message)
    console.debug(err.stack)
  }
}
