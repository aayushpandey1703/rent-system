const mongoose=require('mongoose')

const blog=mongoose.model('blog',{
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

module.exports=blog