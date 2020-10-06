const express=require('express');
const app=express();
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const cookies = require("cookie-parser");

const authRoutes=require('./routes/auth');
const postsRoutes=require('./routes/posts');

dotenv.config();

mongoose.connect(process.env.DB_CONNECT,
{ useNewUrlParser: true },
()=>console.log('Connected to db'));

app.use(express.json());
app.use(express.static('public'));
app.use(cookies());
app.use('/api/user',authRoutes);
app.use('/api/posts',postsRoutes);

app.listen(3000,()=>console.log("Server is running on port 3000"));

module.exports=app;