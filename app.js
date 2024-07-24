const express = require('express')
const mysql = require('mysql2')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json());

const connection = mysql.createConnection({ host: 'localhost', user: 'root', password: 'mylife84', database: 'newdatabase' })

app.post('/create', (req, res) => {
    // console.log(req.body)
    const { receiver, giver, amount } = req.body
    if (!receiver || !giver || !amount) {
        return res.status(400).send('reveiver,giver and amount are required')
    } else {
        const insertQuery = `INSERT INTO gift_users (receiver,giver,amount) VALUES (?,?,?)`;
        connection.query(insertQuery, [receiver, giver, amount], (err, result) => {
            if (err) {
                return res.status(500).send('Error inserting data')
            }
            res.status(201).send(result)
        });
    }
})

app.get('/', (req, res) => {
    const readQuery = `SELECT * FROM  gift_users`
    connection.query(readQuery, (err, result) => {
        if (err) {
            return res.status(500).send('error reading data')

        }
        res.status(200).send(result)
    })
})

app.put('/update', (req, res) => {
    const updateParticularQuery = `UPDATE gift_users SET giver='Arun' WHERE id=20`
    connection.query(updateParticularQuery, (err, result) => {
        if (err) {
            console.log('error updating data', err)
            return;
        }
        console.log('updated the data successfully', result)
    })
    res.send(200)
})

app.delete('/delete', (req, res) => {
    console.log(req.body)
    const{receiver, giver,amount,id}=req.body
    const deleteParticularQuery = `DELETE FROM gift_users WHERE id=?`
    connection.query(deleteParticularQuery,[id], (err, result) => {
        if (err) {
            return res.status(500).send('error deleting data')
        }
        res.status(200).send(result)
    })
})

app.listen(3000)
