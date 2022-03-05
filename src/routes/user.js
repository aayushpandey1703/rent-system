const express=require('express')
const login=require('../models/login')
const router=new express.Router()

router.post('/register',async (req,res)=>{
    try{
    
        const newUser=new login(req.body)
        await newUser.save()
        res.send({error:undefined})

    }catch(e){
        res.send({error:"user already exists"})
    }
    
})

router.post('/login',async (req,res)=>{
    try{
     const user=await login.findByCredentials(req.body.email,req.body.password)
     if (user.error)
        return res.send(user)
    res.send({})
    }
    catch(e){
        console.log(e)
        res.send({error:e})
    }
})


module.exports=router