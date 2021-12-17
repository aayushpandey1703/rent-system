const mongoose=require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/rent',{useNewUrlParser:true}).then((result)=>{
    console.log('success')
}).catch((error)=>{
    console.log(error)
})

