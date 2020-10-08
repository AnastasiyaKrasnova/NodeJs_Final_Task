const mongoose=require('mongoose');

const photoSchema=new mongoose.Schema({
    hashtags:{
        type: [String]
    },
    author_id:{
        type: String,
        required: true
    },
    path:{
        type: String,
        required: true
    },
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports=mongoose.model('Photo',photoSchema);