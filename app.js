const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

//Port
const port = 3000

//Init app
const app = express()

//Set up DB connection
const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017/todoapp'

//Body Parser Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))

//View setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// Create a new MongoClient
const client = new MongoClient(url)

let Todos = undefined

// Connect to mongodb
client.connect((err, database) => {
    console.log('MongoDB Connected...')
    if(err) throw err

    const todosDB = client.db('todos');
    Todos = todosDB.collection('todos')

    //Start server
    app.listen(port, () => {
        console.log(`Server running on port ${port}`)
    })     
})


//Routes
app.get('/', (req, res, next) => {
    Todos.find({}).toArray((err, todos) => {
        if(err) {
            return console.log(err)
        }
        console.log(todos)
        res.render('index',{
            todos: todos
        })
    })
})
