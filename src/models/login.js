const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')


const userSchema=new mongoose.Schema({
    username:{
        type:String,
        default:'Anonymous',
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim: true,
        unique:true,
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

// create findByCredentials of model
userSchema.statics.findByCredentials=async (email,password)=>{
    const user=await login.findOne({email:email})
    if(!user)
        return {error:'No User'}
    const check=await bcrypt.compare(password,user.password)
    if(!check)
        return {error:'Incorrect details'}
    return user
}

// hashind pasword
userSchema.pre('save',async function(next){
    const user=this
    if(user.isModified('password'))
        user.password=await bcrypt.hash(user.password,8)
    next()
})

const login=mongoose.model('login',userSchema)



module.exports=login