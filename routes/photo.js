const router = require('express').Router();
const fs = require("fs");
const formidable = require('formidable');
const verify=require('./verifyToken');
const path = require('path');
const photos_serv_path=path.dirname(require.main.filename)+"\\upload";
const Photo=require('../controllers/photo');


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
            const saved=await Photo.add(req.user._id,dir+"/"+file_name);
            if (saved){
               const p=await Photo.saveAsFile(temp_path,file_name,dir) ;
               if(p)
                    res.status(200).send(saved);
                else
                    res.status(500).send('Couldnt upload file');
            }
            else{
                res.status(400).send('Already exists');
            }
           
        });      
});

router.get('/photo',async (req, res)=>{ 
    const user_dir=await Photo.nameToId(req.query.name);
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
    
    const temp_path=await Photo.delete(req.query.id,req.user._id);
            if (temp_path){
                fs.unlink(temp_path, function(err) {
                    if (err) {
                        console.error(err);
                        } else {
                        console.log("success!");
                    }
                });
                res.status(200).send('Successfully deleted');
            }
            else{
                res.status(400).send('Not  exist');
            }
});

router.put('/photo/hashtags',verify,async (req, res)=>{ 
    
    const saved=await Photo.addHashtag(req.query.id,req.user._id,req.body.hashtags);
            if (saved){
                res.status(200).send(saved);
            }
            else{
                res.status(400).send('Not  exist');
            }
});



module.exports=router;