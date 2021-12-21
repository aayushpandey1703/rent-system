const express=require('express')
const bodyParser=require('body-parser')
require('./db/mongoose')
const path=require('path')
const hbs=require('hbs')
const login=require('./models/login')

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

app.get("",(req,res)=>{
    res.render('login')
})

app.post('/register',async (req,res)=>{
    const pass=req.body.pass
    const confirm=req.body.confirm
    const email=req.body.email
    const username=req.body.username
    try{
        const check=await login.find({email:email})
        if(check.length>0)
            return res.send({error:'email already exists'})
        const newUser=new login({
            username:username,
            email:email,
            password:pass
        })
        await newUser.save()
        res.send({error:undefined})

    }catch(e){
        res.send({error:'something went wrong'})
    }
    
})

app.get('/home/:id',(req,res)=>{
    if(req.params.id.length>4)
        res.render('home')
    else    
        res.send('404')
    
  
})

app.listen(port,()=>{
    console.log('server listening on port: ',port)
})