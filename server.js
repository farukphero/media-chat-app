const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 8000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

require("dotenv").config();

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@clusterfit.lgaupy2.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});


async function run() {
  try {
    const usersCollection = client.db("fitlessian").collection("User");
    const messagesCollection = client.db("fitlessian").collection("messages");
    // const sendRequestCollection = client.db("fitlessian").collection("friendRequest");
    

    app.get("/users", async (req, res) => {
        const query=req.body;
      const result = await usersCollection.find(query).toArray();
      res.send(result);
    });
    
    app.post("/messages", async (req, res) => {
      const msg = req.body;
      const result = await messagesCollection.insertOne(msg);
      console.log(result);
      res.send(result);
    });

    app.get('/getMessages/:userId/:friendId',async(req,res)=>{
      const userId=req.params.userId;
      const friendId=req.params.friendId;
      const allMessages =await messagesCollection.find().toArray();
      const result=allMessages.filter(msg=>(msg.currentUserId===userId && msg.currentFrndId===friendId)||(msg.currentUserId===friendId && msg.currentFrndId===userId));
      res.send(result);

    })

 



  } finally {

  }
}
run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Start fitlessian");
});





app.listen(port, () => {
  console.log(`this server is running on ${port}`);
});
