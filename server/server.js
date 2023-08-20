const express = require('express')
const app = express()
const mysql = require('mysql2')

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'letmein',
    database: 'test'
});

app.get("/api", (req, res) => {
    const q = "SELECT * FROM osumapinfo"
    db.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})
