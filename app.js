const express = require('express')
const mysql = require('mysql2')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json());

const db = mysql.createConnection({ host: 'localhost', user: 'root', password: 'mylife84', database: 'newdatabase' })

app.post('/create/profiles', (req, res) => {
    const { first_Name, last_Name, email } = req.body

    if (!first_Name || !last_Name || !email) {
        return res.status(400).send({ error: 'firstname,lastname and email are required' })
    }
    const checkExistedProfile = `SELECT * FROM gift_users_profile WHERE first_Name=? AND last_Name=?`
    db.query(checkExistedProfile, [first_Name, last_Name], (err, result) => {

        if (err) {
            return res.status(400).send({ message: 'error checking profile' })
        }
        else if (result.length > 0) {
            return res.status(200).send({ message: 'The profile you are trying to create is already existed' })
        }
        else {
            const insertData = `INSERT INTO gift_users_profile(first_Name,last_Name,email) VALUES(?,?,?)`
            db.query(insertData, [first_Name, last_Name, email], (err, result) => {
                if (err) {
                    return res.status(500).send({ message: 'error creating profile' })
                }
                res.status(201).send({ message: 'profile created successfully' })
            })
        }
    })
})

app.post('/create/data', (req, res) => {
    const { giver_Id, receiver_Id, amount } = req.body

    if (!giver_Id || !receiver_Id || !amount) {
        return res.status(400).send({ error: 'giverId,reveiverId and amount are required' })
    }
    const addQuery = `SELECT* FROM gift_users_data WHERE giver_id=? AND receiver_id=?`
    db.query(addQuery, [giver_Id, receiver_Id], (err, result) => {

        if (result.length > 0) {
            const addAmountQuery = `UPDATE gift_users_data SET amount=? WHERE giver_id=? AND receiver_id=?`
            db.query(addAmountQuery, [amount + result[0].amount, giver_Id, receiver_Id], (err, result) => {

                if (err) {
                    return res.status(500).send('error updating amount')
                }
                res.status(200).send(result)
            })
        }
        else {
            const insertQuery = `INSERT INTO gift_users_data (giver_Id,receiver_Id,amount) VALUES (?,?,?)`;
            db.query(insertQuery, [giver_Id, receiver_Id, amount], (err, result) => {

                if (err) {
                    return res.status(500).send({ error: 'Foreign Key Error', message: 'The provided id does not exist in the referenced table. Please ensure to use a valid id' })
                }
                res.status(201).send({ message: 'data created successfully' })
            })
        }
    })
})

// app.post('/data', (req, res) => {
//     // console.log(req.body)
//     const { receiver, giver, amount, gift_year } = req.body

//     if (!receiver || !giver || !amount || !gift_year) {
//         return res.status(400).send('reveiver,giver,amount and gift_year are required')
//     }

//     const checkquery = `SELECT * FROM gift_users WHERE receiver=? AND giver=?`
//     db.query(checkquery, [receiver, giver], (err, result) => {
//         if (err) {
//             res.status(500).send('error checking for existing error')
//         }
//         if (result.length > 0) {
//             res.status(409).send('The giver is already existed')
//         }
//         else {
//             const insertQuery = `INSERT INTO gift_users (receiver,giver,amount,gift_year) VALUES (?,?,?,?)`;
//             db.query(insertQuery, [receiver, giver, amount, gift_year], (err, result) => {
//                 if (err) {
//                     return res.status(500).send('error inserting data')
//                 }
//                 // console.log(result.insertId)
//                 res.status(201).send({ message: 'data created successfully', id: result.insertId })
//             });
//         }
//     })
// })

app.get('/userProfile/:id', (req, res) => {
    const readQuery = `SELECT * FROM  gift_users_profile WHERE id=?`
    db.query(readQuery, [req.params.id], (err, result) => {

        if (err) {
            return res.status(500).send('error reading profile')
        }
        res.status(200).send(result)
    })
})

app.get('/userData/:id', (req, res) => {
    const page = parseInt(req.query.page)
    const page_size = parseInt(req.query.page_size)
    const offset = (page - 1) * page_size
    // console.log(offset)
    const readQuery = `SELECT * FROM gift_users_data WHERE giver_id=? OR receiver_id=? ORDER BY created_At
    LIMIT ? OFFSET ?`
    db.query(readQuery, [req.params.id, req.params.id, page_size, offset], (err, results) => {

        if (err) {
            return res.status(500).send('error reading data')
        }
        const targetId = req.params.id
        let sumSpent = 0
        results.forEach((result) => {
            if (result.giver_id == targetId) {
                sumSpent = sumSpent + result.amount
            }
        })
        let sumReceived = 0
        results.forEach((result) => {
            if (result.receiver_id == targetId) {
                sumReceived = sumReceived + result.amount
            }
        })
        res.status(200).send({ userTransaction: results, totalSpent: sumSpent, totalReceved: sumReceived })
    })
})

app.put('/profiles/:id', (req, res) => {
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

app.delete('/profiles/:id', (req, res) => {
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
