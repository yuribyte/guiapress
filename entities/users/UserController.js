const express = require('express')
const router = express()

const User = require('./User')

router.get('/users', (req, res) => {
  User.findAll({ raw: true }).then((users) => {
    res.render('users/index', { users })
  })
})

router.get('/users/form', (req, res) => {
  res.render('users/form')
})

router.post('/user', (req, res) => {
  const { email, password } = req.body

  if (email !== undefined) {
    if (email !== '' && password !== '') {
      User.create({ email, password }).then(() => {
        res.redirect('users')
      }).catch((err) => {
        console.log(err)
        res.json({ email, password })
      })
    } else {
      res.redirect('users/form')
    }
  } else {
    res.redirect('users/form')
  }
})

module.exports = router