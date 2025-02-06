import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt"

const userSchema = new Schema({
    username:{
        type:String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,//for searching
    },
    email:{
        type:String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName:{
        type:String,
        required: true,
        trim: true,
        index: true,//for searching
    },
    avatar:{
        type:String,
        required: true,
    },
    coverImage:{//todo
        type:String,
    },
    password: {
        type:String,
        required: [true, 'password is required'],
    },
    refreshToken: {
        type: String,
    },
    ethAddress: {
        type: String,
        unique: true,  // Each user should have a unique Ethereum address
        sparse: true,  // Allows some users to have no Ethereum address
        trim: true,
        match: /^0x[a-fA-F0-9]{40}$/, // Validates Ethereum address format
    }

}, {timestamps: true})

userSchema.pre("save" , async function(next){
    if(!this.isModified("password")){
        return next()
    }
    this.password = await bcrypt.hash(this.password , 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
   return await bcrypt.compare(password,this.password)  
}

userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,
            ethAddress: this.ethAddress,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User" , userSchema)