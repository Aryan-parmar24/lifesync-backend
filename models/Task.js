const mongoose = require('mongoose');

const taskSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    title:{
        type:String,
        required: true
    },
    category:{
        type:String,
        enum:["work","personal","health","finance","study"],
        default:"personal"
    },
    priority:{
        type:String,
        enum:["Low","Medium","High"],
        default:"Low"
    },
    deadline:{
        type:Date,
        required:true
    },
    estimatedTime:{
        type:Number,
        default:0
    },
    reminderTime:{
        type:Date
    },
    status:{
        type:String,
        enum:["Pending","Completed","missed"],
        default:"Pending"
    }
},{timestamps:true});

//purpose of this 3 lines is for faster search and faster filtering
taskSchema.index({ user:1});
taskSchema.index({deadline:1});
taskSchema.index({status:1});

module.exports = mongoose.model("Task",taskSchema);