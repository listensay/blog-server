/* eslint-disable indent */
// 错误中间件
exports.errorMessage = message => {
  switch (message) {
    case 'No authorization token was found':
      return '没有权限'
    case 'jwt expired':
      return {
        code: 5014,
        message: '登陆过期',
        success: false
      }
    case 'ER_PARSE_ERROR':
      return {
        code: 5055,
        message: '服务器错误',
        success: false
      }
    default: return message
  }
}
