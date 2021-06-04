const db = require('../../config/mysql')

module.exports = {
  postData: (data) => {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO users SET ?', data, (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  },

  getDataConditions: (data) => {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM users WHERE user_email = ?',
        data,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  }
}
