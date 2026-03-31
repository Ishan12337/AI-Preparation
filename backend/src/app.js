
const express = require('express');
const app = express();
const cookieParser = require("cookie-parser")
const cors = require("cors")


app.use(express.json());
app.use(cookieParser());

app.set("trust proxy", 1);

app.use(cors({
    origin: "https://ai-preparation-frontend.onrender.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}))

/**require all the routes here */
const authRouter = require('./routes/auth.routes');
const interviewRouter = require("./routes/interview.routes")



/** use all the routes here */
app.use('/api/auth', authRouter);
app.use('/api/interview', interviewRouter)

module.exports = app;

