const express=require('express')
const bodyParser=require('body-parser')
require('./db/mongoose')
const path=require('path')
const hbs=require('hbs')
const login=require('./models/login')
const blog=require('./models/blog')
const e = require('express')

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
    const pass=req.body.password
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
        res.send({error:e})
    }
    
})

app.post('/login',async (req,res)=>{
     const user=await login.findOne(req.body)
     if (!user)
        return res.send({error:'User does not exist'})
    res.send({})
})

//show blogs in range of 5
app.get('/home/:id',async (req,res)=>{
    const index=req.query.index
    if(req.params.id.length>4 && index)
    {
        try{
        const blogs=await blog.find()
    
            
        if(blogs.length==0)
            res.render('home',{message:'No blog posted'})
        else{
            var blogList=[]
            blogList=blogs.slice(index-5,index)

            hbs.registerHelper('slice',(text)=>{
                const myArray=text.split(" ")
                var newString=""
                for(let i=0;i<5;i++)
                    newString+=" "+myArray[i]
                return newString

            })

            res.render('home',{data:blogList})
        }
    }
        catch(e){
            res.status(500).send({error:e})
        }
    }
        
    else    
        res.send('404')
    
  
})

// show particular post
app.get('/home/:id/:title',async (req,res)=>{
    const title=req.params.title
    try{
    const post=await blog.findOne({title:title})
    res.render('post',{data:post})
    }
    catch(e){
        res.status(500).send({error:e})
    }
    
})

app.get("*",(req,res)=>{
    res.send('404')
})

app.listen(port,()=>{
    console.log('server listening on port: ',port)
})