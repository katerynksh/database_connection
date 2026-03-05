import dotenv from 'dotenv'
import pg from 'pg';
dotenv.config()

const { Pool } = pg;
const pool = new Pool({
   connectionString: `${process.env.DB_URL}`,
   ssl: {
      rejectUnauthorized: false
   }
});

const initializeDatabase = async () => {
   console.log('🔄️ Initializing elephant database...');

   const createTableQuery = `
    CREATE TABLE IF NOT EXISTS elephants (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,                      
    age_years TEXT NOT NULL,
    breed TEXT NOT NULL,       
    weight_kg TEXT NOT NULL,           
    favorite_food TEXT,                
    character_notes TEXT,              
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
  `;
   try {
      await pool.query(createTableQuery);
      console.log('✅  The elephant table is ready to go.');
   } catch (error) {
      console.error('❗ Error initializing database:', error.message);
      console.error('Full error:', error);
      throw error;
   }
};
// 2. INSERT — Додавання нового cлона з усіма деталями
async function addElephant(name, age, breed, weight, food, notes) {
   const query = `
        INSERT INTO elephants (
            name, age_years, breed, weight_kg, favorite_food, character_notes
        )
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *`;

   const values = [name, age, breed, weight, food, notes];

   try {
      const res = await pool.query(query, values);
      console.log('✅  The elephant has been added with all the details:', res.rows[0]);
   } catch (err) {
      console.error('❗ Error:', err.message);
      console.error('Full error:', err);
      throw err;
   }

}

// 3. SELECT — Перегляд усіх cлоників у базі даних
async function getAllElephants() {
   const res = await pool.query('SELECT * FROM elephants ORDER BY id ASC');
   console.log('✨ List of all elephants:');
   console.table(res.rows);
}

async function updateElephantInfo(id, updates) {
   const allowedFields = [
      'name',
      'age_years',
      'breed',
      'weight_kg',
      'favorite_food',
      'character_notes'
   ];

   const fields = [];
   const values = [id];

   updates.forEach((item, index) => {
      const [key, value] = item.split('=');

      if (!allowedFields.includes(key)) return;

      fields.push(`${key} = $${index + 2}`);
      values.push(value);
   });

   const query = `
      UPDATE elephants 
      SET ${fields.join(', ')}
      WHERE id = $1
      RETURNING *`;

   const res = await pool.query(query, values);

   console.log('✅  Elephant data updated:', res.rows[0]);
}

async function deleteElephant(id) {
   await pool.query('DELETE FROM elephants WHERE id = $1', [id]);
   console.log(`✅  The elephant with ID ${id} has been removed from the database..`);
}
switch (process.argv[2]) {
   case 'list':
      await getAllElephants();
      break;
   case 'add':
      await addElephant(process.argv[3], process.argv[4], process.argv[5], process.argv[6], process.argv[7], process.argv[8]);
      break;
   case 'update':
      // await updateElephantInfo(process.argv[3], process.argv[4], process.argv[5], process.argv[6], process.argv[7], process.argv[8]);
      // break;
      await updateElephantInfo(process.argv[3], process.argv.slice(4));
      break;
   case 'delete':
      await deleteElephant(process.argv[3]);
      break;


   case 'help':
      console.log('_______________________________________');
      console.log('🔴Available commands:');
      console.log('1️⃣  list - Display all elephants');
      console.log('2️⃣  add + [name, age, breed, weight in kg, favorite food, character notes] - Add a new elephant with details');
      console.log('3️⃣  update + id + [name="...", age_years="...", ... (with commas and spaces)] - Update an existing elephant');
      console.log('4️⃣  delete + id - Delete an elephant');
      console.log('5️⃣  help - Display available commands');
      console.log('_______________________________________')
      break;
   default:
      console.log('❗ Unknown command. Use "help" to display available commands.');
      break;
}