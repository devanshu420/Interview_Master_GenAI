const express = require('express');
const app = express();


app.use(express.json())

/* require all routes */
const authRouter = require('./routes/auth.route');

/* use all routes */
app.use('/api/auth', authRouter);

module.exports = app;