const express = require('express')
const router = express()

const Category = require('../categories/Category')
const Article = require('../articles/Article')
const slugify = require('slugify')


router.get('/list', (req, res) => {
  const props = { include: [{ model: Category }] }
  Article.findAll(props).then(articles => {
    res.render('articles', { articles })
  })
})

router.get('/form', (req, res) => {
  const props = { raw: true }
  Category.findAll(props).then((categories) => {
    res.render('articles/form', { categories })
  })
})

// ! CREATE
router.post('/', (req, res) => {
  const { title, body, category } = req.body
  if (title != undefined && body != undefined) {
    Article.create({ title, body, categoryId: category, slug: slugify(title) })
      .then(() => res.redirect('/article/list'))
  } else {
    res.redirect('/article/form') // ! Mantém na página
  }
})

module.exports = router