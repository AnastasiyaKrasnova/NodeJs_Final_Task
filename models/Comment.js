const mongoose=require('mongoose');

const commentSchema=new mongoose.Schema({
    photo_id:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true,
        min:6,
        max:255
    },
    text:{
        type: String,
        required: true,
        min:6,
        max:1024
    },
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports=mongoose.model('Comment',commentSchema);