const db = require('../../config/mysql')

module.exports = {
  postTransaction: (data) => {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO transaction SET ?', data, (error, result) => {
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
  }
}
