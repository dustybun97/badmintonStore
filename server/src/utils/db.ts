// src/utils/db.ts
// import { Pool } from "pg";
// import dotenv from "dotenv";

// dotenv.config();

// export const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

import { Pool } from "pg";

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,  // สำหรับ RDS ไม่ต้อง verify cert
  },
});

// console.log("DB_HOST:", process.env.DB_HOST); // <-- ควรเห็นค่า host

