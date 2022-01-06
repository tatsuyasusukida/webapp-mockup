const path = require('path')
const morgan = require('morgan')
const express = require('express')

class App {
  constructor () {
    this.router = express()

    this.router.set('strict routing', true) // <1>
    this.router.set('views', path.join(__dirname, 'view'))
    this.router.set('view engine', 'pug')

    this.router.use(morgan('dev')) // <2>

    this.router.get('/', (req, res) => res.redirect('./todo/')) // <3>
    this.router.get('/todo/', (req, res) => res.render('todo/private-index'))
    this.router.get('/todo/add/', (req, res) => res.render('todo/private-add'))
    this.router.get('/todo/add/finish/', (req, res) => res.render('todo/private-add-finish'))
    this.router.get('/todo/:todoId([0-9]+)/', (req, res) => res.render('todo/private-view'))
    this.router.get('/todo/:todoId([0-9]+)/edit/', (req, res) => res.render('todo/private-edit'))
    this.router.get('/todo/:todoId([0-9]+)/edit/finish/', (req, res) => res.render('todo/private-edit-finish'))
    this.router.get('/todo/:todoId([0-9]+)/delete/', (req, res) => res.render('todo/private-delete'))
    this.router.get('/todo/delete/finish/', (req, res) => res.render('todo/private-delete-finish'))

    this.router.use((req, res) => { // <4>
      res.status(404).end()
    })

    this.router.use((err, req, res, next) => { // <5>
      res.status(500).end()
      this.onError(err)
    })
  }

  onRequest (req, res) { // <6>
    this.router(req, res)
  }

  onError (err) { // <7>
    console.error(err.message)
    console.debug(err.stack)
  }
}

module.exports.App = App
