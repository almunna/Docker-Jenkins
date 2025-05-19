const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;

const PORT = 5050;
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // for JSON POST bodies
app.use(express.static("public"));

const MONGO_URL = "mongodb://root:example@mongo:27017/?authSource=admin";


// GET all users
app.get("/getUsers", async (req, res) => {
    const client = new MongoClient(MONGO_URL);
    try {
        await client.connect();
        console.log("Connected successfully to MongoDB");

        const db = client.db("apnacollege-db");
        const users = await db.collection("users").find({}).toArray();

        res.send(users);
    } catch (err) {
        console.error("Error getting users:", err);
        res.status(500).send("Error connecting to database");
    } finally {
        await client.close();
    }
});

// POST new user
app.post("/addUser", async (req, res) => {
    const userObj = req.body;
    const client = new MongoClient(MONGO_URL);
    try {
        await client.connect();
        console.log("Connected successfully to MongoDB");

        const db = client.db("apnacollege-db");
        const result = await db.collection("users").insertOne(userObj);
        console.log("Inserted:", result.insertedId);

        res.send({ message: "User added successfully", id: result.insertedId });
    } catch (err) {
        console.error("Error adding user:", err);
        res.status(500).send("Error inserting to database");
    } finally {
        await client.close();
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
