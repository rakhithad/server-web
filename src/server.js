// src/server.js
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(helmet()); 
app.use(cors()); 
app.use(express.json());


app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'API is running smoothly!' });
});



app.use('/api/auth', authRoutes);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});