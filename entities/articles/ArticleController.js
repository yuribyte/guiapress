const express = require('express')
const router = express()

router.get('/', (req, res) => {
  res.render('articles')
})

router.get('/admin/form', (req, res) => {
  res.render('articles/form')
})

module.exports = router