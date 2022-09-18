const { Router } = require('express')
const router = Router()

router.route('/').get((req, res) => {
  res.render('pages/index/index', { layout: 'layouts/layout2' })
})

module.exports = router