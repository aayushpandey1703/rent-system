const mongoose=require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/rent',{useNewUrlParser:true}).then((result)=>{
    console.log('successfully connected to db')
}).catch((error)=>{
    console.log(error)
})

