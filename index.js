const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json())

// 2L0y8sfPoBYbis7U
const uri = "mongodb+srv://pawmartDb:2L0y8sfPoBYbis7U@cluster0.5yczeea.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



app.get('/', (req, res) => {
  res.send('Server is running!')
})

async function run() {
  try {
    await client.connect();

    const db = client.db('listingdb')
    const listingCollection = db.collection('listings')

    // find all listing data from mongodb
     app.get('/listings', async (req, res) => {
      try {
        const cursor = listingCollection.find();
        const listings = await cursor.toArray();
        res.json(listings);
      } catch (error) {
        console.error(' Error fetching listings:', error);
        res.status(500).json({ message: 'Error fetching listings' });
      }
    });



    // Get filtered listings by category
    app.get('/listings/category/:category', async (req, res) => {
      try {
        const category = req.params.category;
        const query = { category: category };
        const listings = await listingCollection.find(query).toArray();
        res.json(listings);
      } catch (error) {
        console.error('Error fetching category listings:', error);
        res.status(500).json({ message: 'Error fetching category listings' });
      }
    });









    await client.db("pawmart").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})