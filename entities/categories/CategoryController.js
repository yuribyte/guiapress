const express = require('express')
const router = express()

router.get('/', (req, res) => {
  res.render('categories')
})

router.get('/admin/form', (req, res) => {
  res.render('categories/form')
})

module.exports = router