import dotenv from 'dotenv'
dotenv.config()

import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({
   connectionString: `${process.env.DB_URL}`
});

const initializeDatabase = async () => {
  console.log('🔄 Initializing database...');
  
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS students (
      id SERIAL PRIMARY KEY,
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
   const { rows } = await pool.query('SELECT * from students')
   console.log("Rows => ", rows);
   await pool.end()
}

async function addInfo(){
   await pool.query("insert into students (first_name, last_name, group_name, year_of_study, additional_info, working_place) values ('Alina', 'Shvyryd', 'IPZs-25-1', 2025, 'megamozg', 'waiting')");
}

async function deleteRow() {
   await pool.query(`delete from students where id=2`)
}
deleteRow()
async function updateRow() {
   await pool.query(`update students set working_place='lalala'`)
}
updateRow()

// addInfo()
