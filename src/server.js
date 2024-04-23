const http = require("http")
const app = require("./app")
const mongoose = require('mongoose')
const PORT = process.env.PORT || 8000

const MONGO_URL = 'mongodb+srv://Rohit:Rohit305@nasa-cluster.k2f9jcm.mongodb.net/?retryWrites=true&w=majority&appName=nasa-cluster'

const {loadPlanetData} = require('./models/planets.model')

const server = http.createServer(app)

mongoose.connection.once('open',()=>{
    console.log('MongoDB is connected')
})

mongoose.connection.on('error', (err)=> {
    console.error(err)
})

async function startServer() {
    await mongoose.connect(MONGO_URL)
    await loadPlanetData()
    server.listen(PORT, ()=> {
        console.log(`Server is running on port ${PORT}`)
    })
}

startServer()
