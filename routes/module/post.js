const express = require('express')
const router = express.Router()
const DB = require('../../db/index')

// 添加文章
router.post('/addPost', (req, res) => {
  const { title, content, category_id } = req.body
  const { user_id } = req.auth
  DB.query('INSERT INTO post set ?', { user_id, title, content, state: 1, category_id }, (err, result) => {
    if (err) return res.error(err)
    if (result.affectedRows !== 1) return res.error('添加失败')
    res.success(null, '添加成功!')
  })
})

// 删除文章
router.delete('/deletePost/:post_id', (req, res) => {
  const { post_id } = req.params
  DB.query('update post set ? where post_id = ?', [{ state: 0 }, post_id], (err, result) => {
    if (err) return res.error(err)
    if (result.affectedRows !== 1) return res.error('删除失败')
    res.success(null, '删除成功')
  })
})

// 查询文章: 列表, 搜索
router.get('/listPost', (req, res) => {
  const { title, post_id } = req.query
  const searchQuery = `%${title || ''}%`
  let sql = 'SELECT p.*, u.nickname, c.category_name, c.category_desc, c.category_img FROM post p JOIN users u ON p.user_id = u.user_id JOIN category c ON p.category_id = c.category_id WHERE p.title LIKE ? AND p.state = 1'
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

// 编辑文章
router.post('/editPost', (req, res) => {
  const article = req.body
  console.log(article)
  DB.query('update post set ? where post_id = ?', [article, article.post_id], (err, result) => {
    if (err) return res.error(err)
    if (result.affectedRows !== 1) res.error('修改失败')
    res.success('修改成功')
  })
})

module.exports = router
