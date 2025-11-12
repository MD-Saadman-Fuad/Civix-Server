const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 3000;


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
            const cursor = issuesCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/issues/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const issue = await issuesCollection.findOne(query);
            res.send(issue);
        });

        app.post('/issues', async (req, res) => {
            const newIssue = req.body;
            const result = await issuesCollection.insertOne(newIssue);
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