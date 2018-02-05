const express = require('express')
const path = require('path')

const app = express()

app.use(express.static(__dirname))
// app.get('/root', (req, res) => res.sendFile(path.join(__dirname, 'index.html')))

const port = process.env.PORT || 8080
app.listen(port, () => console.log(`listenting on port ${port}`))
