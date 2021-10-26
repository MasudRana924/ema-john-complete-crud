const express = require('express')
const { MongoClient, CURSOR_FLAGS } = require('mongodb');
const cors = require('cors');
const { application } = require('express');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000
// middleware 
app.use(cors())
app.use(express.json())
// user :emaJohnDb pass :r8Ukyk6YCgrALtB3
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hrpwo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        const database = client.db('onlineshop')
        // products connection
        const productsCollection = database.collection('products')
        // order connection
        const ordersCollection = database.collection('orders')
        //  get api
        app.get('/products', async (req, res) => {
            console.log(req.query)
            const cursor = productsCollection.find({})
            const page = req.query.page
            const size = parseInt(req.query.size)
            let products;
            const count = await cursor.count()
            if (page) {
                products = await cursor.skip(page * size).limit(size).toArray()
            }
            else {
                const products = await cursor.toArray()
            }


            res.send({
                count,
                products
            })
        })
        // post api keys e data pawar jonno
        app.post('/products/bykeys', async (req, res) => {
            console.log(req.body)
            const keys = req.body
            const query = { key: { $in: keys } }
            const products = await productsCollection.find(query).toArray()
            res.json(products)
           
        })
        // orders 
      app.post('/orders',async(req,res)=>{
          const order=req.body 
          const result=await ordersCollection.insertOne(order)
          res.json(result)
      })


    }
    finally {

    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Ema-John is running under server')
})
app.listen(port, () => {
    console.log("server is running on", port)
})