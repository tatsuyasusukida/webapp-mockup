const path = require('path')
const morgan = require('morgan')
const express = require('express')
const nocache = require('nocache') // <1>
const model = require('./model')
const {Op} = model.Sequelize

class App {
  constructor () {
    this.router = express()

    this.router.set('strict routing', true)
    this.router.set('views', path.join(__dirname, 'view'))
    this.router.set('view engine', 'pug')

    this.router.use(morgan('dev'))

    this.router.get('/', (req, res) => res.redirect('./private/todo/'))
    this.router.get('/private/todo/', this.onRequestPrivateTodoIndex.bind(this))
    this.router.get('/private/todo/', (req, res) => res.render('todo/private-index'))
    this.router.get('/private/todo/add/', (req, res) => res.render('todo/private-add'))
    this.router.get('/private/todo/add/finish/', this.onRequestPrivateTodoAddFinish.bind(this)) // <2>
    this.router.get('/private/todo/add/finish/', (req, res) => res.render('todo/private-add-finish'))
    this.router.use('/private/todo/:todoId([0-9]+)/', this.onRequestFindTodo.bind(this))
    this.router.get('/private/todo/:todoId([0-9]+)/', this.onRequestPrivateTodoView.bind(this))
    this.router.get('/private/todo/:todoId([0-9]+)/', (req, res) => res.render('todo/private-view'))
    this.router.get('/private/todo/:todoId([0-9]+)/edit/', (req, res) => res.render('todo/private-edit'))
    this.router.get('/private/todo/:todoId([0-9]+)/edit/finish/', (req, res) => res.render('todo/private-edit-finish'))
    this.router.get('/private/todo/:todoId([0-9]+)/delete/', (req, res) => res.render('todo/private-delete'))
    this.router.get('/private/todo/delete/finish/', (req, res) => res.render('todo/private-delete-finish'))

    this.router.use('/api/v1/', nocache()) // <3>
    this.router.use('/api/v1/', express.json())
    this.router.get('/api/v1/private/todo/add/initialize', this.onRequestApiV1PrivateTodoAddInitialize.bind(this))
    this.router.post('/api/v1/private/todo/add/validate', this.onRequestApiV1PrivateTodoAddValidate.bind(this))
    this.router.post('/api/v1/private/todo/add/submit', this.onRequestApiV1PrivateTodoAddSubmit.bind(this))
    this.router.use('/api/v1/private/todo/:todoId([0-9]+)/', this.onRequestFindTodo.bind(this))
    this.router.get('/api/v1/private/todo/:todoId([0-9]+)/edit/initialize', this.onRequestApiV1PrivateTodoEditInitialize.bind(this))
    this.router.put('/api/v1/private/todo/:todoId([0-9]+)/edit/validate', this.onRequestApiV1PrivateTodoEditValidate.bind(this))
    this.router.put('/api/v1/private/todo/:todoId([0-9]+)/edit/submit', this.onRequestApiV1PrivateTodoEditSubmit.bind(this))
    this.router.delete('/api/v1/private/todo/:todoId([0-9]+)/delete/submit', this.onRequestApiV1PrivateTodoDeleteSubmit.bind(this))

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

  async onRequestFindTodo (req, res, next) {
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

  async onRequestPrivateTodoIndex (req, res, next) {
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

  async onRequestPrivateTodoAddFinish (req, res, next) { // <4>
    try {
      res.locals.id = req.query.id

      next()
    } catch (err) {
      next(err)
    }
  }

  async onRequestPrivateTodoView (req, res, next) {
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

  async onRequestApiV1PrivateTodoAddInitialize (req, res, next) { // <5>
    try {
      const form = {
        content: '',
      }

      const validation = {
        ok: null,
        content: {ok: null, isNotEmpty: null},
      }

      res.send({form, validation})
    } catch (err) {
      next(err)
    }
  }

  async onRequestApiV1PrivateTodoAddValidate (req, res, next) { // <6>
    try {
      const validation = {
        ok: null,
        content: {ok: null, isNotEmpty: null},
      }

      validation.content.isNotEmpty = req.body.form.content !== ''
      validation.content.ok = validation.content.isNotEmpty
      validation.ok = validation.content.ok

      res.send({validation})
    } catch (err) {
      next(err)
    }
  }

  async onRequestApiV1PrivateTodoAddSubmit (req, res, next) { // <7>
    try {
      const validation = {
        ok: null,
        content: {ok: null, isNotEmpty: null},
      }

      validation.content.isNotEmpty = req.body.form.content !== ''
      validation.content.ok = validation.content.isNotEmpty
      validation.ok = validation.content.ok

      if (!validation.ok) {
        res.status(400).end()
        return
      }

      await model.sequelize.transaction(async (transaction) => {
        const todo = await model.todo.create({
          date: new Date(),
          content: req.body.form.content,
        }, {transaction})

        const ok = true
        const redirect = `./finish/?id=${todo.id}`

        res.send({ok, redirect})
      })
    } catch (err) {
      next(err)
    }
  }

  async onRequestApiV1PrivateTodoEditInitialize (req, res, next) { // <8>
    try {
      const form = {
        content: req.locals.todo.content,
      }

      const validation = {
        ok: null,
        content: {ok: null, isNotEmpty: null},
      }

      res.send({form, validation})
    } catch (err) {
      next(err)
    }
  }

  async onRequestApiV1PrivateTodoEditValidate (req, res, next) { // <9>
    try {
      const validation = {
        ok: null,
        content: {ok: null, isNotEmpty: null},
      }

      validation.content.isNotEmpty = req.body.form.content !== ''
      validation.content.ok = validation.content.isNotEmpty
      validation.ok = validation.content.ok

      res.send({validation})
    } catch (err) {
      next(err)
    }
  }

  async onRequestApiV1PrivateTodoEditSubmit (req, res, next) { // <10>
    try {
      const validation = {
        ok: null,
        content: {ok: null, isNotEmpty: null},
      }

      validation.content.isNotEmpty = req.body.form.content !== ''
      validation.content.ok = validation.content.isNotEmpty
      validation.ok = validation.content.ok

      if (!validation.ok) {
        res.status(400).end()
        return
      }

      await model.sequelize.transaction(async (transaction) => {
        const {todo} = req.locals
        const {form} = req.body

        todo.content = form.content
        await todo.save({transaction})

        const ok = true
        const redirect = './finish/'

        res.send({ok, redirect})
      })
    } catch (err) {
      next(err)
    }
  }

  async onRequestApiV1PrivateTodoDeleteSubmit (req, res, next) { // <11>
    try {
      await model.sequelize.transaction(async (transaction) => {
        await req.locals.todo.destroy({transaction})

        const ok = true
        const redirect = '../../delete/finish/'

        res.send({ok, redirect})
      })
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
