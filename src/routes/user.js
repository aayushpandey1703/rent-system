const express=require('express')
const login=require('../models/login')
const router=new express.Router()

router.post('/register',async (req,res)=>{
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
        console.log(e)
        res.send({error:e})
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