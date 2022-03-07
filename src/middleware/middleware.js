const jwt=require('jsonwebtoken')
const login=require('../models/login')
const cookieParser=require('cookie-parser')
const express=require('express')

const app=express()
app.use(cookieParser())

const auth=async (req,res,next)=>{
    try
    {
    const token=req.headers.cookie                                                          // get cookies from client (access_token={token value})
    const tokenFilter=token.replace('access_token=',"")                                     // {token value}                
    const check=jwt.verify(tokenFilter,"newtoken")
    const user=await login.findOne({_id:check._id,'tokens.token':tokenFilter})
    if(!user)
        throw new Error()

    req.user=user
    req.token=token 
    next()
    }
    catch(e)
    {
        res.redirect('/')
    }
}

module.exports=auth