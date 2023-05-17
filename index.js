const express= require("express");
const app= express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port= process.env.PORT || 5000;
var cors= require('cors');
const { response } = require("express");

require("dotenv").config();
app.use(cors());
app.use(express.json());

app.get('/', (req, res)=>{
    res.send('CRUD api is running');
});


const uri = `mongodb+srv://${process.env.dbUser}:${process.env.password}@database.sgb0d3l.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log(uri);

async function run(){
    try{
        const studentsInfo= client.db("student-form").collection("students-info");
    
        app.post('/info', async(req,res)=>{
            const informations=req.body;
            const push= await studentsInfo.insertOne(informations);
            res.send(push);
          });
        
          app.get('/info', async(req, res) =>{
            const query = {  };
            const cursor = studentsInfo.find(query);
            const getInfo= await cursor.toArray();
            res.send(getInfo); 
           });

           app.patch('/info/:id',  async (req, res) => {
            const id = req.params.id;
            const filter ={_id: new ObjectId(id)};
            const address1 = req.body.address1;
            const address2 = req.body.address2;
            const city = req.body.city;
            const updateInfo = {
                $set: {
                    address1: address1,
                    address2: address2,
                    city: city
                }
            }
            const result = await studentsInfo.updateOne(filter, updateInfo);
            res.send(result);
        })

           app.delete('/info/:id', async(req,res)=>{
            const id= req.params.id;
            const query={ _id: new ObjectId(id) };
            const remaining= await studentsInfo.deleteOne(query);
            res.send(remaining);
          });
      
    }
    
    finally {}
    
}
run().catch(err=> console.log(err));




app.listen(port, ()=>{
    console.log(`CRUD api is running at port: ${port}`);
});