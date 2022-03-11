const express=require('express')
const bodyParser=require('body-parser')
require('./db/mongoose')
const path=require('path')
const hbs=require('hbs')
const userRouter=require('./routes/user')
const blogRouter=require('./routes/blog')

const app=express()
const port=process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json())

const publicDirectoryPath=path.join(__dirname,'../public')
const viewsPath=path.join(__dirname,"../template/views")
const partialsPath=path.join(__dirname,"../template/partials")

app.set('view engine','hbs')
app.set('views',viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.static(publicDirectoryPath))


app.use(userRouter)
app.use(blogRouter)

app.get("*",(req,res)=>{
    res.send('404')
})

app.listen(port,()=>{
    console.log('server listening on port: ',port)
})

//task
// 1. create user frontend for user profile
// 2. create write blog