const mariadb = require("mariadb");

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectionLimit: 5,
});
const db = require("../db");
const Iibei = db.iibei;

exports.getAll = async (req, res) => {
  let connection;
  try{
    connection = await pool.getConnection();
    const rows = await connection.query("SELECT id, name FROM iibei");
    res.send(rows);
  } catch (error){
    throw error;
  } finally {
    if (connection) return connection.end();
  }
};