const express =require("express");
const app =express();
const cors =require('cors')
var jwt = require('jsonwebtoken');

const port =process.env.PORT || 5000
app.use(cors())
app.use(express.json())
require('dotenv').config()

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4vajx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const run = async()=>{
try{
await client.connect()
const productCollection =client.db("laptop-stock").collection("laptop")
app.get('/product/:id',async(req,res) =>{
    const id =req.params.id;
    const query={_id:ObjectId(id)}
    const product =await productCollection.findOne(query)
    res.send(product)
})
app.delete("/delete/:id", async(req,res) =>{
    const id =req.params.id;
    const query ={_id:ObjectId(id)}
    const result = await productCollection.deleteOne(query)
    res.send(result)
})
app.get("/myitem", async(req,res) =>{
    const mainEmail =req.query;
// console.log()
const itemAuth =req.headers.authorization
const [a,accessToken] =itemAuth.split(" ")

const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRECT)
if(mainEmail.email==decoded.email){
    const cursor =productCollection.find(mainEmail)
    const products = await cursor.toArray()
    res.send(products)
}else{
    return res.status(401).send({ message: 'unauthorized access' });
}

console.log(decoded.email,mainEmail.email)
    // const query ={email:mainEmail}
//    console.log(query)
// // //    const query ={mainEmail}

//    console.log(products)
})
app.post("/products",async(req,res) =>{
    const newProduct =req.body;
    const tokenInfo =req.headers.authorization;
    console.log(tokenInfo)
    const [email,accessToken] =tokenInfo.split(" ")
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRECT)
    console.log(email,decoded.email)
    if(email === decoded.email){
        const result = await productCollection.insertOne(newProduct)
    res.send({success: "product uploded"})
    }else{
        return res.status(401).send({ message: 'unauthorized access' });
    }
    // const result = await productCollection.insertOne(newProduct)
    // res.send(result)
})
app.post('/login',(req,res) =>{
   const email =req.body;
   var token = jwt.sign(email, process.env.ACCESS_TOKEN_SECRECT);
   res.send({token:token})
   
})

// productincress
app.put('/productincress/:id',async(req,res) =>{
    const id =req.params.id;
    const data =req.body;
    console.log(data)
    const options ={upsert:true}

    console.log('update',data)
        const query={_id:ObjectId(id)}
        
    const updatedoc ={
            $set: {
                quantity:newQuantity
            }
        }
        const result =await productCollection.updateOne(query,updatedoc,options)

})
app.put('/product/:id',async(req,res) =>{
    const id =req.params.id;
    const data =req.body;
    console.log(data)
    const options ={upsert:true}

    console.log('update',data)
        const query={_id:ObjectId(id)}
        
    const updatedoc ={
            $set: {
                quantity:newQuantity
            }
        }
        const result =await productCollection.updateOne(query,updatedoc,options)

})
// app.put('/updateproduct/:id',async(req,res) =>{
//     const id =req.params.id;
//     const data =req.body;
//     console.log('update',data)
//     const query={_id:ObjectId(id)}
    
// const updatedoc ={
//         $set: {
//             quality:data
//         }
//     }
//     const result =await productCollection.updateOne(query,updatedoc)
// })
 
app.get('/products', async(req,res) =>{
     const query ={}
      const cursor =productCollection.find(query)
    const products = await cursor.toArray()
    res.send(products)
})
console.log("connected")




}

catch(error){

}



}
run().catch(console.dir)





app.get("/", (req,res) =>{
    res.send("started")
})

app.listen(port,() =>{
    console.log("run")
})


// assignment_user

// G3KtdMCCdee8AlFS