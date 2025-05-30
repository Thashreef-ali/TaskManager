import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required : true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
     password:{
        type:String,
        required : true
    },
})

const taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        default:""
    },
    priority:{
        type:String,
        enum:["LOW","MEDIUM","HIGH"],default:"LOW"
    },
    dueDate:{
        type:Date
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,ref:'User',required:true
    },
    completed:{
        type: Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const User = mongoose.model('user',userSchema)
const Task = mongoose.model('task',taskSchema)

export {User,Task}