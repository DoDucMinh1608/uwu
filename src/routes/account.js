const { Router } = require('express')
const router = Router()

router.route('/').get((req, res) => {
  res.render('pages/account/index')
})
router.route('/register').get((req, res) => {
  res.render('pages/account/register')
})
router.route('/login').get((req, res) => {
  res.render('pages/account/login')
})

module.exports = router