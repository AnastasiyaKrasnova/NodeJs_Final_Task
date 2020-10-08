const Photo=require('../models/Photo');
const User=require('../models/User');
const Comment=require('../models/Comment');
const mailer=require('../mailer');

exports.add=async (text,photo_author_name,author_id,photo_id)=>{
    const user_id=await this.nameToId(photo_author_name);
    if (!user_id) return false;
    const photoExists=await Photo.findOne({_id: photo_id, author_id: user_id});
    if (!photoExists) return false;
    const comment=new Comment({
      author_id: author_id,
      photo_id:photoExists._id,
      text:text
    });
    try{
        const savedComment=await comment.save();
        await parseComment(text);
        return savedComment;
    }
    catch(err) {
        return null;
    }
}

exports.delete=async (id,author_id)=>{
        try{
            const savedComment=await Comment.remove({_id: id, author_id: author_id});
            return true;
        }
        catch(err) {
            return null;
        }
}


exports.getByPhotoId=async (photo_id)=>{
    const comments=await Comment.find({photo_id: photo_id});
    if (!comments) return null;
    return comments;
}

exports.getByPhotoIdAndAuther=async (photo_id,author_id)=>{
    const comments=await Comment.find({photo_id: photo_id, author_id: author_id});
    if (!comments) return null;
    return comments;
}

exports.nameToId=async (name)=>{
    const user=await User.findOne({name: name});
    if (user)
        return user._id;
    else
        return null;
}

async function parseComment(text){
    const reg = /@[A-Za-z0-9_]+/g;
    const myArray = reg.exec(text);
    myArray.forEach(async (name)=>{
        name=name.slice(1);
        const mail=await getMailfromName(name);
        if (mail) mailer.sendMail(mail,"You are mentioned in the comment");
    })
}

async function getMailfromName(name){
    const user=await User.findOne({name: name});
    if (user)
        return user.email;
    else
        return null;
}
