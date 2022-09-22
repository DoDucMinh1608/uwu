const { Router } = require('express')
const router = Router({ mergeParams: true })

router.route('/').get((req, res) => {
  res.render('pages/users/index')
})

router.route('/:id').get((req, res) => {
  res.send(req.params.id)
})
module.exports = router