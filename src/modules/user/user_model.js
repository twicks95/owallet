const db = require('../../config/mysql')

module.exports = {
  getUser: (id) => {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM users JOIN balance ON users.user_id = balance.user_id WHERE users.user_id = ?',
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },

  getUserByPhone: (data) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE ?', data, (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  },

  updateUser: (data, id) => {
    return new Promise((resolve, reject) => {
      db.query(
        'UPDATE users SET ? WHERE user_id = ?',
        [data, id],
        (error, result) => {
          if (!error) {
            const newResult = {
              id,
              ...data
            }
            resolve(newResult)
          } else {
            reject(new Error(error))
          }
        }
      )
    })
  }
}
