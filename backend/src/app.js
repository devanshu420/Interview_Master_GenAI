const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
const cors = require("cors");

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin : ["http://localhost:5173", "https://interview-master-gen-ai-dev.vercel.app"],
    credentials : true
}))

/* require all routes */
const authRouter = require('./routes/auth.route');
const interviewRouter = require('./routes/interview.route');

/* use all routes */
app.use('/api/auth', authRouter);
app.use('/api/interview', interviewRouter);

module.exports = app;