const pool = require('../config/database');

class Patient {
  static async create({ name, email, phone, dob, medicalNotes, userId }) {
    const result = await pool.query(
      `INSERT INTO patients (name, email, phone, date_of_birth, medical_notes, user_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING *`,
      [name, email, phone, dob, medicalNotes, userId]
    );
    return result.rows[0];
  }

  static async findAll(userId, { page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM patients WHERE user_id = $1',
      [userId]
    );
    const total = parseInt(countResult.rows[0].count);

    const result = await pool.query(
      `SELECT * FROM patients 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    return {
      patients: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  static async findById(id, userId) {
    const result = await pool.query(
      'SELECT * FROM patients WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return result.rows[0];
  }

  static async update(id, userId, { name, email, phone, dob, medicalNotes }) {
    const result = await pool.query(
      `UPDATE patients 
       SET name = $1, email = $2, phone = $3, date_of_birth = $4, 
           medical_notes = $5, updated_at = NOW()
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [name, email, phone, dob, medicalNotes, id, userId]
    );
    return result.rows[0];
  }

  static async delete(id, userId) {
    const result = await pool.query(
      'DELETE FROM patients WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );
    return result.rows[0];
  }
}

module.exports = Patient;
