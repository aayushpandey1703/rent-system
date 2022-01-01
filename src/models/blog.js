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
    date:{
        type:String
    }
})

module.exports=blog