const express = require('express');
const cors = require('cors');

require('./db/config');
const User = require('./db/User');
const Pet = require('./db/Pet');
const Jwt=require('jsonwebtoken');
const jwtKey='pet-x';

const app = express();
// app.get('/', (req, res) => {
//     res.send('Welcome to the Pet Management System');
// });

app.use(express.json());
app.use(cors());

app.post('/Signup', async (req, resp) => {
    let user = new User(req.body);
    let result = await user.save();
    // result=result.toObject;
    // delete result.password;
        Jwt.sign({result},jwtKey,{expiresIn:"3h"},(err,token)=>{
            if(err)
            {
                resp.send({ result: 'Something went wrong' });
            }
            resp.send({result,auth:token});
        })

    // resp.send(result);
});

app.post("/login", async (req, resp) => {
    if (req.body.password && req.body.email) {
        let user = await User.findOne(req.body).select("-password"); //password not needed
        if (user) {
            Jwt.sign({user},jwtKey,{expiresIn:"3h"},(err,token)=>{
                if(err)
                {
                    resp.send({ result: 'Something went wrong' });
                }
                resp.send({user,auth:token});
            })
            
        } else {
            resp.send({ result: 'No User Found' });
            
        }
    }
    else {
        resp.send({ result: 'No User Found' });
    }
});

app.post("/add-pet", async (req, resp) => {
    let pet = new Pet(req.body);
    let result = await pet.save();
    resp.send(result);
});

app.get("/pets", async (req, resp) => {
    let pets = await Pet.find();
    resp.send(pets);

   
});

// app.delete("/pets/:id",async (req,resp)=>{
//     const result=await Pet.deleteOne({_id:eq.params.id});
//     resp.send(result);
// });

// app.get("/pets/:id", async (req, resp) => {
//     const result = await Pet.findOne({ _id:req.params.id });
//     if (result) {
//         resp.send(result);
//     }
//     else {
//         resp.send({ result: "No result found" });
//     }
// });

// app.get("/search/:key",async (req,resp)=>{
//     let result=await Pet.find({
//         "$or":[
//             {name:{$regex:req.params.key}},
//             {type:{$regex:req.params.key}},
//             {breed:{$regex:req.params.key}},
//             //{price:{$regex:req.params.key}}

//         ]
//     });
//     resp.send(result);

// });

function verifyToken(req,resp,next){
    let token=req.headers['authorization'];
    if(token)
    {
        token=token.split(' ')[1];
        //console.warn("middleware called if",token);
        Jwt.verify(token,jwtKey,(err,valid)=>{
            if(err){
                resp.status(402).send({result:"Please provide valid token"});

            }else{
                next();
            }

        })
    }
    else{
        resp.status(403).send({result:"Please add token with headers"});

    }
    //console.warn("middleware called",token);
    next();

}


app.listen(5000, () => {
    console.log('Server is running on port 5000');
    console.log('working fine');
});