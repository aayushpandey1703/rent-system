const express=require('express')
const blog=require('../models/blog')
const hbs=require('hbs')

const router=new express.Router()


//show blogs in range of 5
router.get('/home/:id',async (req,res)=>{
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
            console.log(e)
            res.status(500).send({error:e})
        }
    }
        
    else    
        res.send('404')
    
  
})

// show particular post
router.get('/home/:id/:title',async (req,res)=>{
    const title=req.params.title
    try{
    const post=await blog.findOne({title:title})
    res.render('post',{data:post})
    }
    catch(e){
        res.status(500).send({error:e})
    }
    
})

module.exports=router