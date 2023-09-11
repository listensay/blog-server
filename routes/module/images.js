const express = require('express')
const router = express.Router()
const multer = require('multer')
const fs = require('fs')
const config = require('../../config')

const PATH = 'public/assets/avatar/'
const upload = multer({
  dest: PATH
})

const singleMidle = upload.single('img')

router.post('/avatar', singleMidle, (req, res) => {
  const file = req.file
  const fileFromat = '.' + file.mimetype.split('/')[1]
  //文件改名保存
  fs.renameSync(PATH + file.filename, PATH + file.filename + fileFromat)
  res.json({ code: 200, data: { img: `http://${config.ip}:${config.port}/avatar/` + file.filename + fileFromat }, message: 'ok', success: true })
})

module.exports = router
