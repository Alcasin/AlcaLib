import pg from "pg";

const db = new pg.Pool({
  user: "your_username",     
  host: "your_host",        
  database: "your_database", 
  password: "your_password", 
  port: 5432,                // default PostgreSQL port
});

export default db;
