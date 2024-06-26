const express = require("express")
const createError = require('http-errors')
const morgan = require("morgan")
const rateLimit = require("express-rate-limit")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const app = express()

const userRoutes = require("../routes/userRoutes")
const seedRoutes = require("../routes/seedRoutes")
const authRoutes = require("../routes/authRoutes")
const fileRoutes = require("../routes/fileRoute")

const { errorResponse } = require("../handler/responseHandler")

// const limiter = rateLimit({
//     windowMs: 1 * 60 * 1000,
//     max: 5,
//     message: "too many requests"
// })

// middlewares
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Methods', "GET, POST, PUT, DELETE");
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // Allow credentials (cookies)
    next();
});
app.use(cookieParser())
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use(limiter)

// routes
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/seed", seedRoutes)
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/file", fileRoutes)

app.get("/", (req, res) => {
    res.status(200).json({
        message: "welcome to the server"
    })
})

app.get("/api/v1/test", (req, res) => {
    res.status(200).json({
        message: "testing"
    })
})

// handling client error
app.use((req, res, next) => {
    createError(404, "route not found")
    next()
})

// handling server error
app.use((err, req, res, next) => {
    return errorResponse(res, {
        statusCode: err.status,
        message: err.message
    })
})

module.exports = app