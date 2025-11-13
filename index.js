const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.5yczeea.mongodb.net/?appName=Cluster0`;

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
    // await client.connect();

    const db = client.db('listingdb')
    const listingCollection = db.collection('listings')
    const allcategory = db.collection('allcategory')
    const ordersCollection = db.collection('orders');
    const mylistingscollection = db.collection('mylistings')


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


   // Search listings by name (case-insensitive)
    app.get('/search', async (req, res) => {
      try {
        const search_text = req.query.search || "";

        const query = search_text
          ? { name: { $regex: search_text, $options: "i" } }
          : {};

        const result = await allcategory.find(query).toArray();
        res.status(200).json(result);
      } catch (error) {
        console.error("Error during search:", error);
        res.status(500).json({ message: "Error performing search" });
      }
    });







     app.get('/listing/:id', async (req, res) => {
      try {
        const id = req.params.id;

        const listing = await allcategory.findOne({ _id: id});
        if (!listing) return res.status(404).json({ message: 'Listing not found' });

        res.json(listing);
      } catch (error) {
        console.error('Error fetching listing details:', error);
        res.status(500).json({ message: 'Error fetching listing details' });
      }
    });




    app.post("/addlisting", async (req, res) => {
      try {
        const newListing = req.body;
        const result = await allcategory.insertOne(newListing);
        res.status(201).send(result);
        console.log(" Received new listing:", req.body);
        console.log(" Inserting into:", db.databaseName, "collection:", allcategory.collectionName);

      } catch (error) {
        console.error(error)
        res.status(500).send({ message: "Failed to save listing", error });
      }
    });


    // POST /orders - Submit a new order
    app.post('/orders', async (req, res) => {
     try {
     const order = req.body;

      if (!order.buyerName || !order.email || !order.productId) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const db = client.db('listingdb');

      const result = await ordersCollection.insertOne({
        ...order,
        createdAt: new Date()
      });

      res.status(201).json({ message: 'Order placed successfully', orderId: result.insertedId });
    } catch (error) {
      console.error('Error saving order:', error);
      res.status(500).json({ message: 'Failed to place order', error });
    }
  });




  // app.get('/myorders', async(req, res) => {
  //     const query= {};
  //     if(query.email){
  //       query.email = email;
  //       const cursor = ordersCollection.find(email);
  //       const result = await cursor.toArray();
  //       res.send(result);
  //     }
  //   })


    // Server.js - app.get('/myorders', ...)
    // Server.js - app.get('/myorders', ...) - FIX


    app.get('/myorders', async(req, res) => {
  try {
    const userEmail = req.query.email;
    if (!userEmail) {
      return res.status(400).send({ message: "Email query parameter is required" });
    }

    const query = { email: userEmail };
    const cursor = ordersCollection.find(query);
    const result = await cursor.toArray();
    res.send(result);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send({ message: "Failed to fetch orders" });
  }
});


   app.get('/mylistings', async(req, res) => {
    try {
    const userEmail = req.query.email;
    if (!userEmail) {
      return res.status(400).send({ message: "Email query parameter is required" });
    }

    const query = { email: userEmail };
    const cursor = allcategory.find(query);
    const result = await cursor.toArray();
    res.send(result);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).send({ message: "Failed to fetch user listings" });
  }
});

  // app.get('/mylistings', async(req, res) => {
  //     const query= {};
  //     if(query.email){
  //       query.email = email;
  //       const cursor = allcategory.find(email);
  //       const result = await cursor.toArray();
  //       res.send(result);
  //     }
  //   })





  // DELETE a listing by ID
    app.delete('/mylistings/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await allcategory.deleteOne(query);

        if (result.deletedCount === 0) {
          return res.status(404).json({ message: 'Listing not found' });
        }

        res.status(200).json({ message: 'Listing deleted successfully' });
      } catch (error) {
        console.error('Error deleting listing:', error);
        res.status(500).json({ message: 'Failed to delete listing' });
      }
    });




    // UPDATE a listing by ID
    app.put('/mylistings/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const updatedData = req.body;

        const query = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: {
            name: updatedData.name,
            category: updatedData.category,
            price: updatedData.price,
            location: updatedData.location,
            description: updatedData.description,
            image: updatedData.image,
            date: updatedData.date
          }
        };

        const result = await allcategory.updateOne(query, updateDoc);

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: 'Listing not found' });
        }

        res.status(200).json({ message: 'Listing updated successfully' });
      } catch (error) {
        console.error('Error updating listing:', error);
        res.status(500).json({ message: 'Failed to update listing' });
      }
    });










    // await client.db("pawmart").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);



// app.listen(port, () => {
//   console.log(`App listening on port ${port}`)
// })

const serverless = require('serverless-http');
module.exports = app;