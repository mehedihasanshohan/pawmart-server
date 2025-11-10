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
    const allcategory = db.collection('allcategory')

    // find all listing data from mongodb
     app.get('/listings', async (req, res) => {
      try {
        // const cursor = listingCollection.find();
        const cursor = allcategory.find();
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
        // const listings = await listingCollection.find(query).toArray();
        const listings = await allcategory.find(query).toArray();
        res.json(listings);
      } catch (error) {
        console.error('Error fetching category listings:', error);
        res.status(500).json({ message: 'Error fetching category listings' });
      }
    });

    // Get recent 6 listings
    app.get('/listings/recent', async (req, res) => {
      try {
        const listings = await allcategory
          .find()
          .sort({ date: -1 })
          .limit(6)
          .toArray();
        res.json(listings);
      } catch (error) {
        console.error('Error fetching recent listings:', error);
        res.status(500).json({ message: 'Error fetching recent listings' });
      }
    });


     // Get Single Listing Details (for “See Details”)
    // app.get('/listing/:id', async (req, res) => {
    //   try {
    //     const id = req.params.id;
    //     const listing = await allcategory.findOne({ _id: new ObjectId(id) });
    //     res.json(listing);
    //   } catch (error) {
    //     console.error('Error fetching listing details:', error);
    //     res.status(500).json({ message: 'Error fetching listing details' });
    //   }
    // });


     app.get('/listing/:id', async (req, res) => {
      try {
        const id = req.params.id;
      
        const listing = await allcategory.findOne({ _id: id });
        if (!listing) return res.status(404).json({ message: 'Listing not found' });
      
        res.json(listing);
      } catch (error) {
        console.error('Error fetching listing details:', error);
        res.status(500).json({ message: 'Error fetching listing details' });
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