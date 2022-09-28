const { Router } = require('express')
const router = Router()
const Account = require('../database/account')

router.route('/').get((req, res) => {
  res.render('pages/account2/index')
})

router.use('/user', require('./users'))

router.route('/login').get((req, res) => {
  res.render('pages/account2/login', { account: JSON.stringify(Account.schema.obj), register: req.query.register })
}).post(async (req, res) => {
  const { username, password } = req.body
  const account = await Account.findOne({ name: username, password })
  if (!account) return res.render('pages/account/login', { err: true })
  res.render('pages/account2/login', {
    data: JSON.stringify({ username, password, id: account.id }),
    success: true,
  })
})

router.route('/register').get((req, res) => {
  res.render('pages/account2/register', { account: JSON.stringify(Account.schema.obj) })
}).post(async (req, res) => {
  let register = true, err = false;
  const data = req.body
  const newAccount = new Account({ name: data.username, password: data.password, birthday: new Date(data.birthday), gender: data.gender })
  try { await newAccount.save() }
  catch { register = false, err = true }
  res.render('pages/account2/register', { account: JSON.stringify(Account.schema.obj), register, err, data: JSON.stringify(req.body) })
})
router.route('/:id').get((req, res) => {
  res.redirect(`/account2/user/${req.params.id}`)
})
module.exports = router