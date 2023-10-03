const express = require('express')
const apicache = require('apicache')
const cors = require('cors')
const app = express()
const cache = apicache.middleware
const mysql = require('mysql2')
const dayjs = require('dayjs')

require('dotenv').config()
var utc = require('dayjs/plugin/utc')
var timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)

const timeZone = dayjs.tz.guess()

app.use(express.json())
app.use(cors())
// TODO: Set cache to be equal to time left in day
app.use(cache('5 minutes'))

const db = mysql.createPool({
	host: process.env.REACT_APP_HOST,
	user: process.env.REACT_APP_USER,
	password: process.env.REACT_APP_PASSWORD,
	database: process.env.REACT_APP_DATABASE,
        port: process.env.REACT_APP_PORT
});

app.get("/api/dailies", (req, res) => {
    const today = dayjs().tz('America/Los_Angeles');
    const start = dayjs('2023-09-21 19:27');
    const elapsed = parseInt(today.diff(start, 'day', true))
    const q = `SELECT * FROM osumapinfo WHERE MOTD != -1 AND MOTD <= ${elapsed};`
    db.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
});

app.get("/api/titles", (req, res) =>{
    const q = "SELECT title, diff_name FROM osumapinfo"
    db.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
});

app.get("/devapi", (req, res) => {
    const q = "SELECT * FROM devtable"
    db.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
});

app.listen(5000, () => {console.log("Server started on port 5000")});
