const { Router } = require('express')
const queryString = require('querystring')
const Account = require('../database/account')
const router = Router()
const accountSche = Account.schema.obj

router.use('/info', require('./users'))

router.route('/register').get((req, res) => {
  res.render('pages/account/register', { account: JSON.stringify(accountSche) })
}).post(async (req, res) => {
  let register = true, err = false;
  try {
    const data = req.body
    const newAccount = new Account({
      name: data.username,
      password: data.password,
      birthday: new Date(data.birthday),
      gender: data.gender
    })
    await newAccount.save()
  } catch { register = false, err = true }
  res.render('pages/account/register', { account: JSON.stringify(Account.schema.obj), register, err, data: JSON.stringify(req.body) })
})

router.route('/login').get((req, res) => {
  res.render('pages/account/login', { account: JSON.stringify(Account.schema.obj), register: req.query.register })
}).post(async (req, res) => {
  const { username, password } = req.body
  const account = await Account.findOne({ name: username, password })

  if (!account) return res.render('pages/account/login', { err: true })
  res.render('pages/account/index', { account: JSON.stringify({ username, password, id: account.id }) })
})



module.exports = router