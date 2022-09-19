const { Router } = require('express')
const Account = require('../database/account')
const router = Router()
const accountSche = Account.schema.obj

router.route('/').get((req, res) => {
  res.render('pages/account/index')
})
router.route('/register').get((req, res) => {
  res.render('pages/account/register', {
    account: JSON.stringify(accountSche)
  })
}).post(async (req, res) => {
  try {
    const data = req.body
    const newAccount = new Account({
      name: data.username,
      password: data.password,
      birthday: new Date(data.birthday),
      gender: data.gender
    })
    await newAccount.save()
  } catch (error) {
    console.log(error)
    return res.render('pages/account/register', {
      account: JSON.stringify(accountSche),
      error: "Try again",
      data: JSON.stringify(req.body)
    })
  }
  res.redirect('/account/login')
})
router.route('/login').get((req, res) => {
  res.render('pages/account/login', {
    account: JSON.stringify(Account.schema.obj)
  })
}).post((req, res) => {
  console.log(req.body)
})

module.exports = router