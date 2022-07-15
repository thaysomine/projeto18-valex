import dotenv from "dotenv";
import pg from "pg";
dotenv.config();

const { Pool } = pg;
const connection = new Pool({
	connectionString: process.env.DATABASE_URL,
	...(process.env.PROD_MODE && {
		ssl: { rejectUnauthorized: false },
	}),
})