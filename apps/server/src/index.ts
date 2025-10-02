const env = process.env.NODE_ENV || 'development';

// Example: .env.development, .env.production, .env.test
require('dotenv').config({ path: `.env.${env}` });

import app from './app';
import "./db"

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log(`🚀 Server running at PORT: ${PORT}`);
});
