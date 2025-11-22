const mongoose = require('mongoose');
require('dotenv').config();

const foodItems = [
    {
        "CategoryName": "Biryani/Rice",
        "name": "Chicken Biryani",
        "img": "https://firebasestorage.googleapis.com/v0/b/food-delivery-37c59.appspot.com/o/images%2Fchicken-biryani.jpg?alt=media",
        "options": [
            {
                "half": "130",
                "full": "220"
            }
        ],
        "description": "Made with Indian spices, rice, and chicken"
    },
    {
        "CategoryName": "Biryani/Rice",
        "name": "Veg Biryani",
        "img": "https://firebasestorage.googleapis.com/v0/b/food-delivery-37c59.appspot.com/o/images%2Fveg-biryani.jpg?alt=media",
        "options": [
            {
                "half": "110",
                "full": "200"
            }
        ],
        "description": "Fragrant rice with mixed vegetables"
    },
    {
        "CategoryName": "Starter",
        "name": "Paneer Tikka",
        "img": "https://firebasestorage.googleapis.com/v0/b/food-delivery-37c59.appspot.com/o/images%2Fpaneer-tikka.jpg?alt=media",
        "options": [
            {
                "half": "120",
                "full": "200"
            }
        ],
        "description": "Grilled cottage cheese with spices"
    },
    {
        "CategoryName": "Pizza",
        "name": "Margherita Pizza",
        "img": "https://firebasestorage.googleapis.com/v0/b/food-delivery-37c59.appspot.com/o/images%2Fmargherita-pizza.jpg?alt=media",
        "options": [
            {
                "regular": "200",
                "medium": "350",
                "large": "500"
            }
        ],
        "description": "Classic pizza with tomato and cheese"
    }
];

const categories = [
    {
        "CategoryName": "Biryani/Rice"
    },
    {
        "CategoryName": "Starter"
    },
    {
        "CategoryName": "Pizza"
    }
];

async function initDB() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing collections
        await mongoose.connection.db.collection('food_items').deleteMany({});
        await mongoose.connection.db.collection('Categories').deleteMany({});

        // Insert new data
        await mongoose.connection.db.collection('food_items').insertMany(foodItems);
        await mongoose.connection.db.collection('Categories').insertMany(categories);

        console.log('Database initialized with sample data');
        mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

initDB();