const express = require('express')
const router = express()

const Category = require('../categories/Category')
const Article = require('../articles/Article')
const slugify = require('slugify')

router.get('/list', (req, res) => {
  const props = { include: [{ model: Category }] }
  Article.findAll(props).then(articles => {
    if (articles != undefined) {
      Category.findAll().then((categories) => {
        res.render('articles', { articles, categories })
      })
    }
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
    Article.create({
      title,
      body,
      categoryId: category,
      slug: slugify(title).toLowerCase()
    }).then(() => res.redirect('/article/list'))
  } else {
    res.redirect('/article/form') // ! Mantém na página
  }
})

// ! DELETE
router.post('/:id/delete', (req, res) => {
  const { id } = req.body
  if (id != undefined) {
    if (!isNaN(id)) {
      if (id == req.params.id) {
        Article.destroy({
          where: { id }
        }).then(() => res.redirect('/article/list'))
      } else {
        res.redirect('/article/list')
      }
    } else {
      res.redirect('/article/list')
    }
  } else {
    res.redirect('/article/list')
  }
})

module.exports = router
