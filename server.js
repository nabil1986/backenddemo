require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});

// Create a new device
app.post('/devices', (req, res) => {
    const { device_name, grease_quantity, grease_period, observation, level_control } = req.body;
    const level = level_control === 'oui' ? 1 : 0;
    const query = 'INSERT INTO devices (device_name, grease_quantity, grease_period, observation, niveau) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [device_name, grease_quantity, grease_period, observation, level], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(result);
        }
    });
});

// Read all devices
app.get('/devices', (req, res) => {
    const query = 'SELECT * FROM devices';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(results);
        }
    });
});

// Update a device
app.put('/devices/:id', (req, res) => {
    const { id } = req.params;
    const { device_name, grease_quantity, grease_period, observation, level_control } = req.body;
    const level = level_control === 'oui' ? 1 : 0;
    const query = 'UPDATE devices SET device_name = ?, grease_quantity = ?, grease_period = ?, observation = ?, niveau = ? WHERE id = ?';
    db.query(query, [device_name, grease_quantity, grease_period, observation, level, id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});

// Delete a device
app.delete('/devices/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM devices WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});
