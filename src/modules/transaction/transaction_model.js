const db = require('../../config/mysql')

module.exports = {
  getTransaction: (id, condition, limit) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT transaction_sender_id, transaction_receiver_id, transaction_amount, transaction_type, 
        u1.user_name AS receiver_name, u1.user_image AS receiver_image, 
        u2.user_name AS sender_name, u2.user_image AS sender_image, 
        transaction_created_at 
        FROM transaction 
        JOIN users AS u1 ON transaction.transaction_receiver_id = u1.user_id 
        JOIN users AS u2 ON transaction.transaction_sender_id = u2.user_id 
        WHERE (transaction_sender_id = ? OR transaction_receiver_id = ?) ${condition} 
        ORDER BY transaction.transaction_created_at DESC LIMIT ?`,
        [id, id, limit],
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  getDataById: (id) => {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM transaction JOIN users ON transaction.transaction_receiver_id = users.user_id WHERE transaction_id = ?',
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  getIncome: (id) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT SUM(transaction_amount) AS total_income, transaction_receiver_id FROM transaction WHERE transaction_receiver_id = ${id}`,
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  getExpense: (id) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT SUM(transaction_amount) AS total_expense, transaction_sender_id FROM transaction WHERE transaction_sender_id = ${id}`,
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
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
  },
  getTotalTransactionPerDay: (id) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT DAYNAME(transaction_created_at) AS day, SUM(transaction_amount) AS total 
      FROM transaction WHERE transaction_receiver_id = ? 
      AND WEEK(transaction_created_at) = WEEK(NOW()) 
      GROUP BY DAYNAME(transaction_created_at)`,
        [id, id],
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  }
}
