const mongoose = require('mongoose');
require('dotenv').config();

const foodItems = [
  {
    CategoryName: 'Biryani/Rice',
    name: 'Chicken Biryani',
    img: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg',
    options: [{ half: '130', full: '220' }],
    description: 'Made with Indian spices, rice, and chicken',
  },
  {
    CategoryName: 'Biryani/Rice',
    name: 'Mutton Biryani',
    img: 'https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg',
    options: [{ half: '150', full: '260' }],
    description: 'Aromatic rice with tender mutton pieces',
  },
  {
    CategoryName: 'Biryani/Rice',
    name: 'Jeera Rice',
    img: 'https://www.indianhealthyrecipes.com/wp-content/uploads/2022/12/jeera-rice-recipe.jpg',
    options: [{ half: '95', full: '160' }],
    description: 'Fragrant rice tempered with cumin seeds',
  },
  {
    CategoryName: 'Biryani/Rice',
    name: 'Veg Biryani',
    img: 'https://www.madhuseverydayindian.com/wp-content/uploads/2022/11/easy-vegetable-biryani.jpg',
    options: [{ half: '110', full: '200' }],
    description: 'Fragrant rice with mixed vegetables',
  },
  {
    CategoryName: 'Starter',
    name: 'Paneer Tikka',
    img: 'https://tse2.mm.bing.net/th/id/OIP.-ndMbbnDa5vPzgLYrBbLMgHaE7?rs=1&pid=ImgDetMain&o=7&rm=3',
    options: [{ half: '120', full: '200' }],
    description: 'Grilled cottage cheese with spices',
  },
  {
    CategoryName: 'Starter',
    name: 'Manchurian',
    img: 'https://tse3.mm.bing.net/th/id/OIP.04mAvEizx-pyvRM2v8a80wHaFR?rs=1&pid=ImgDetMain&o=7&rm=3',
    options: [{ half: '110', full: '190' }],
    description: 'Indo-Chinese style vegetable manchurian',
  },
  {
    CategoryName: 'Pizza',
    name: 'Margherita Pizza',
    img: 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg',
    options: [{ regular: '200', medium: '350', large: '500' }],
    description: 'Classic pizza with tomato and cheese',
  },
  {
    CategoryName: 'Pizza',
    name: 'Pepperoni Pizza',
    img: 'https://images.pexels.com/photos/803290/pexels-photo-803290.jpeg',
    options: [{ regular: '250', medium: '380', large: '550' }],
    description: 'Pizza topped with pepperoni and cheese',
  },
  {
    CategoryName: 'Starter',
    name: 'Spring Rolls',
    img: 'https://www.connoisseurusveg.com/wp-content/uploads/2022/04/baked-spring-rolls-sq.jpg',
    options: [{ half: '80', full: '140' }],
    description: 'Crispy vegetable spring rolls',
  },
  {
    CategoryName: 'Main Course',
    name: 'Butter Chicken',
    img: 'https://vismaifood.com/storage/app/uploads/public/ad2/3c9/7ee/thumb__1200_0_0_0_auto.jpg',
    options: [{ half: '180', full: '300' }],
    description: 'Creamy tomato based chicken curry',
  },
  {
    CategoryName: 'Main Course',
    name: 'Paneer Butter Masala',
    img: 'https://img.freepik.com/premium-photo/delicious-paneer-butter-masala-photography_928503-851.jpg?w=2000',
    options: [{ half: '160', full: '280' }],
    description: 'Rich and creamy paneer curry',
  },
  {
    CategoryName: 'Chinese',
    name: 'Hakka Noodles',
    img: 'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg',
    options: [{ half: '120', full: '200' }],
    description: 'Stir-fried noodles with vegetables',
  },
  {
    CategoryName: 'Chinese',
    name: 'Fried Rice',
    img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZnJpZWQlMjByaWNlfGVufDB8fDB8fHww&fm=jpg&q=60&w=3000',
    options: [{ half: '110', full: '190' }],
    description: 'Wok-tossed rice with vegetables and sauces',
  },
  {
    CategoryName: 'Dessert',
    name: 'Gulab Jamun',
    img: 'https://www.funfoodfrolic.com/wp-content/uploads/2020/07/Gulab-Jamun-Thumbnail.jpg',
    options: [{ half: '80', full: '150' }],
    description: 'Sweet milk-solid balls in sugar syrup',
  },
  {
    CategoryName: 'Dessert',
    name: 'Ice Cream',
    img: 'https://images.pexels.com/photos/28309088/pexels-photo-28309088.jpeg?cs=srgb&dl=pexels-barbland-28309088.jpg&fm=jpg',
    options: [{ single: '60', double: '100' }],
    description: 'Creamy vanilla ice cream with chocolate sauce',
  },
  {
    CategoryName: 'Beverages',
    name: 'Cold Coffee',
    img: 'https://myfoodstory.com/wp-content/uploads/2022/04/Cold-Coffee-3-ways.jpg',
    options: [{ regular: '80', large: '120' }],
    description: 'Chilled coffee with ice cream',
  },
  {
    CategoryName: 'Beverages',
    name: 'Masala Chai',
    img: 'https://static.toiimg.com/photo/69027255.cms',
    options: [{ regular: '30', large: '50' }],
    description: 'Indian spiced tea',
  },
];

const categories = [
  { CategoryName: 'Biryani/Rice' },
  { CategoryName: 'Starter' },
  { CategoryName: 'Pizza' },
  { CategoryName: 'Main Course' },
  { CategoryName: 'Chinese' },
  { CategoryName: 'Dessert' },
  { CategoryName: 'Beverages' },
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing collections
    await mongoose.connection.db.collection('food_items').deleteMany({});
    await mongoose.connection.db.collection('Categories').deleteMany({});

    // Insert new data
    await mongoose.connection.db.collection('food_items').insertMany(foodItems);
    await mongoose.connection.db.collection('Categories').insertMany(categories);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDB();