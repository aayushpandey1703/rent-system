const express=require('express')
const blog=require('../models/blog')
const hbs=require('hbs')
const {auth,partialAuth}=require('../middleware/middleware')

const router=new express.Router()


//show blogs in range of 5
router.get('',async (req,res)=>{
  const index=req.query.index||5
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
            res.render('home',{data:blogList,user:req.user})
        }
    }
        catch(e){
            console.log(e)
            res.status(500).send({error:e})
        }
  
})


// show particular post
router.get('/:id/:title',auth,async (req,res)=>{
    const id=req.params.id
    try{
    const post=await blog.findBlog(id,req.token)
    res.render('post',{data:post,user:req.user})
    }
    catch(e){
        res.status(500).send({error:e})
    }
    
})

module.exports=router