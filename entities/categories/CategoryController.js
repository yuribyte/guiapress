const express = require('express')
const router = express()

const Category = require('../categories/Category')
const slugify = require('slugify')

router.get('/list', (req, res) => {
  const props = { raw: true }
  Category.findAll(props).then(categories => {
    res.render('categories', { categories })
  })
})

router.get('/form', (req, res) => {
  Category.findAll({ raw: true }).then(categories => {
    res.render('categories/form', { categories })
  })
})

// ! CREATE
router.post('/', (req, res) => {
  const { title } = req.body
  if (title != undefined) {
    Category.create({ title, slug: slugify(title).toLowerCase() })
      .then(() => res.redirect('/category/list'))
  } else {
    res.redirect('/category/form') // ! Mantém na página
  }
})

// ! UPDATE
router.post('/:id/update', (req, res) => {
  const { title, id } = req.body
  Category.update(
    { title, slug: slugify(title).toLowerCase() },
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
        Category.findAll({ raw: true }).then(categories => {
          res.render('categories/form-edit', { category, categories })
        })
      }
    }).catch(err => {
      console.log(err)
      res.redirect('/category/list')
    })
  } else {
    console.log('Unexpected error')
    res.redirect('/category/list')
  }
})

module.exports = router