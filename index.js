const express = require('express')
const app = express()
const connection = require('./database/database')

const path = require('path')
const bodyParser = require('body-parser')

// Models & Controllers
const Category = require('./entities/categories/Category')
const Article = require('./entities/articles/Article')

const CategoryController = require('./entities/categories/CategoryController')
const ArticleController = require('./entities/articles/ArticleController')

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

app.use('/category', CategoryController)
app.use('/article', ArticleController)

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

// ! DETAILS ARTICLE
app.get('/article/:slug', (req, res) => {
  const { slug } = req.params

  Article.findOne({
    where: { slug },
    include: [
      { model: Category }
    ]
  }).then((article) => {
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
  }).catch((err) => {
    res.redirect('/')
  })
})

// ! DETAILS CATEGORY
app.get('/category/:slug', (req, res) => {
  const { slug } = req.params

  Category.findOne({
    where: { slug },
    include: [
      { model: Article }
    ]
  }).then((category) => {
    if (category != undefined) {
      Category.findAll().then((categories) => {
        console.log(category.articles)
        res.render('index', {
          articles: category.articles,
          categories,
          createdAt: formatDateList(category.articles)
        })
      })
    } else {
      res.redirect('/')
    }
  }).catch((err) => {
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
  const minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
  const seconds = date.getSeconds().toString()

  return `${dayF}/${monthF}/${yearF} às ${hour}:${minutes}:${seconds}`
}

// Start

app.listen(888, () => { })
