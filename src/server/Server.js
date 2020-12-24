require('dotenv').config()
const express = require('express')
const aws = require('aws-sdk')
const formData = require('express-form-data')
const cors = require('cors')
const { CLIENT_ORIGIN } = require('./config')

const app = express()

aws.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

app.use(cors({
    origin: CLIENT_ORIGIN
}))

app.use(formData.parse())

app.post('/image-upload', (req, res) => {

    const values = Object.values(req.files)
    console.log("step")
    const promises = values.map(image => aws.upload(image.path))

    Promise
        .all(promises)
        .then(results => res.json(results))
})

app.listen(process.env.PORT || 3000, () => console.log('👍'))