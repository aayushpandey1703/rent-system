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

router.get("/Blog",auth,async (req,res)=>{
    hbs.registerHelper('date',()=>{
        const d=new Date()

        return d.getDate()+"/"+d.getMonth()+"/"+d.getFullYear()
    })

    res.render("add_blog",{data:req.user})
})

router.post("/Blog",auth,async (req,res)=>{
    try{
        const e=new Date()
        
        req.body.author=req.user.username
        req.body.date=e.getDate()+"/"+e.getMonth()+"/"+e.getFullYear()
        
        const newBlog=new blog(req.body)
        await newBlog.save()
        res.send({response:"done"})

    }
    catch(e)
    {
        res.send({error:e})
    }
})

router.get("/MyBlog",auth,async (req,res)=>{
    try{
    const blogs=await blog.find({author:req.user.username})
    res.render("my_blogs",{data:blogs,user:req.user})
    }
    catch(e){
        res.sned({error:e})
    }
})

module.exports=router