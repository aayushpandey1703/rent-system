const mongoose=require('mongoose')

const blogSchema=new mongoose.Schema({
    title:{
        type:String,
        trim:true,
    },
    description:{
        type:String,
        trim:true
    },
    author:{
        type:String,
        trim:true,
        default:'Anonymous'
    },
    image:{
        type:String,
        default:'post.jpg'
    },
    date:{
        type:String
    }
})


blogSchema.statics.findBlog=async (id,token)=>{
    const blogPost=await blog.findOne({_id:id})
    if(!token){
        const descriptionArray=blogPost.description.split(". ")
        var subsentence=''
        for(var i=0;i<(descriptionArray.length)/2;i++)
            subsentence=subsentence+" "+descriptionArray[i]
        blogPost.description=subsentence
    }
    return blogPost    
}

const blog=mongoose.model('blog',blogSchema)


module.exports=blog