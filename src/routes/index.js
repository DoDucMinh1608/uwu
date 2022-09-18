const { Router } = require('express')
const router = Router()

router.route('/').get((req, res) => {
  res.render('pages/index/index')
})

module.exports = router