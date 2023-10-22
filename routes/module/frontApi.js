const express = require('express')
const router = express.Router()
const DB = require('../../db/index')

// 查询文章: 列表, 搜索
router.get('/article', (req, res) => {
  const { title, post_id } = req.query
  const searchQuery = `%${title || ''}%`
  let sql = 'SELECT p.*, u.nickname, u.avatar, c.category_name, c.category_desc, c.category_img FROM post p JOIN users u ON p.user_id = u.user_id JOIN category c ON p.category_id = c.category_id WHERE p.title LIKE ? AND p.state = 1'
  const values = [searchQuery]
  if (post_id) {
    sql += ' AND p.post_id = ?'
    values.push(post_id)
  }

  sql += ' ORDER BY p.create_date DESC'

  DB.query(sql, values, (err, result) => {
    if (err) throw err
    if (result.length === 0) {
      return res.error('找不到哦~')
    }
    res.success({ list: result })
  })
})

router.get('/userinfo', (req, res) => {
  DB.query('select email, avatar, nickname, description, registration_date, bg from users WHERE username = "admin"', (err, result) => {
    if (err) return res.error(err)
    if (result.length === 0) return res.error('用户信息不存在')
    const userinfo = result[0]
    res.success({ userinfo })
  })
})

router.get('/userProfile', (req, res) => {
  const username = 'admin'
  DB.query('select profiles from users where username = ?', username, (err, result) => {
    if (err) return res.error(err)
    if (result.length !== 0) {
      res.success(...result)
    }
  })
})

router.get('/category', (req, res) => {
  DB.query('select * from category', (err, result) => {
    if (err) return res.error(err)
    if (result.length <= 0) res.error('查询失败')
    res.success({ list: result })
  })
})

module.exports = router
