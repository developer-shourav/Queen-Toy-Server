const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000 ;

const app = express();




// Middleware
const corsConfig = {
  origin: '',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}
app.use(cors(corsConfig))
app.options("", cors(corsConfig))
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.evuna6q.mongodb.net/?retryWrites=true&w=majority`;

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
     /*  await client.connect(); */

      const toysCollection = client.db('toysDB').collection('allToys');
      const blogsCollection = client.db('toysDB').collection('blogs');

      app.get('/toys', async(req, res) => {
        const coffees = toysCollection.find();
        const result =  await coffees.toArray();
        res.send(result)
      })

      app.get('/blogs', async(req, res) => {
        const coffees = blogsCollection.find();
        const result =  await coffees.toArray();
        res.send(result)
      })
  
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
      /* await client.close(); */
    }
  }
  run().catch(console.dir);
  


app.get('/' , (req, res) => {
    res.send('Welcome to Our Queen Toy Server')
})




app.listen(port , () => {
    console.log(`Our Awesome Queen Toy is running On the PORT:${port}`);
})