const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;
const cors = require("cors");
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// ..................................mongodb...................................

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.221bse0.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const brandCollection = client.db("brandDB").collection("brand");

    const addToCartCollection = client.db("brandDB").collection("cart");

    //cart data added
    app.post("/cart", async (req, res) => {
      const newCart = req.body;
      console.log(newCart);
      const result = await addToCartCollection.insertOne(newCart);
      res.send(result);
    });

    // cart data read
    app.get("/cart", async (req, res) => {
      const result = await addToCartCollection.find().toArray();
      res.send(result);
    });

    app.get("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await brandCollection.findOne(query);
      res.send(result);
    });

    //update data
    app.put("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const data = req.body;
      const updatedData = {
        $set: {
          image: data.image,
          name: data.name,
          brandname: data.brandname,
          type: data.type,
          price: data.price,
          shortdescription: data.shortdescription,
          rating: data.rating,
        },
      };
      const result = await brandCollection.updateOne(
        filter,
        updatedData,
        options
      );
      res.send(result);
    });

    //cart data delete
    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = {
        _id: id,
      };
      const result = await addToCartCollection.deleteOne(query);
      res.send(result);
    });


    // brand data ............................

    //add product
    app.post("/brand", async (req, res) => {
      const newBrand = req.body;
      console.log(newBrand);
      const result = await brandCollection.insertOne(newBrand);
      res.send(result);
    });

    //read data
    app.get("/brand", async (req, res) => {
      const query = req.params.id;
      console.log(query);
      const cursor = brandCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/brand/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await brandCollection.findOne(query);
      res.send(result);
    });



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("brand shop is running.");
});

app.listen(port, () => {
  console.log(`brand shop server is running on ${port}`);
});
