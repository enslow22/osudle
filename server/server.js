/**
 * server.js
 * Handles all backend api requests
 * 
 * Uses express, apicache, cors, 
 * 
 */

const express = require('express')
const apicache = require('apicache')
const cors = require('cors')
const mysql = require('mysql2')
const dayjs = require('dayjs')
const schedule = require('node-schedule')
const { rateLimit } = require('express-rate-limit')
var utc = require('dayjs/plugin/utc')
var timezone = require('dayjs/plugin/timezone')

// Configure stuff

// Express, apicache, .env, dayjs TZ, rate limiter
const app = express()
const cache = apicache.middleware
require('dotenv').config()
dayjs.extend(utc)
dayjs.extend(timezone)

const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, //1 hour
    limit: 10,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
})

// Apply limiter and other stuff tbh idk what this does
app.use('/api/submitTip', limiter)
app.use(express.json())
app.use(cors())

// Conenct to sqldb
const db = mysql.createPool({
	host: process.env.REACT_APP_HOST,
	user: process.env.REACT_APP_USER,
	password: process.env.REACT_APP_PASSWORD,
	database: process.env.REACT_APP_DATABASE,
    port: process.env.REACT_APP_PORT
});

// Get daily maps then grab new daily maps at start of new day
var dailies = null

function setDailies() {
    const today = dayjs.tz(dayjs(), 'PST8PDT');
    const start = dayjs.tz('2023-09-21 19:27', 'PST8PDT');
    const elapsed = parseInt(today.diff(start, 'day', true))
    const q = `SELECT * FROM osumapinfo WHERE MOTD != -1 AND MOTD <= ${elapsed} ORDER BY MOTD;`
    db.promise().query(q).then((data) => {
        dailies = data[0];
        console.log("Today's map is " + dailies[dailies.length-1].title)});
}

setDailies()

// Set a rule to fire when the next map needs to be updated
const rule = new schedule.RecurrenceRule();
rule.hour = 19;
rule.minute = 27;
rule.tz = 'PST8PDT';

const job = schedule.scheduleJob(rule, function(){
    console.log("WYSI !!!!!!!!!!!!!!!!!! WYSI");
    setDailies()
});


/**
 * ENDPOINTS
 * 
 * /api/dailies     GET a list of all the daily maps
 * /api/titles      GET a list of all the titles stored in the db (for autocompletion)
 * /devapi          GET a list of nothing because not configured
 * /api/submitTip   POST a map request which gets stored in the database
 */

app.get("/api/dailies", (req, res) => {
    return res.json(dailies)
});

app.get("/api/titles", cache('10 minutes') ,(req, res) =>{
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

app.post('/api/submitTip', (req, res) => {
    userId = req.body.userId
    mapId = req.body.mapId

    date = dayjs.tz(dayjs(), 'PST8PDT').format('YYYY-MM-DD T HH:mm:ss')
    const q = `INSERT INTO user_req (map_link, user, date) VALUES (? , ? , ?)`
    console.log(date)
    db.query(q, [parseInt(mapId), parseInt(userId), date], (err, data) =>{
        if (err) return res.sendStatus(500)
        return res.sendStatus(200)
    })
    console.log(req.body)
})

app.listen(5000, () => {console.log("Server started on port 5000")});
