const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');


app.use(express.json())
app.use(cookieParser())

/* require all routes */
const authRouter = require('./routes/auth.route');

/* use all routes */
app.use('/api/auth', authRouter);

module.exports = app;