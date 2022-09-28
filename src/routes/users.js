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

router.route('/data').post(async (req, res) => {
  try {
    const { name, birthday, gender } = await Account.findById(req.body.id)
    const birth = birthday.toISOString().split('T')[0]
    return res.send(JSON.stringify({ name, birth, gender }))
  }
  catch { res.send(JSON.stringify({ err: true })) }
})

router.route('/:id').get(async (req, res) => {
  try {
    const account = await Account.findById(req.params.id)
    res.render('pages/users/id', { account: { name: account.name, birth: account.birthday.toLocaleDateString(), gender: account.gender } })
  } catch (error) { res.send(error) }
})

module.exports = router