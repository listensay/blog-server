const express = require('express')
const router = express.Router()
const DB = require('../../db/index')

router.post('/addPost', (req, res) => {
  DB.query('inser')
})

module.exports = router
