const mysql = require('mysql2')

const connection = mysql.createConnection({ host: 'localhost', user: 'root', password: 'mylife84', database: 'newdatabase' })

connection.connect((err) => {
  if (err) {
    console.log('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');

});
const createTableQuery = `
    CREATE TABLE gift_users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      receiver VARCHAR(255) NOT NULL,
      giver VARCHAR(255) NOT NULL ,
      amount INT NOT NULL
  )`
connection.query(createTableQuery, (err, results,) => {
  if (err) {
    console.log('Error creating table:', err);
    return;
  }
  console.log('Table created successfully:', results);
});

const insertQuery = `INSERT INTO gift_users (receiver,giver,amount) VALUES ('Bharathi','Nyra',500)`;
connection.query(insertQuery, (err, results) => {
  if (err) {
    console.log('Error inserting data:', err);
    return;
  }
  console.log('Data inserted successfully:');
});

const readQuery = `SELECT * FROM  gift_users`
connection.query(readQuery, (err, result) => {
  if (err) {
    console.log('error reading data', err)
    return;
  }
  console.log('read the data successfully', result)
})


const readParticularQuery = ` SELECT* FROM gift_users WHERE id=2`
connection.query(readParticularQuery, (err, result) => {
  if (err) {
    console.log('error reading the data', err)
    return;
  }
  console.log('read the data successfully', result)
})


const updateParticularQuery=`UPDATE gift_users SET giver='Kabi' WHERE id=2`
connection.query(updateParticularQuery,(err,result)=>{
  if(err){
    console.log('error updating data',err)
    return;
  }
  console.log('updated the data successfully',result)
})

const deleteParticularQuery=`DELETE FROM gift_users WHERE id=15`
connection.query(deleteParticularQuery,(err,result)=>{
  if(err){
    console.log('error deleting data',err)
    return;
  }
  console.log('deleted the data successfully',result)
})
// Close the connection
connection.end();

;

