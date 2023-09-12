const express = require('express')
const cors = require('cors')
const app = express()
const mysql = require('mysql2')


app.use(express.json())
app.use(cors())

/*
const db = mysql.createPool({
	host: 'osudle-db',
	user: 'user',
	password: 'letmein',
	database: 'test',
    port: '3306'
});*/


const db = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: 'letmein',
	database: 'test',
    port: '3306'
});


app.get("/api", (req, res) => {
    const q = "SELECT * FROM osumapinfo"
    db.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})

app.listen(5000, () => {console.log("Server started on port 5000")})