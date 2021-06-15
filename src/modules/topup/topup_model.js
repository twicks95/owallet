const db = require('../../config/mysql')

module.exports = {
  postTopup: (data) => {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO topup SET ?', data, (error, result) => {
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
