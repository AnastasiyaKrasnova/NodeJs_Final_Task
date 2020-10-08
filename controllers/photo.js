const Photo=require('../models/Photo');
const User=require('../models/User');
const fs = require("fs");


exports.add=async (author_id,path)=>{
    const photo=new Photo({
      author_id:author_id,
      path:path,
    });
    try{
        const savedPhoto=await photo.save();
        return savedPhoto;
    }
    catch(err) {
        return null;
    }
}

exports.addHashtag=async (id,author_id,hashtags)=>{
                try{
                    const savedPhoto=await Photo.update({_id : id, author_id: author_id}, {hashtags: hashtags}, {upsert: false})
                    return savedPhoto;
                }
                catch(err) {
                return null;
                }

}

exports.delete=async (id,author_id)=>{
    const photo=await Photo.findOne({_id: id, author_id: author_id});
    if (!photo) return false;
        try{
            const savedPhoto=await Photo.remove({_id: id, author_id: author_id});
            return photo.path;
        }
        catch(err) {
            return null;
        }
}

exports.saveAsFile=async (temp_path,file_name,dir)=>{
    fs.readFile(temp_path, function(err, data) {
        console.log(dir);
        try {
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir)
            }
        } catch (err) {
                console.error(err);
                return false;
        }
        fs.writeFile(dir+"/"+file_name, data, function(err) {
            fs.unlink(temp_path, function(err) {
                if (err) {
                    console.error(err);
                    return false;
                    } else {
                    console.log("success!");
                }
            });
        });
    });
    return true;
}

exports.nameToId=async (name)=>{
    const user=await User.findOne({name: name});
    if (user)
        return user._id;
    else
        return null;
}
