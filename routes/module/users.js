const express = require('express')
const router = express.Router()
const DB = require('../../db/index')

router.post('/login', function (req, res) {
  DB.query('select * from users', function (err, result) {
    if (err) return res.error(err)
    if (result.length > 0) {
      res.success(result)
    }
  })
})

module.exports = router
