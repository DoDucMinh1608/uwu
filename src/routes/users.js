const { Router, json } = require('express')
const router = Router({ mergeParams: true })
const Account = require('../database/account')

router.route('/').get((req, res) => {
  res.render('pages/users/index')
})


router.route('/:id').get(async (req, res) => {
  let account
  try {
    account = await Account.findById(req.params.id)
  } catch (error) {
    return res.send(error)
  }
  // res.send(account)
  // res.send(req.params.id)
  res.render('pages/users/index', { account: { name: account.name, birth: account.birthday, gender: account.gender } })
})

router.route('/validate').post(async (req, res) => {
  const data = req.body
  try {
    // const account = (await Account.find({ name: data.username, password: data.password }))[0]
    // if (!account || account.id != data.id) res.redirect('./login')
    // res.send(JSON.stringify(req.body))
  } catch (error) {
    return res.send('Error')
  }
})
module.exports = router