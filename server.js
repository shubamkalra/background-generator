const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const url = "mongodb://localhost:27017";

app.get("/portfolio", (req, res) => {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;

        const dbo = db.db("myDatabase");

        //The first parameter of the find() method is a query object - An empty query object selects all documents in the collection.
        // toArray() method returns an array that has all the documents of a Mongo collection
        dbo.collection("portfoliodata").find({}).toArray((error, result) => {
            if (error) {
                res.send("Error", error);
                return;
            }
            res.send(JSON.stringify(result));
            db.close();
        });
    });
});

app.post('/portfolio', (req, res) => {
    const full_name = req.body.full_name;
    const email = req.body.email;
    const message = req.body.message;

    console.log(full_name, email, message);
    const myObj = { full_name: full_name, email: email, message: message };

    MongoClient.connect(url, (err, db) => {
        if (err) throw err;

        const dbo = db.db("myDatabase");
        
        dbo.collection("portfoliodata").insertOne(myObj, (error, result) => {
            if (error) {
                res.send("Error", error);
                return;
            }
            res.send(result);
            db.close();
        });
    });
});
const PORT= process.env.PORT
app.listen(PORT, () => {
    console.log(`The server is up and running on port ${PORT}`);
})
console.log(PORT);