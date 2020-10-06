const router=require('express').Router();
const {verifyToken} = require('./verifyToken');
const request=require('request');

router.get('/',verifyToken,(req,res)=>{
    res.send(req.user);
    //res.json({posts:{title: "my first post", description: "need verification"}});
});

module.exports=router;