const express = require('express')
//set up the server
const app = express()
app.set('view engine', 'ejs')

//create routes
//app.get
//app.post
//request, response, next
// app.get('/', (req, res, next) =>{
//     console.log('here')
//     // res.status(500).json({message: "error"})
//     //to download a file
//     // res.download("server.js")
//     // res.json({message: "error"})
//     res.render("index", { text: "World"})
        
    
// })
app.get('/', (req, res)=>{
    console.log("This is the server page")
    res.render('index', { text: 'world'})
})


const userRouter = require('./routes/users')
app.use('/users', userRouter)

//run our server
app.listen(3000)


