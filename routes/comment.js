const router = require('express').Router();
const verify=require('./verifyToken');
const Comment=require('../controllers/comment');
const Com=require('../models/Comment');

router.post('/comment',verify,async (req, res)=>{
   const saved=await Comment.add(req.body.comment,req.body.photo_author,req.user._id,req.body.photo_id);
   if (saved)
        res.status(200).send(saved);
   else
        res.status(400).send('data is incorrect');
});

router.get('/comment',verify,async (req, res)=>{ 
     if (!req.query.author_id){
          const comments=await Comment.getByPhotoId(req.query.id);
          if (comments)
               res.status(200).send(comments);
          else
               res.status(400).send('data is incorrect');
     }
     else{
          const comments=await Comment.getByPhotoIdAndAuther(req.query.id, req.query.author_id);
          if (comments)
          res.status(200).send(comments);
     else
          res.status(400).send('data is incorrect');
     }
    
});

router.delete('/comment',verify,async (req, res)=>{ 
    const saved=await Comment.delete(req.params.id, req.user._id);
   if (saved)
        res.status(200).send('comment deleted');
   else
        res.status(400).send('data is incorrect');
});

router.put('/comment',verify,async (req, res)=>{ 
    
});
module.exports=router;