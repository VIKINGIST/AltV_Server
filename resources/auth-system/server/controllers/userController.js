const { pool } = require('../database');
const { hashPassword } = require('../utils/passwordUtils');

async function createUser(username, email, password, hardwareId) {
  try {
    const connection = await pool.getConnection();
    const query = 'INSERT INTO users (username, email, password, hardware_id) VALUES (?, ?, ?, ?)';
    const result = await connection.query(query, [username, email, password, hardwareId]);
    connection.release();
    return result.insertId;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

async function updateUserPassword(userId, newPassword) {
  try {
    const connection = await pool.getConnection();
    const query = 'UPDATE users SET password = ? WHERE id = ?';
    const hashedPassword = await hashPassword(newPassword);
    await connection.query(query, [hashedPassword, userId]);
    connection.release();
  } catch (error) {
    console.error('Error updating user password:', error);
    throw error;
  }
}

module.exports = {
  createUser,
  updateUserPassword
};