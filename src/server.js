// src/server.js
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const path = require('path');
const profileRoutes = require('./routes/profileRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const bidRoutes = require('./routes/bidRoutes');
const { startCronJobs } = require('./jobs/cronJobs');



const app = express();
const PORT = process.env.PORT || 3000;


app.use(helmet()); 
app.use(cors()); 
app.use(express.json());


app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'API is running smoothly!' });
});



app.use('/api/auth', authRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api/profile', profileRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/bids', bidRoutes);



startCronJobs();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});