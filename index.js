const express=require('express');
const app=express();
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const cookies = require("cookie-parser");
const path = require('path');

const authRoutes=require('./routes/auth');
const postsRoutes=require('./routes/photo');
const commentRoutes=require('./routes/comment');
global.appRoot = path.resolve(__dirname);

dotenv.config();

mongoose.connect(process.env.DB_CONNECT,
{ useNewUrlParser: true },
()=>console.log('Connected to db'));

 
app.set("view engine", "hbs");
app.use('/upload', express.static(__dirname + '/upload'));
app.use(express.json());
app.use(cookies());
app.use('/api/user',authRoutes);
app.use('/api',postsRoutes);
app.use('/api',commentRoutes);

app.listen(3000,()=>console.log("Server is running on port 3000"));

module.exports=app;