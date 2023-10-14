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
  res.success({ img: '/images/' + file.filename + fileFromat })
})

router.get('/images', (req, res) => {
  fs.readdir(PATH, (err, files) => {
    if (err) {
      console.error(err)
      res.error('Server error')
      return
    }
    const images = []
    files.forEach(file => {
      const stat = fs.statSync(PATH + file)
      const uploadTime = stat.birthtime.toISOString() // 获取文件的创建时间并转换成ISO格式
      images.push({ url: '/images/' + file, filename: file, uploadTime: uploadTime })
    })
    res.success({ list: images })
  })
})

router.delete('/images/:filename', (req, res) => {
  const filename = req.params.filename // 获取要删除的文件名
  const filePath = PATH + filename // 拼接文件路径

  fs.unlink(filePath, (err) => {
    if (err) {
      // 如果删除出错，返回错误信息
      res.error('Server error')
      return
    }

    // 删除成功时，返回成功消息
    res.success(null, 'Image deleted successfully')
  })
})

module.exports = router
