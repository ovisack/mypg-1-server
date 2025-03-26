const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 1010;  
app.use(cors()); 
app.use(express.json());

// console.log(process.env.DB_PASS);

// console.log(process.env.DB_USER);
// const uri = "mongodb+srv://royavishek306:<db_password>@project-2.94xnz.mongodb.net/?appName=project-2";

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@project-2.94xnz.mongodb.net/?retryWrites=true&w=majority&appName=project-2`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const database = client.db("usersDB");
    const usersCollection = database.collection("users");

    app.get("/users", async (req, res) => {

     
      const cursor=usersCollection.find()

      const result=await cursor.toArray()
      res.send(result)

    })

    app.post('/users', async (req, res) => {
      const user = req.body;
      console.log("new user", user);
      const result = await usersCollection.insertOne(user);

      res.send(result);
    })

    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      console.log('update data ', id);

      const query = { _id: new ObjectId(id) }
      const users = await usersCollection.findOne(query);
      res.send(users)

    })

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;

      console.log("please delete from database", id);

      const query = { _id: new ObjectId(id) }

      const result = await usersCollection.deleteOne(query);

      res.send(result)


    })

    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      console.log("ami tike aci req body ", req.body);
      console.log(id, user);

      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updates = {
        $set: {
          name: user.name,
          email: user.email,
          ago: user.ago,
          photoUrl: user.photoUrl,
        }
      }

      const result = await usersCollection.updateOne(filter, updates, option);
      res.send(result)
    }
    )


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });


    console.log("Pinged your deployment. You successfully connected to MongoDB ----! ");




  } catch (error) {
    console.error(" Error inserting user:", error);
    // res.status(500).send({ error: "Failed to insert user" });
  }
}
run().catch(console.dir);




app.get("/", (req, res) => {
  res.send('ami ovisack roy')
})




app.listen(port, () => {

  console.log(`ami port canet pai ci PORT${port}`);

})










