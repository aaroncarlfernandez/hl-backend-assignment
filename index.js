const connectDB = require('./helpers/db')
const createServer = require("./helpers/server")

const app = createServer()
const PORT = process.env.PORT;
app.listen(PORT || 4000, () => console.log('Server running in ' + PORT));
connectDB();