const express=require('express')
const login=require('../models/login')
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
router.get('/user/:id',auth,async (req,res)=>{
    const id=req.params.id
    try{
        const user=await login.findOne({_id:id})
    if (id==req.user._id)
        return res.send({data:user,user:req.user})
    res.send({data:user})
    
}
    catch(e){
        res.send({error:e})
    }
})


module.exports=router