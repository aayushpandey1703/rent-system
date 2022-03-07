const express=require('express')
const login=require('../models/login')
const cookieParser=require('cookie-parser')
const app=express()

app.use(cookieParser())

const router=new express.Router()

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




module.exports=router