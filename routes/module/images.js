const express = require('express')
const router = express.Router()
const multer = require('multer')
const fs = require('fs')

const PATH = 'public/assets/images/'
const upload = multer({
  dest: PATH
})

const singleMidle = upload.single('img')

router.post('/images', singleMidle, (req, res) => {
  const file = req.file
  const fileFromat = '.' + file.mimetype.split('/')[1]
  //文件改名保存
  fs.renameSync(PATH + file.filename, PATH + file.filename + fileFromat)
  res.json({ code: 200, data: { img: '/images/' + file.filename + fileFromat }, message: 'ok', success: true })
})

router.get('/images', (req, res) => {
  fs.readdir(PATH, (err, files) => {
    if (err) {
      console.error(err)
      res.status(500).json({ error: 'Server error' })
      return
    }
    console.log(files)
    const images = files.map(file => '/assets/images/' + file) // 将图片链接的路径更新为正确的路径
    res.json({ code: 200, data: images, message: 'ok', success: true })
  })
})

module.exports = router
