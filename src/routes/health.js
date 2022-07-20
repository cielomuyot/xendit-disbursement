const router = require('express').Router()

router.route('/').get((req, res) => res.send('Healthy'))

module.exports = router
