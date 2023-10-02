const express = require('express')
const cors = require('cors')
const app = express()
const mysql = require('mysql2')
const dayjs = require('dayjs')
require('dotenv').config()
var timezone = require('dayjs/plugin/timezone')
dayjs.extend(timezone)
dayjs.tz.setDefault("America/Los_Angeles")
app.use(express.json())
app.use(cors())

const db = mysql.createPool({
	host: process.env.REACT_APP_HOST,
	user: process.env.REACT_APP_USER,
	password: process.env.REACT_APP_PASSWORD,
	database: process.env.REACT_APP_DATABASE,
    port: process.env.REACT_APP_PORT
});

app.get("/api", (req, res) => {
    const q = "SELECT * FROM osumapinfo"
    db.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})

app.get("/api/dailies", (req, res) => {
    const elapsed = parseInt(dayjs().diff(dayjs('2023-09-25 19:27'), 'day', true))
    const q = `SELECT * FROM osumapinfo WHERE MOTD != -1 AND MOTD <= ${elapsed}`
    db.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})

app.get("/api/titles", (req, res) =>{
    const q = "SELECT title, diff_name FROM osumapinfo"
    db.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})

app.get("/devapi", (req, res) => {
    const q = "SELECT * FROM devtable"
    db.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})

app.listen(5000, () => {console.log("Server started on port 5000")})
