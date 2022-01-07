const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient } = require("mongodb");
const port = process.env.PORT || 5000;

///// MIDDLEWARE ////
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ttyfb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db("luxury_living");
    const servicesCollection = database.collection("services");
    const usersCollection = database.collection("users");

    /// GET API SERVICES ///
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const service = await cursor.toArray();
      res.send(service);
    });
    ///// GET POST LOGIN-REGISTER USERS /////
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });

    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("LIVING_SERVER 5000");
});

app.listen(port, () => {
  console.log("Good Server", port);
});
