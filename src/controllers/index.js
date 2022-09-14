import { Router } from 'express'
const router = Router() // .../

router.route('/').get((req, res) => {
  res.render('pages/index/index')
})

export default router;