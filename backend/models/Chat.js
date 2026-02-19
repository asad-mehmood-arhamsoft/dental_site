const pool = require('../config/database');

class Chat {
  static async create({ patientId, userId, message, aiResponse }) {
    const result = await pool.query(
      `INSERT INTO chat_messages (patient_id, user_id, user_message, ai_response, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING *`,
      [patientId, userId, message, aiResponse]
    );
    return result.rows[0];
  }

  static async findByPatient(patientId, userId) {
    const result = await pool.query(
      `SELECT * FROM chat_messages 
       WHERE patient_id = $1 AND user_id = $2 
       ORDER BY created_at ASC`,
      [patientId, userId]
    );
    return result.rows;
  }
}

module.exports = Chat;
