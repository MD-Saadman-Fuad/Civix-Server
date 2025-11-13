const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 3000;


app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@civixdb.rqfqgav.mongodb.net/?appName=civixDB`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});



app.get('/', (req, res) => {
    res.send('CIVIX Server is running');
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        //database setup
        const db = client.db('civixDB');
        const issuesCollection = db.collection('issues');
        const contributionCollection = db.collection('contributions');
        // const usersCollection = db.collection('users');

        //issues related APIs

        app.get('/issues', async (req, res) => {
            const email = req.query.email;
            const query = {};
            if (email) {
                query.email = email;
            }
            const cursor = issuesCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/issues/recent', async (req, res) => {
            const cursor = issuesCollection.find().limit(6);
            const result = await cursor.toArray();
            res.send(result);
        });



        app.get('/issues/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const issue = await issuesCollection.findOne(query);
            res.send(issue);
        });

        // app.get('/my-issues/:email', async (req, res) => {
        //     const email = req.params.email;
        //     const query = { email: email };
        //     const cursor = issuesCollection.find(query);
        //     const result = await cursor.toArray();
        //     res.send(result);
        // });

        // console.log(req.query);
        //     // Using query parameters to filter products by email
        //     const email = req.query.email;
        //     const query = {};
        //     if (email) {
        //         query.email = email;
        //     }

        //     const cursor = productsCollection.find(query);
        //     // const cursor = productsCollection.find().sort({ price_min: -1 }).skip(2).limit(5).project({ title: 1, price_min: 1 });
        //     const result = await cursor.toArray();
        //     res.send(result);

        app.post('/issues', async (req, res) => {
            const newIssue = req.body;
            const result = await issuesCollection.insertOne(newIssue);
            res.send(result);
        });

        app.put('/issues/:id', async (req, res) => {
            const id = req.params.id;
            const updatedIssue = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = { $set: updatedIssue };
            const result = await issuesCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });

        app.delete('/issues/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await issuesCollection.deleteOne(query);
            res.send(result);
        });

        //contribution related APIs


        app.get('/contributions', async (req, res) => {
            const cursor = contributionCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/contributions/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const contribution = await contributionCollection.findOne(query);
            res.send(contribution);
        });

        app.post('/contributions', async (req, res) => {
            const newContribution = req.body;
            const result = await contributionCollection.insertOne(newContribution);
            res.send(result);
        });

        app.delete('/contributions/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await contributionCollection.deleteOne(query);
            res.send(result);
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // Do NOT close the client here — we want the server to keep the DB connection
        // open while the process is running so route handlers can use `productsCollection`.
        // If you need to close on shutdown, handle it in a SIGINT/SIGTERM listener.
        // await client.close();
    }
}
run().catch(console.dir);







app.listen(port, () => {
    console.log(`CIVIX Server is running on port: ${port}`);
});