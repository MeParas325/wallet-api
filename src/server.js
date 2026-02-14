import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";
import rateLimiter from "./middlewares/rateLimiter.js";
import transactionRouter from "./routes/transaction.routes.js";
import job from "./config/cron.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5001;

if(process.env.NODE_ENV === "production") job.start();

app.use(rateLimiter);
app.use(express.json());
app.use("/api/transactions", transactionRouter);

app.get("/api/health", (req, res) => {
    res.status(200).json({
        "status": "ok"
    });
})

async function initDB() {

    try {
        
        await sql`CREATE TABLE IF NOT EXISTS transactions(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10, 2) NOT NULL,
            category VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`

        console.log("Database initialized successfully");
    } catch (error) {
        console.log("Error while initializing DB: ", error);
        process.exit(1);
    }
    
} 

initDB().then(() => {
    app.listen(PORT, () => {
    console.log("Server is up and running at PORT: ", PORT);
})  
})

