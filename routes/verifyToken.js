const jwt=require('jsonwebtoken');

const verifyToken=(req,res,next)=>{
    //const token=req.header('auth-token');
    const token = req.cookies['token'];
    if (!token) {
        return res.status(401).send("Access denied");
    }

    try{
        const verified=jwt.verify(token,process.env.TOKEN_SECRET);
        req.user=verified;
        next();

    }catch(err){
        res.status(400).send("Invalid token");
    }
}

/*const setAuthHeader=(req,res,next)=>{
    var options = {
        setHeaders: function (res, path, stat) {
          req.set('auth-token', Date.now())
        }
      }
      
      app.use(express.static('public', options))
}*/

module.exports.verifyToken=verifyToken;
//module.exports.setAuthHeader=setAuthHeader;

