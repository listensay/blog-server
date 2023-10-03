/* eslint-disable indent */
// 错误中间件
exports.errorMessage = message => {
  console.log(message)
  switch (message) {
    case 'credentials_required':
      return {
        code: 5000,
        message: '没有权限'
      }
    case 'jwt expired':
    case 'invalid_token':
      return {
        code: 5013,
        message: '登录过期',
        success: false
      }
    case 'ER_BAD_FIELD_ERROR':
    case 'ER_PARSE_ERROR':
      return {
        code: 5055,
        message: '参数错误',
        success: false
      }
    default: return message
  }
}
