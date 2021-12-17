const mongoose=require('mongoose')
const validator=require('validator')

const login=mongoose.model('login',{
    username:{
        type:String,
        default:'Anonymous',
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value))
                throw new Error('Not a valid email')
        }

    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:5
    }
})

module.exports=login