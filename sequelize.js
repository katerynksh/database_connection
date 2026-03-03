
import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config()
const sequelize = new Sequelize(`${process.env.DB_URL}`, {
   dialect: 'postgres',
   protocol: 'postgres',});

  const User = sequelize.define('Alina', {
   firstname: DataTypes.TEXT,
   lastname: DataTypes.TEXT,
   username: DataTypes.TEXT,
   birthday: DataTypes.TEXT,
   working_place: DataTypes.TEXT
});
async function initializeDatabase() {
   console.log('🔄 Initializing database...')
   await sequelize.sync( { force: true } ); 
   console.log('✅ Database table initialized successfully')
};

async function addInfo() {
   await User.create({
      firstname: 'Alina',
      lastname: 'Shvyryd',
      username: 'alinanana',
      birthday: '21.10.2008',
      working_place: 'ne bomzh'
   }
);
   console.log('✅ User added successfully')
}
async function getData() {
  const users = await User.findAll();
   console.log('✨Connection has been established successfully.');
   console.log('Users:', users);
}
async function deleteInfo() {
      await User.destroy({
      where: {
         id: {
            [Sequelize.Op.gt]: 1
         }
      }
   })
}

async function updateInfo() {
   await User.update({ working_place: 'bezrabotnyi' }, {
      where: {
         id: 1
      }
   })
}
(async () => {
   await initializeDatabase();
//    await addInfo();
   await getData();
   // await deleteInfo();
//    await updateInfo();
})()