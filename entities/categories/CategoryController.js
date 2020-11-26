const express = require('express')
const router = express()

const slugify = require('slugify')

const Category = require('../categories/Category')

router.get('/list', (req, res) => {
  const props = { raw: true }
  Category.findAll(props).then(categories => {
    res.render('categories', { categories })
    console.log(categories)
  })
})

router.get('/form', (req, res) => {
  res.render('categories/form')
})

// ! CREATE
router.post('/', (req, res) => {
  const { title } = req.body
  if (title != undefined) {
    Category.create({ title, slug: slugify(title) })
      .then(() => res.redirect('/category/list'))
  } else {
    res.redirect('/category/form') // ! Mantém na página
  }
})

router.post('/:id/update', (req, res) => {
  const { title, id } = req.body
  Category.update(
    { title, slug: slugify(title) },
    { where: { id } }
  ).then(() => res.redirect('/category/list'))
})

// ! DELETE
router.post('/:id/delete', (req, res) => {
  const { id } = req.body
  if (id != undefined) {
    if (!isNaN(id)) {
      if (id == req.params.id) {
        Category.destroy({
          where: { id }
        }).then(() => res.redirect('/category/list'))
      } else {
        res.redirect('/category/list')
      }
    } else {
      res.redirect('/category/list')
    }
  } else {
    res.redirect('/category/list')
  }
})

router.get('/edit/:id', (req, res) => {
  const { id } = req.params

  if (!isNaN(id)) {
    Category.findByPk(id).then(category => {
      if (category != undefined) {
        if (category.id == id) {
          res.render('categories/form-edit', { category })
        }
      } else {
        res.redirect('/category/list')
      }
    }).catch(err => {
      res.redirect('/category/list')
    })
  } else {
    res.redirect('/category/list')
  }
})

module.exports = router