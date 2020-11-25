const express = require('express')
const router = express()

const slugify = require('slugify')

const Category = require('../categories/Category')

router.get('/', (req, res) => {
  const props = { raw: true }
  Category.findAll(props).then(categories => {
    res.render('categories', { categories })
    console.log(categories)
  })
})

router.get('/form', (req, res) => {
  res.render('categories/form')
})

router.post('/', (req, res) => {
  const { title } = req.body
  if (title != undefined) {
    Category.create({ title, slug: slugify(title) })
      .then(() => res.redirect('/'))
  } else {
    res.redirect('/admin/form')
  }
})

module.exports = router