const { pool } = require('../database');

async function getUserByEmail(email) {
  try {
    const connection = await pool.getConnection();
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await connection.query(query, [email]);
    connection.release();
    return rows[0];
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
}

async function getUserByHardwareId(hardwareId) {
  try {
    const connection = await pool.getConnection();
    const query = 'SELECT * FROM users WHERE hardware_id = ?';
    const [rows] = await connection.query(query, [hardwareId]);
    connection.release();
    return rows[0];
  } catch (error) {
    console.error('Error getting user by hardware ID:', error);
    throw error;
  }
}

module.exports = {
  getUserByEmail,
  getUserByHardwareId
};