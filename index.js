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
    order: [['createdAt', 'ASC']], limit: 4
  }).then((articles) => {
    Category.findAll().then((categories) => {
      res.render('index', {
        articles,
        categories
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
          categories
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
        res.render('index', {
          articles: category.articles,
          categories
        })
      })
    } else {
      res.redirect('/')
    }
  }).catch((err) => {
    res.redirect('/')
  })
})

// Start

app.listen(888, () => { })
