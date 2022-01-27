const path = require('path')
const morgan = require('morgan')
const express = require('express')

class App {
  constructor () {
    this.router = express() // <1>

    this.router.set('strict routing', true) // <2>
    this.router.set('views', path.join(__dirname, 'view')) // <3>
    this.router.set('view engine', 'pug') // <4>

    this.router.use(morgan('dev')) // <5>

    this.router.get('/', (req, res) => res.redirect('./private/todo/')) // <6>
    this.router.get('/private/todo/', (req, res) => res.render('todo/private-index')) // <7>
    this.router.get('/private/todo/add/', (req, res) => res.render('todo/private-add'))
    this.router.get('/private/todo/add/finish/', (req, res) => res.render('todo/private-add-finish'))
    this.router.get('/private/todo/:todoId([0-9]+)/', (req, res) => res.render('todo/private-view')) // <8>
    this.router.get('/private/todo/:todoId([0-9]+)/edit/', (req, res) => res.render('todo/private-edit'))
    this.router.get('/private/todo/:todoId([0-9]+)/edit/finish/', (req, res) => res.render('todo/private-edit-finish'))
    this.router.get('/private/todo/:todoId([0-9]+)/delete/', (req, res) => res.render('todo/private-delete'))
    this.router.get('/private/todo/delete/finish/', (req, res) => res.render('todo/private-delete-finish'))

    this.router.use((req, res) => { // <9>
      res.status(404).end() // <10>
    })

    this.router.use((err, req, res, next) => { // <11>
      res.status(500).end() // <12>
      this.onError(err) // <13>
    })
  }

  onRequest (req, res) { // <14>
    this.router(req, res)
  }

  onError (err) { // <15>
    console.error(err.message)
    console.debug(err.stack)
  }
}

module.exports.App = App
