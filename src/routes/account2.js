const { Router } = require('express')
const router = Router()

router.route('/').get((req, res) => {
  res.render('pages/account2/index')
})
router.route('/login').get((req, res) => {
  res.render('pages/account2/login')
})
router.route('/register').get((req, res) => {
  res.render('pages/account2/register')
})

module.exports = router