const express = require('express')
const router = express()

const User = require('./User')

router.get('/users', (req, res) => {
  User.findAll({ raw: true }).then((users) => {
    res.render('users/index', { users })
  })
})

module.exports = router