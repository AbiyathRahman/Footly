const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.DATABASE_URL;

let _db;
let client;

module.exports = {
    connectToServer: function (callback) {
        console.log("Attempting to Connect");
        // Create a MongoClient with a MongoClientOptions object to set the Stable API version
        client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
        });

        async function run() {
            try {
                // Connect the client to the server	(optional starting in v4.7)
                await client.connect();
                // Send a ping to confirm a successful connection
                await client.db("admin").command({ ping: 1 });
                console.log(
                    "Pinged your deployment. You successfully connected to MongoDB!"
                );
                _db = client.db("FootLy");
                console.log("Successfully connected to FootLy collection");
                callback();
            } catch (error) {
                console.error("Connection error:", error);
                callback(error);
            }
        }
        run().catch(console.dir);
    },

    getDb: function () {
        return _db;
    },
};