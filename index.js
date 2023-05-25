const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000 ;

const app = express();




// Middleware
const corsConfig = {
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  }
app.use(cors(corsConfig))
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
      /* await client.connect(); */

      const toysCollection = client.db('toysDB').collection('allToys');
      const blogsCollection = client.db('toysDB').collection('blogs');

      app.get('/toys', async(req, res) => {
        const toys = toysCollection.find();
        const result =  await toys.toArray();
        res.send(result)
      })

       /* ------------------Data Getting With Query----------- */
      app.get('/myToys', async(req, res) => {
        let query = {};
        if(req.query?.email){
          query = {sellerEmail : req.query.email}
        }
        const result =  await toysCollection.find(query).toArray();
        res.send(result)
      })
      /* ------------------Set limitation for all toy page----------- */
      app.get('/allToys', async(req, res) => {
        const limit = 20;
        const toys = toysCollection.find().limit(limit);
        const result =  await toys.toArray();
        res.send(result)
      })

       /* ------------------Blog Question and Answer----------- */
      app.get('/blogs', async(req, res) => {
        const blogs = blogsCollection.find();
        const result =  await blogs.toArray();
        res.send(result)
      })

      /* ------------------Get Single Toy Data----------- */
      app.get('/toyDetails/:id', async(req, res) => {
        const iD = req.params.id;
        const query = {_id: new ObjectId(iD)};
        const result = await toysCollection.findOne(query);
        res.send(result)
      })

      /* ------------------POST An Item ----------- */
      app.post( '/addAToy', async(req, res) => {
        const newToy = req.body;
        const result = await toysCollection.insertOne(newToy);
        res.send(result)
  
      })

     /* ------------------Update An Item ----------- */
     app.patch('/updateToy/:id', async(req, res) => {
      const iD = req.params.id;
      const updatedToy = req.body;
      const { price, quantity, details } = updatedToy;
      const filter = {_id : new ObjectId(iD)};
      const options = { upsert: true };

      const updateDoc = {
        $set: {
          price, 
          quantity,
          details

        },
      };

      const result = await toysCollection.updateOne(filter, updateDoc, options);
      res.send(result)
      
    })


      /* ------------------Delete An Item ----------- */
      app.delete ('/toy/:id', async(req, res) => {
        const iD = req.params.id;
        const query = {_id: new ObjectId(iD)};
        const result = await toysCollection.deleteOne(query);
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