const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
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
        required:[true,"please enter email"],
        trim: true,
        unique:[true,'User with this email already exists'],
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
    },
    tokens:[{
        token:{
            type:String
        }
    }]
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

userSchema.methods.generateAuthToken=async function(){
    const user=this
    const token=jwt.sign({_id:user._id.toString()}, "newtoken")
    user.tokens=user.tokens.concat({token:token})
    await user.save()
    return token
}

// hashing password
userSchema.pre('save',async function(next){
    const user=this
    if(user.isModified('password'))
        user.password=await bcrypt.hash(user.password,8)
    next()
})

const login=mongoose.model('login',userSchema)



module.exports=login