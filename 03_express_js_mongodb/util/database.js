const {MongoClient, ServerApiVersion} = require('mongodb');

const {
    DATABASE_CLUSTER,
    DATABASE_USER,
    DATABASE_PASSWORD,
} = process.env;

const uri = `mongodb+srv://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_CLUSTER}.pir1igl.mongodb.net/?retryWrites=true&w=majority&appName=${DATABASE_CLUSTER}`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


let db;

const run = async callback => {
    // Connect the client to the server	(optional starting in v4.7)
    try {
        await client.connect();
        db = client.db("node-js-test");
        await db.command({ping: 1});
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        callback();
    } catch (e) {
        console.error(e);
    }
}

const getDb = () => {
    if (db) {
        return db;
    }
    throw 'No database found!';
};

// run().catch(console.dir);

exports.getDb = getDb;
exports.run = run;