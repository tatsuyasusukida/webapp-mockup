import TodoPrivateAdd from './ui/todo/private-add.vue'
import TodoPrivateEdit from './ui/todo/private-edit.vue'
import TodoPrivateDelete from './ui/todo/private-delete.vue'

class Main {
  async run () {
    const options = this.getVueOptions(window.location.pathname)

    if (options) {
      const vm = new Vue(options)

      if (vm.initialize) {
        await vm.initialize()
      }

      vm.$mount('#main')
    }
  }

  getVueOptions (pathname) {
    if (new RegExp('^/private/todo/add/$').test(pathname)) {
      return TodoPrivateAdd
    } else if (new RegExp('^/private/todo/[0-9]+/edit/$').test(pathname)) {
      return TodoPrivateEdit
    } else if (new RegExp('^/private/todo/[0-9]+/delete/$').test(pathname)) {
      return TodoPrivateDelete
    } else {
      return null
    }
  }
}

async function main () {
  try {
    await new Main().run()
  } catch (err) {
    console.error(err.message)
    console.debug(err.stack)
  }
}

main()
