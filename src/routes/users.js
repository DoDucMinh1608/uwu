const { Router } = require('express')
const router = Router({ mergeParams: true })
const Account = require('../database/account')

router.route('/').get((req, res) => {
  res.render('pages/users/index')
})


router.route('/:id').get(async (req, res) => {
  const account = await Account.findById(req.params.id)
  // res.send(account)
  // res.send(req.params.id)
  res.render('pages/users/index', { account: { name: account.name, birth: account.birthday, gender: account.gender } })
})

router.route('/validate').post((req, res) => {
  console.log(req.body)
  res.send(true)
})
module.exports = router