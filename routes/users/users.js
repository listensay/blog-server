var express = require('express')
var router = express.Router()

/* GET users listing. */
router.get('users/login', function (req, res) {
  res.json({ code: 200, data: {}, message: '', success: true })
})

module.exports = router
