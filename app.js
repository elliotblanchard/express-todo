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
const ObjectID = require('mongodb').ObjectID
const { isBuffer } = require('util')

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

app.post('/todo/add', (req, res, next) => {
    // Create Todo object
    const todo = {
        text: req.body.text,
        body: req.body.body
    }

    // Insert todo
    Todos.insertOne(todo, (err, result) => {
        if (err) {
            return console.log(err)
        }
        console.log('Todo added...')
        res.redirect('/')
    })
})

app.delete('/todo/delete/:id', (req, res, next) => {
    const query = {_id: ObjectID(req.params.id)}
    Todos.deleteOne(query, (err, response) => {
        if(err) {
            return console.log(err)
        }
        console.log('Todo Removed')
        res.send(200)
    })

app.get('/todo/edit/:id', (req, res, next) => {
    const query = {_id: ObjectID(req.params.id)}
    Todos.find(query).next((err, todo) => {
        if(err) {
            return console.log(err)
        }
        res.render('edit',{
            todo: todo
        })
    })
})    

app.post('/todo/edit/:id', (req, res, next) => {
    const query = {_id: ObjectID(req.params.id)}
    // Create Todo object
    const todo = {
        text: req.body.text,
        body: req.body.body
    }

    // Insert todo
    Todos.updateOne(query, {$set:todo}, (err, result) => {
        if (err) {
            return console.log(err)
        }
        console.log('Todo updated...')
        res.redirect('/')
    })
})

})
