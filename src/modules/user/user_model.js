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

  getUsers: (userPhone, order, limit, offset) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM users WHERE user_phone LIKE "%"?"%" ORDER BY ${order} LIMIT ? OFFSET ?`,
        [userPhone, limit, offset],
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },

  getUserByPhone: (phone) => {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM users JOIN balance ON users.user_id = balance.user_id WHERE users.user_phone = ?',
        phone,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
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
  },

  getDataCount: (searchKeyword) => {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT COUNT(*) AS total FROM users WHERE user_phone LIKE "%"?"%"',
        searchKeyword,
        (error, result) => {
          !error ? resolve(result[0].total) : reject(new Error(error))
        }
      )
    })
  }
}
