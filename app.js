const express = require('express')
const mysql = require('mysql2')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json());

const db = mysql.createConnection({ host: 'localhost', user: 'root', password: 'mylife84', database: 'newdatabase' })

app.post('/create', (req, res) => {
    // console.log(req.body)
    const { receiver, giver, amount, gift_year } = req.body

    if (!receiver || !giver || !amount || !gift_year) {
        return res.status(400).send('reveiver,giver,amount and gift_year are required')
    }

    const checkquery = `SELECT * FROM gift_users WHERE giver=?`
    db.query(checkquery, [giver], (err, result) => {
        if (err) {
            res.status(500).send('error checking for existing error')
        }
        if (result.length > 0) {
            res.status(409).send('The giver is already existed')
        }
        else {
            const insertQuery = `INSERT INTO gift_users (receiver,giver,amount,gift_year) VALUES (?,?,?,?)`;
            db.query(insertQuery, [receiver, giver, amount, gift_year], (err, result) => {
                if (err) {
                    return res.status(500).send('error inserting data')
                }
                // console.log(result.insertId)
                res.status(201).send({ message: 'data created successfully', id: result.insertId })
            });
        }
    })
})

app.get('/', (req, res) => {

    const readQuery = `SELECT * FROM  gift_users`
    db.query(readQuery, (err, result) => {
        if (err) {
            return res.status(500).send('error reading data')
        }
        res.status(200).send(result)
    })
})

app.put('/update/:id', (req, res) => {
    // console.log(req.body)
    const { amount } = req.body

    const updateParticularQuery = `UPDATE gift_users SET amount=? WHERE id=?`
    db.query(updateParticularQuery, [amount, req.params.id], (err, result) => {
        if (err) {
            console.log("error")
            return res.status(500).send('error updating data')
        }
        if (result.affectedRows == 0) {
            return res.status(404).send('id is invalid')
        }
        // console.log(result)
        res.status(200).send({ message: 'updated the data successfully', id: req.params.id })
    })
})

app.delete('/delete/:id', (req, res) => {
    // console.log(req.params.id)
    const deleteParticularQuery = `DELETE FROM gift_users WHERE id=${req.params.id}`
    db.query(deleteParticularQuery, (err, result) => {
        if (err) {
            return res.status(500).send('error deleting data')
        }
        if (result.affectedRows == 0) {
            return res.status(404).send("id is invalid to get deleted")
        }
        res.status(200).send({ message: 'deleted the data', id: req.params.id })
        console.log(result)
    })
})

app.listen(3000)
