const { Router, json } = require('express')
const router = Router({ mergeParams: true })
const Account = require('../database/account')

router.route('/').get((req, res) => {
  res.render('pages/users/index')
})

router.route('/validate').post(async (req, res) => {
  const data = req.body, account = await Account.findById(data.id)
  res.send(JSON.stringify({ verify: account.name == data.username && account.password == data.password }))
})

router.route('/change').get((req, res) => {
  res.render('pages/users/change', { account: Account.schema.obj })
})

router.route('/:id').get(async (req, res) => {
  let account
  try { account = await Account.findById(req.params.id) }
  catch (error) { return res.send(error) }
  res.render('pages/users/id', { account: { name: account.name, birth: account.birthday.toLocaleDateString(), gender: account.gender } })
})

module.exports = router