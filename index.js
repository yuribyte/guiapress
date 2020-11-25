const express = require('express')
const app = express()
const connection = require('./database/database')

const path = require('path')
const bodyParser = require('body-parser')

const catController = require('./entities/categories/CategoryController')
const artController = require('./entities/articles/ArticleController')

const catModel = require('./entities/categories/Category')
const artModel = require('./entities/articles/Article')

// View Engine
app.set('view engine', 'ejs')

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Static Files
app.use(express.static(path.join(__dirname, '/public')));

// Database
connection.authenticate()
  .then(() => {
    console.log('connection ok')
  }).catch((err) => {
    console.log(err)
  })

// Routes

app.use('/category', catController)
app.use('/article', artController)

app.get('/', (req, res) => res.render('index'))


app.listen(888, () => { })