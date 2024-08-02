const mysql = require('mysql2')

const db = mysql.createConnection({ host: 'localhost', user: 'root', password: 'mylife84', database: 'newdatabase' })

db.connect((err) => {
  if (err) {
    console.log('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');

});
const createProfileTableQuery = `CREATE TABLE gift_users_profile(
  id INT AUTO_INCREMENT PRIMARY KEY,
  First_Name VARCHAR(255) NOT NULL,
  Last_Name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP )`

db.query(createProfileTableQuery, (err, result) => {
  if (err) {
    console.log("error creating giftUsersProfileTable")
    return;
  }
  else {
    console.log("Table created")
  }

})

// const createTableQuery = `
//     CREATE TABLE gift_users (
//       id INT AUTO_INCREMENT PRIMARY KEY,
//       giver VARCHAR(255) NOT NULL ,
//       receiver VARCHAR(255) NOT NULL,
//       amount INT NOT NULL,
//       gift_year YEAR NOT NULL
//   )`
// db.query(createTableQuery, (err, results,) => {
//   if (err) {
//     console.log('Error creating table:', err);
//     return;
//   }
//   console.log('Table created successfully:', results);
// });

// const insertQuery = `INSERT INTO gift_users (giver,receiver,amount,) VALUES ('Bharathi','Nyra',500)`;
// db.query(insertQuery, (err, results) => {
//   if (err) {
//     console.log('Error inserting data:', err);
//     return;
//   }
//   console.log('Data inserted successfully:');
// });

// const readQuery = `SELECT * FROM  gift_users`
// db.query(readQuery, (err, result) => {
//   if (err) {
//     console.log('error reading data', err)
//     return;
//   }
//   console.log('read the data successfully', result)
// })


// const readParticularQuery = ` SELECT* FROM gift_users WHERE id=2`
// db.query(readParticularQuery, (err, result) => {
//   if (err) {
//     console.log('error reading the data', err)
//     return;
//   }
//   console.log('read the data successfully', result)
// })


// const updateParticularQuery = `UPDATE gift_users SET giver='Kabi' WHERE id=2`
// db.query(updateParticularQuery, (err, result) => {
//   if (err) {
//     console.log('error updating data', err)
//     return;
//   }
//   console.log('updated the data successfully', result)
// })

// const deleteParticularQuery = `DELETE FROM gift_users WHERE id=15`
// db.query(deleteParticularQuery, (err, result) => {
//   if (err) {
//     console.log('error deleting data', err)
//     return;
//   }
//   console.log('deleted the data successfully', result)
// })
// // Close the connection
// connection.end();



