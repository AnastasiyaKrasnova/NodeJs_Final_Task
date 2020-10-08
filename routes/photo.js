const router = require('express').Router();
const fs = require("fs");
const formidable = require('formidable');
const verify=require('./verifyToken');
const path = require('path');
const photos_serv_path=path.dirname(require.main.filename)+"\\upload";
const Photo=require('../models/Photo');
const User=require('../models/User');

router.post('/photo',verify,async (req, res)=>{
        let form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            console.log(files);
            console.log(fields);
        });
        form.on('error', function(err) {
            console.error(err);
            res.status(500).send('received upload');
        });
        form.on('end', async function(fields, files) {
            const temp_path = this.openedFiles[0].path;
            const file_name = this.openedFiles[0].name;
            const dir=photos_serv_path+"\\"+req.user._id;
            const saved=await addPhototoDB(req.query.id,req.user._id,dir+"/"+file_name);
            if (saved){
               const p=await savePhoto(temp_path,file_name,dir) ;
               if(p)
                    res.status(200).send('received upload');
                else
                    res.status(500).send('Couldnt upload file');
            }
            else{
                res.status(400).send('Already exists');
            }
           
        });      
});

router.get('/photo',async (req, res)=>{ 
    const user_dir=await nameToId(req.query.name);
    if (user_dir){
        const files=fs.readdirSync(photos_serv_path+`\\${user_dir}`);
        let photos=[];
        for(let i=0;i<files.length;i++){
            photos[i]=`/upload/${user_dir}/`+files[i];
        }
        res.render("photos.hbs", {
            photos:photos
        });
    }
    
});

router.delete('/photo',verify,async (req, res)=>{ 
    
    const temp_path=await deletePhototoDB(req.query.id,req.user._id);
            if (temp_path){
                fs.unlink(temp_path, function(err) {
                    if (err) {
                        console.error(err);
                        } else {
                        console.log("success!");
                    }
                });
                res.status(400).send('Successfully deleted');
            }
            else{
                res.status(400).send('Not  exist');
            }
});

async function nameToId(name){
    const user=await User.findOne({name: name});
    if (user)
        return user._id;
    else
        return null;
}

async function addPhototoDB(id,author_id,path){
    const idExists=await Photo.findOne({id: id});
    if (idExists) return false;
    const photo=new Photo({
      id:id,
      author_id:author_id,
      path:path
    });
    try{
        const savedPhoto=await photo.save();
        return true;
    }
    catch(err) {
        return false;
    }
}

async function deletePhototoDB(id,author_id){
    const photo=await Photo.findOne({id: id});
    if (!photo) return null;
    if (author_id==photo.author_id){
        try{
            const savedPhoto=await Photo.remove({id: id, author_id: author_id});
            return photo.path;
        }
        catch(err) {
            return null;
        }
    }
    else
        return null; 
}

async function savePhoto(temp_path,file_name,dir) {
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

module.exports=router;