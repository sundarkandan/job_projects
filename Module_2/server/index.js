const express=require('express');
const mongoose=require("mongoose");
const cors=require("cors")

const app=express();

app.use(express.json());
app.use(cors({
    origin:"*",
    methods:['GET',"POST"]
}))

const UserSchema=mongoose.Schema({
    userId:{
        unique:true,
         type:Number
    },
    title: String,
    description: String,
    category: String,
    priority: String, 
})

app.post('/requests',async (req,res)=>{
   try{
    if(!req.body){
        const finding=await Users.find();
        return res.send({msg:"data added successfuly",finding})
    }
     const datas=req.body;
    const adding=new Users(datas);
    await adding.save()
    const finding=await Users.find();
    res.send({msg:"data added successfuly",finding})
   }
   catch(err){
    console.log(err);
    res.send({msg:"Data not added error accured"})
   }
})

const mongoDBURL="mongodb://localhost:27017/module2"

const Users=mongoose.model('users',UserSchema);

mongoose.connect(mongoDBURL).then(()=>{
    console.log('Database Connected')
})
app.listen(3000,()=>{
    console.log("app is running")
})