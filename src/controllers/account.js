import { Router } from 'express'
  const router = Router()

  router.route('/').get((req, res) => {
    res.render('pages/account/index')
  })
  export default router