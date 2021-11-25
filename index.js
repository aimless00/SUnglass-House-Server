const express = require('express')
const app = express();
const { MongoClient } = require('mongodb');
const cors = require('cors')
require('dotenv').config();
const Objectid = require('mongodb').ObjectId;


const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jam0x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("sunglasses");
        const sunglassCollection = database.collection("product");
        const myOrderCollection = database.collection("MyOrder");
        const usersCollection = database.collection('users');
        const reviewCollection = database.collection('reviews');

        app.get('/products', async (req, res) => {
            const cursor = sunglassCollection.find({});
            const product = await cursor.toArray();
            res.send(product)
        });

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: Objectid(id) };
            const result = await sunglassCollection.findOne(query)
            res.send(result)

        })

        app.post('/myOrders', async (req, res) => {
            const newOrders = req.body;
            const result = await myOrderCollection.insertOne(newOrders);
            res.send(result)
        })

        app.get('/myOrders', async (req, res) => {
            const cursor = myOrderCollection.find({});
            const order = await cursor.toArray();
            res.send(order)
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(user)
            res.send(result)
        })

        app.get('/users', async (req, res) => {
            const users = usersCollection.find({})
            const result = await users.toArray();
            res.send(result)
        })
        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            const result = await sunglassCollection.insertOne(newProduct)
            console.log(result);
            res.send(result)
        })

        //Delete api
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: Objectid(id) };
            const result = await sunglassCollection.deleteOne(query);
            res.send(result)
        });

        app.delete('/myOrders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: Objectid(id) };
            const result = await myOrderCollection.deleteOne(query);
            res.send(result)
        });

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'Admin') {
                isAdmin = true
            }
            res.send({ admin: isAdmin })
        })
        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result)
        })

        app.get('/review', async (req, res) => {
            const review = reviewCollection.find({})
            const result = await review.toArray()
            res.send(result)
        })

        //update status
        app.put('/myOrders/:id', async (req, res) => {
            const id = req.params.id;
            const upDateStatus = req.body;
            const result = myOrderCollection.updateOne({ _id: Objectid(id) }, {
                $set: {
                    status: upDateStatus.status
                }
            })
            res.send(result)
        })
        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const makeAdmin = req.body;
            const result = usersCollection.updateOne({ _id: Objectid(id) }, {
                $set: {
                    role: makeAdmin.role
                }
            })
            res.send(result)
        })


    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Welcome My server site!')
})

app.listen(port, () => {
    console.log(` listening at ${port}`)
})