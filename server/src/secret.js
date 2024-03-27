require("dotenv").config()

const port = process.env.PORT || 3001
const mongoURL = process.env.MONGO_URL || "mongodb://localhost:27017/StomaScope"
const jwtActivationKey = process.env.JWT_ACTIVATION_KEY
const jwtAccessKey = process.env.JWT_ACCESS_KEY
const jwtResetKey = process.env.JWT_RESET_KEY
const smtpUser = process.env.SMTP_USER || ""
const smtpPassword = process.env.SMTP_PASS || ""
const clientURL = process.env.CLIENT_URL || ""
const cloudName = process.env.CLOUDINARY_NAME
const cloudApiKey = process.env.CLOUDINARY_API_KEY
const cloudSecretKey = process.env.CLOUDINARY_SECRET_KEY



module.exports = {
    port,
    mongoURL,
    jwtActivationKey,
    smtpUser,
    smtpPassword,
    clientURL,
    jwtAccessKey,
    cloudName,
    cloudApiKey,
    cloudSecretKey,
    jwtResetKey
}