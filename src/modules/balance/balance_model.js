const db = require('../../config/mysql')

module.exports = {
  getBalance: (id) => {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM balance WHERE user_id = ?',
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },

  postBalance: (data) => {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO balance SET ?', data, (error, result) => {
        if (!error) {
          const newResult = {
            id: result.insertId,
            ...data
          }
          resolve(newResult)
        } else {
          reject(new Error(error))
        }
      })
    })
  },

  updateBalance: (data, id) => {
    return new Promise((resolve, reject) => {
      db.query(
        'UPDATE balance SET ? WHERE user_id = ?',
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
