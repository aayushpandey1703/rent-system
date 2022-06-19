const express=require('express')
const login=require('../models/login')
const blog=require('../models/blog')
const cookieParser=require('cookie-parser')
const {auth,partialAuth}=require('../middleware/middleware')
const app=express()

app.use(cookieParser())

const router=new express.Router()

router.get('/register',(req,res)=>{
    res.render('login')
})

router.post('/register',async (req,res)=>{
    try{
        
        const newUser=new login(req.body)
        await newUser.save()
        const token=await newUser.generateAuthToken()
        res.cookie("access_token",token,{
            
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
          }).send({error:undefined,token:token})

    }catch(e){
        res.send({error:"user already exists"})
    }
    
})

router.get('/login',(req,res)=>{
    res.render('login')
})

router.post('/login',async (req,res)=>{
    try{
     const user=await login.findByCredentials(req.body.email,req.body.password)
     if (user.error)
        return res.send(user)

    const token=await user.generateAuthToken()

    res.cookie("access_token",token,{
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      }).send({token:token})
    }

    catch(e){
        console.log(e)
        res.send({error:e})
    }
})


// user profile endpoint
router.get('/author/:name',auth,async (req,res)=>{
    const name=req.params.name
    try{
        var user=await login.findOne({username:name})
        const numberPost=await blog.count({author:name})
        user.count=numberPost
    if (name==req.user.username)
        return res.render("profile",{data:user,k:true})
    res.render("profile",{data:user,k:false})
    
}
    catch(e){
        res.send({error:e})
    }
})

router.get('/dashboard',auth,async (req,res)=>{
    var user=req.user
    const count=await blog.count({author:user.username})
    user.count=count
    res.render("dashboard",{user:user})
})

router.get("/logout",auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.clearCookie("access_token")
        res.clearCookie("status")
        res.redirect("/")
    }
    catch(e){
        res.send({error:e})
    }
})

router.get("/logoutall",auth,async(req,res)=>{
    try{
       
        req.user.tokens=[]
        
        console.log(req.user)
        await req.user.save()
        res.clearCookie("access_token")
        res.clearCookie("status")
        res.redirect("/")
    }
    catch(e)
    {
        res.send({error:e})
    }
})

module.exports=router