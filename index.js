const express = require('express')
const app = express()
const connection = require('./database/database')

const path = require('path')
const bodyParser = require('body-parser')

const catController = require('./entities/categories/CategoryController')
const artController = require('./entities/articles/ArticleController')

const Category = require('./entities/categories/Category')
const Article = require('./entities/articles/Article')

// View Engine

app.set('view engine', 'ejs')

// Body Parser

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Static Files

app.use(express.static(path.join(__dirname, '/public')))

// Database

connection
  .authenticate()
  .then(() => {
    console.log('Connection stablished')
  })
  .catch((err) => {
    console.warn(err)
  })

// Routes

app.use('/category', catController)
app.use('/article', artController)

app.get('/', (req, res) => {
  Article.findAll({
    order: [
      ['createdAt', 'DESC']
    ]
  }).then((articles) => {
    Category.findAll().then((categories) => {
      res.render('index', {
        articles,
        categories,
        createdAt: formatDateList(articles)
      })
    })
  })
})

// ! DETAILS
app.get('/article/:slug', (req, res) => {
  const { slug } = req.params

  Article.findOne({ where: { slug }, include: [{ model: Category }] })
    .then((article) => {
      if (article != undefined) {
        Category.findAll().then((categories) => {
          res.render('articles/details', {
            article,
            categories,
            createdAt: formatDate(article),
            updatedAt: formatDateHour(article)
          })
        })
      } else {
        res.redirect('/')
      }
    })
    .catch((err) => {
      res.redirect('/')
    })
})

// Functions

function formatDateList(dados) {
  for (let i = 0; i < dados.length; i++) {
    const element = dados[i]
    const date = new Date(Date.parse(element.createdAt))
    const day = date.getDate().toString()
    const dayF = day.length == 1 ? '0' + day : day
    const month = (date.getMonth() + 1).toString()
    const monthF = month.length == 1 ? '0' + month : month
    const yearF = date.getFullYear()
    return `${dayF}/${monthF}/${yearF}`
  }
}

function formatDate(dados) {
  const createdAt = dados.createdAt
  const date = new Date(Date.parse(createdAt))
  const day = date.getDate().toString()
  const dayF = day.length == 1 ? '0' + day : day
  const month = (date.getMonth() + 1).toString()
  const monthF = month.length == 1 ? '0' + month : month
  const yearF = date.getFullYear()
  return `${dayF}/${monthF}/${yearF}`
}

function formatDateHour(dados) {
  const updatedAt = dados.updatedAt
  const date = new Date(Date.parse(updatedAt))

  const day = date.getDate().toString()
  const dayF = day.length == 1 ? '0' + day : day

  const month = (date.getMonth() + 1).toString()
  const monthF = month.length == 1 ? '0' + month : month

  const yearF = date.getFullYear()

  const hour = date.getHours().toString()
  const minutes = date.getMinutes().toString()
  const seconds = date.getSeconds().toString()

  return `${dayF}/${monthF}/${yearF} às ${hour}:${minutes}:${seconds}`
}

// Start

app.listen(888, () => { })
