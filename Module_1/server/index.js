const express=require("express")
const cors=require('cors')
const jwt=require("jsonwebtoken")
const app=express();
require('dotenv').config();

const port=3000;
const jwtpass="helloworldfromsundar"

app.use(cors({
    origin:"*", 
    methods:['POST']
}))
app.use(express.json())


app.post('/login',(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return res.send({message:"email and password must required"})
    }
    let UserRole="";
    if(email=="sundar@gmail.com" && password=="1234"){
       UserRole="admin"
    }
    else if(email=="kandan@gmail.com" && password=="123"){
        UserRole="Staff"
    }
    else{
        return res.send({message:"password is invalid"})
    }

    const bodyJWT={email,UserRole}
    const token=jwt.sign(bodyJWT,jwtpass,{expiresIn:"1h"})
    res.send({message:"Login successfull",token})
})


app.listen(3000,()=>{
    console.log('server is running')
})
