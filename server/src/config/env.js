import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;
const DB_POOL_MAX = Number(process.env.DB_POOL_MAX ?? 3);
const JWT_SECRET = process.env.JWT_SECRET;

export { PORT, DATABASE_URL, DB_POOL_MAX, JWT_SECRET };
