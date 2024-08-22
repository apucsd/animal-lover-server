const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const { MongoClient } = require("mongodb");
const port = 5000;

// middleware
app.use(express.json());
app.use(cors());

const uri = process.env.URI;

// Create a new MongoClient
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  const db = client.db("antopolis");
  const categoriesCollection = db.collection("categories");
  const animalsCollection = db.collection("animals");
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();
    // Send a ping to confirm a successful connection

    app.get("/categories", async (req, res) => {
      try {
        const result = await categoriesCollection.find().toArray();
        res.status(201).json(result);
      } catch (error) {
        res.status(500).json({ message: "Error get category" });
      }
    });
    app.post("/categories", async (req, res) => {
      try {
        const name = req.body.name.toLowerCase();
        const newCategory = {
          name,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const result = await categoriesCollection.insertOne(newCategory);
        res.status(201).json(result);
      } catch (error) {
        res.status(500).json({ message: "Error adding category" });
      }
    });

    ///////////animals
    app.get("/animals", async (req, res) => {
      try {
        const result = await animalsCollection.find().toArray();
        res.status(201).json(result);
      } catch (error) {
        res.status(500).json({ message: "Error get animals" });
      }
    });
    app.get("/animals/category/:category", async (req, res) => {
      try {
        const category = req.params.category;
        const result = await animalsCollection.find({ category }).toArray();
        res.status(201).json(result);
      } catch (error) {
        res.status(500).json({ message: "Error get animals" });
      }
    });
    app.post("/animals", async (req, res) => {
      try {
        const animalData = req.body;

        const newData = {
          name: animalData.name.toLowerCase(),
          category: animalData.category,
          image: animalData.image,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const result = await animalsCollection.insertOne(newData);
        res.status(201).json(result);
      } catch (error) {
        res.status(500).json({ message: "Error adding category" });
      }
    });

    ////////
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
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
