const env = process.env.NODE_ENV || 'development';
require('dotenv').config({ path: `.env.${env}` });
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { users } from '../modules/users/schema/user.schema';
import { products } from '../modules/products/schema/product.schema';
import { eq } from 'drizzle-orm';

// Setup your DB connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!
});

const db = drizzle(pool);

async function seedUsers() {
  const [adminUser] = await db.select().from(users).where(eq(users.role, "admin"));

  if (!adminUser) {
    console.log('No admin user found, run `pnpm seed:users`');
    process.exit(0);
  }

  await db.insert(products).values([
   {
      name: 'Classic White T-Shirt',
      description: 'Soft and comfortable cotton T-shirt.',
      price: "19.99",
      stock: 100,
      category: 'Clothing',
      brand: 'Kenkeputa',
      imageUrl: 'https://media.istockphoto.com/id/934203126/photo/blank-white-t-shirt-mock-up-on-wooden-hanger-front-and-rear-side-view.jpg?s=1024x1024&w=is&k=20&c=GKm4Z8Fywx5w9h2VOfCPKNfEo_rxWBgEqQeN3mrDYUE=',
      imageUrl1: 'https://media.istockphoto.com/id/934213808/photo/black-t-shirt-mock-up-on-wooden-hanger-rear-side-view.jpg?s=1024x1024&w=is&k=20&c=EkJigQmZAXkiBecJKcp-eRWXQKJToVTdo1WaVKAL3SM=',
      imageUrl2: 'https://media.istockphoto.com/id/934203126/photo/blank-white-t-shirt-mock-up-on-wooden-hanger-front-and-rear-side-view.jpg?s=1024x1024&w=is&k=20&c=GKm4Z8Fywx5w9h2VOfCPKNfEo_rxWBgEqQeN3mrDYUE='
    },
    {
      name: 'Running Sneakers',
      description: 'Lightweight and stylish running sneakers.',
      price: "59.99",
      stock: 50,
      category: 'Footwear',
      brand: 'Speedster',
      imageUrl: 'https://media.istockphoto.com/id/1249496770/photo/running-shoes.jpg?s=1024x1024&w=is&k=20&c=pvn3pnD5rbSz7LT1zbCkgMd6PyEXeo7QdzjDCRNHunI=',
      imageUrl1: 'https://media.istockphoto.com/id/1249496770/photo/running-shoes.jpg?s=1024x1024&w=is&k=20&c=pvn3pnD5rbSz7LT1zbCkgMd6PyEXeo7QdzjDCRNHunI=',
      imageUrl2: 'https://media.istockphoto.com/id/1249496770/photo/running-shoes.jpg?s=1024x1024&w=is&k=20&c=pvn3pnD5rbSz7LT1zbCkgMd6PyEXeo7QdzjDCRNHunI='
    },
    {
      name: 'Leather Wallet',
      description: 'Premium quality leather wallet for everyday use.',
      price: "39.99",
      stock: 30,
      category: 'Accessories',
      brand: 'LeatherCo',
      imageUrl: 'https://media.istockphoto.com/id/180756294/photo/wallet.jpg?s=612x612&w=0&k=20&c=sc6I6KsEbiv9Y4BtKji8w5rBYono2X63-ipfhYk6Ytg=',
    },
    {
      name: 'Bluetooth Headphones',
      description: 'Wireless over-ear headphones with deep bass.',
      price: "89.99",
      stock: 40,
      category: 'Electronics',
      brand: 'SoundMax',
      imageUrl: 'https://media.istockphoto.com/id/1412240771/photo/headphones-on-white-background.jpg?s=1024x1024&w=is&k=20&c=UyOQrYwxx61kI5TwmTCye0UUvDakbeR9W_jWk1AU0Fk=',
    },

    {
      name: 'Smartwatch',
      description: 'Track your fitness and notifications on the go.',
      price: "129.99",
      stock: 25,
      category: 'Electronics',
      brand: 'TechTime',
      imageUrl: 'https://media.istockphoto.com/id/2197192316/photo/smart-watch-with-with-heart-pulse-monitoring-on-screen-isolated-on-grey-digital-smartwatch.jpg?s=1024x1024&w=is&k=20&c=eIGWO2ZyR1xwPkDR90AW93d776vFA0c81qQLgVw41nI=',
    },

    {
      name: 'Denim Jeans',
      description: 'Classic slim-fit denim jeans for men.',
      price: "49.99",
      stock: 60,
      category: 'Clothing',
      brand: 'DenimWorks',
      imageUrl: 'https://media.istockphoto.com/id/186870715/photo/blue-jeans.jpg?s=1024x1024&w=is&k=20&c=8-g8jkDtNOYnC4mnkDVY0DSDpR5hpVPxlKMAAMsGUuM=',
    },
    
  ]);

  console.log('Products seeded successfully');
  process.exit(0);
}

seedUsers().catch((err) => {
  console.error('Error seeding products:', err);
  process.exit(1);
});
