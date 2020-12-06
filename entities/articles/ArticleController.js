const express = require('express')
const router = express()

const Category = require('../categories/Category')
const Article = require('../articles/Article')
const slugify = require('slugify')

router.get('/list', (req, res) => {
  const props = {
    include: [
      { model: Category }
    ],
    order: [
      ['id', 'ASC']
    ]
  }

  Article.findAll(props).then(articles => {
    if (articles != undefined) {
      Category.findAll({ raw: true }).then((categories) => {
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

router.get('/page/:num', (req, res) => {
  const page = req.params.num
  const limit = 4;
  let offset = 0;
  let next = false;

  if (isNaN(page) || page == 1) {
    offset = 0;
  } else {
    offset = (parseInt(page) - 1) * limit
  }

  Article.findAndCountAll({
    limit, offset, order: [
      ['createdAt', 'DESC']
    ]
  }).then(articles => {

    if (offset + limit >= articles.count) {
      next = false;
    } else {
      next = true
    }

    const result = {
      page: parseInt(page),
      next, articles
    }

    Category.findAll().then(categories => {
      res.render('articles/pages', { categories, result })
    })

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

// ! UPDATE
router.get('/edit/:id', (req, res) => {
  const { id } = req.params

  if (!isNaN(id)) {
    Article.findByPk(id, {
      include: { model: Category }
    }).then(article => {
      if (article != undefined) {
        Category.findAll({ raw: true }).then((categories) => {
          res.render('articles/form-edit', { article, categories })
        })
      }
    }).catch(err => {
      res.redirect('/category/list')
    })
  } else {
    console.log('Unexpected error')
    res.redirect('/category/list')
  }
})

// ! UPDATE
router.post('/:id/update', (req, res) => {
  const { id, title, body, category } = req.body
  Article.update(
    { title, body, categoryId: category, slug: slugify(title).toLowerCase() },
    { where: { id } }
  ).then(() => res.redirect('/article/list'))
    .catch((err) => res.redirect('/'))
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
