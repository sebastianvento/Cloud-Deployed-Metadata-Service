import dotenv from "dotenv";
import pg from 'pg';
import { Pool } from 'pg'

// Load environment variables
dotenv.config();

// Creating a pool
const pool = new Pool();

export default pool;