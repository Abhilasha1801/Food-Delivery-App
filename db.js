const mongoose = require('mongoose')
require('dotenv').config();
// Prefer IPv4 loopback to avoid IPv6 (::1) connection issues on some Windows setups
let mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fooddelivery'
if (mongoURI.includes('localhost')) {
    mongoURI = mongoURI.replace('localhost', '127.0.0.1')
}
// mongodb://<username>:<password>@merncluster-shard-00-00.d1d4z.mongodb.net:27017,merncluster-shard-00-01.d1d4z.mongodb.net:27017,merncluster-shard-00-02.d1d4z.mongodb.net:27017/?ssl=true&replicaSet=atlas-eusy5p-shard-0&authSource=admin&retryWrites=true&w=majority
module.exports = function (callback) {
    mongoose.connect(mongoURI, { useNewUrlParser: true }, async (err, result) => {
        // mongoDbClient.connect(mongoURI, { useNewUrlParser: true }, async(err, result) => {
        if (err) console.log("---" + err)
        else {
            // var database =
            console.log("connected to mongo")
            const foodCollection = await mongoose.connection.db.collection("food_items");
            foodCollection.find({}).toArray(async function (err, data) {
                if (err) {
                    console.error("Error fetching food items:", err);
                    callback(err, null, null);
                    return;
                }
                // Process and validate each item's data
                data = data.map(item => {
                    // Ensure item has all required fields
                    const processedItem = {
                        ...item,
                        name: item.name || 'Unknown Item',
                        CategoryName: item.CategoryName || 'Other',
                        options: item.options || [{ regular: "0" }]
                    };

                    // Handle image URL
                    if (!item.img || !item.img.startsWith('http')) {
                        // Create a food-specific image URL
                        const searchQuery = encodeURIComponent(`${item.name},${item.CategoryName},food`);
                        processedItem.img = `https://source.unsplash.com/featured/?${searchQuery}`;
                    }

                    return processedItem;
                });
                
                const categoryCollection = await mongoose.connection.db.collection("Categories");
                categoryCollection.find({}).toArray(async function (err, Catdata) {
                    callback(err, data, Catdata);

                })
            });
            // listCollections({name: 'food_items'}).toArray(function (err, database) {
            // });
            //     module.exports.Collection = database;
            // });
        }
    })
};
