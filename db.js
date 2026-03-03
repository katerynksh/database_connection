import dotenv from 'dotenv'
import { get } from 'node:http';
dotenv.config()

import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({
   connectionString: `${process.env.DB_URL}`
});

const initializeDatabase = async () => {
  console.log('🔄 Initializing database...');
  
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS katerynksh (
      id SERIAL PRIMARY KEY NOT NULL REFERENCES katerynksh(id) ON DELETE CASCADE ON UPDATE CASCADE,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      group_name TEXT NOT NULL,
      year_of_study INTEGER NOT NULL,
      additional_info TEXT,
      working_place TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(createTableQuery);
    console.log('✅ Database table initialized successfully');
 } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    console.error('Full error:', error);
    throw error;
  }
};

initializeDatabase()

async function getData() {
   await pool.connect();
   const { rows } = await pool.query('SELECT * from katerynksh')
   console.log("Rows => ", rows);
   await pool.end()
}
getData()

async function addInfo(){
   await pool.query("insert into katerynksh (first_name, last_name, group_name, year_of_study, additional_info, working_place) values ('Kateryna', 'Sherepera', 'IPZs-25-1', 2025, 'notamegamozg', 'bezrabotnyi')");
}
// addInfo()

async function deleteRow() {
   await pool.query(`delete from katerynksh where id > 1`)
}
// deleteRow()

async function updateRow() {
   // await pool.query(`update katerynksh set working_place = 'bomzh' where id = 1`)
}
// updateRow()
// console.log(await pool.query('SELECT * from katerynksh'))

// console.log('Database operations completed');
