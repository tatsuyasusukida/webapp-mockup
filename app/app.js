const path = require('path')
const morgan = require('morgan')
const express = require('express')
const model = require('./model') // <1>
const {Op} = model.Sequelize // <2>

class App {
  constructor () {
    this.router = express()

    this.router.set('strict routing', true)
    this.router.set('views', path.join(__dirname, 'view'))
    this.router.set('view engine', 'pug')

    this.router.use(morgan('dev'))

    this.router.get('/', (req, res) => res.redirect('./private/todo/'))
    this.router.get('/private/todo/', this.onRequestPrivateTodoIndex.bind(this)) // <3>
    this.router.get('/private/todo/', (req, res) => res.render('todo/private-index'))
    this.router.get('/private/todo/add/', (req, res) => res.render('todo/private-add'))
    this.router.get('/private/todo/add/finish/', (req, res) => res.render('todo/private-add-finish'))
    this.router.use('/private/todo/:todoId([0-9]+)/', this.onRequestFindTodo.bind(this)) // <4>
    this.router.get('/private/todo/:todoId([0-9]+)/', this.onRequestPrivateTodoView.bind(this)) // <5>
    this.router.get('/private/todo/:todoId([0-9]+)/', (req, res) => res.render('todo/private-view'))
    this.router.get('/private/todo/:todoId([0-9]+)/edit/', (req, res) => res.render('todo/private-edit'))
    this.router.get('/private/todo/:todoId([0-9]+)/edit/finish/', (req, res) => res.render('todo/private-edit-finish'))
    this.router.get('/private/todo/:todoId([0-9]+)/delete/', (req, res) => res.render('todo/private-delete'))
    this.router.get('/private/todo/delete/finish/', (req, res) => res.render('todo/private-delete-finish'))

    this.router.use((req, res) => {
      res.status(404).end()
    })

    this.router.use((err, req, res, next) => {
      res.status(500).end()
      this.onError(err)
    })
  }

  onRequest (req, res) {
    this.router(req, res)
  }

  async onRequestFindTodo (req, res, next) { // <6>
    try {
      const todo = await model.todo.findOne({
        where: {
          id: {[Op.eq]: req.params.todoId},
        },
      })

      if (!todo) {
        res.status(404).end()
        return
      }

      req.locals = req.locals || {}
      req.locals.todo = todo

      next()
    } catch (err) {
      next(err)
    }
  }

  async onRequestPrivateTodoIndex (req, res, next) { // <7>
    try {
      const todos = await model.todo.findAll({
        order: [['date', 'desc']],
      })

      res.locals.todos = todos

      next()
    } catch (err) {
      next(err)
    }
  }

  async onRequestPrivateTodoView (req, res, next) { // <8>
    try {
      const {todo} = req.locals
      const {date} = todo

      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const dayOfTheWeek = '日月火水木金土'[date.getDay()]
      const hour = date.getHours()
      const minute = date.getMinutes()
      const second = date.getSeconds()
      const dateText = [
        `${year}年${month}月${day}日(${dayOfTheWeek}曜日)`,
        `${hour}時${minute}分${second}秒`,
      ].join(' ')

      res.locals.todo = {
        id: todo.id,
        content: todo.content,
        contentLines: todo.content.split('\n'),
        date: todo.date,
        dateText: dateText,
      }

      next()
    } catch (err) {
      next(err)
    }
  }

  onError (err) {
    console.error(err.message)
    console.debug(err.stack)
  }
}

module.exports.App = App
