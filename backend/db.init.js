const mongoose = require('mongoose');
require('dotenv').config();

const foodItems = [
    {
        "CategoryName": "Biryani/Rice",
        "name": "Chicken Biryani",
        "img": "https://source.unsplash.com/random/900x700/?biryani",
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
        "img": "https://source.unsplash.com/random/900x700/?vegetable-biryani",
        "options": [
            {
                "half": "110",
                "full": "200"
            }
        ],
        "description": "A vegetarian version of the classic biryani"
    },
    {
        "CategoryName": "Starter",
        "name": "Paneer Tikka",
        "img": "https://source.unsplash.com/random/900x700/?paneer-tikka",
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
        "img": "https://source.unsplash.com/random/900x700/?pizza",
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
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        
        // Clear existing collections
        await db.collection('food_items').deleteMany({});
        await db.collection('Categories').deleteMany({});

        // Insert new data
        await db.collection('food_items').insertMany(foodItems);
        await db.collection('Categories').insertMany(categories);

        console.log('Sample data inserted successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

initDB();