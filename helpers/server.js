const express = require("express")
const cors = require('cors')

const dotenv = require('dotenv')
dotenv.config({ path: process.cwd() + '/config/config.env' });

function createServer() {
	const app = express()
    app.use(cors())
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json())
    app.use('/api/users', require('../routes/users.js'));
    app.use('/api/apartments', require('../routes/apartments.js'));
	return app
}

module.exports = createServer