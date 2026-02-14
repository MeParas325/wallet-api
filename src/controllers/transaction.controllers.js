import { sql } from "../config/db.js";

export async function getTransactionById (req, res){

    try {
        const {userId} = req.params;

        const transactions = await sql`
        SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
        `

        res.status(201).json({
            success: true,
            message: "Transactions fetched successfully",
            data: transactions
        });
    } catch (error) {
        console.error("Error while getting transactions: ", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export async function addTransaction (req, res) {

    try {
        const {title, amount, category, user_id} = req.body;

        if(!title || !category || !user_id || amount === undefined) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const transaction = await sql`
        INSERT INTO transactions(user_id, title, amount, category)
        VALUES (${user_id}, ${title}, ${amount}, ${category}) 
        RETURNING *
        `;

        res.status(201).json({
            success: true,
            message: "Transaction created successfully",
            data: transaction[0]
        });
    } catch (error) {
        console.error("Error while creating transaction: ", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export async function deleteTransactioo(req, res) {

    try {
        const {id} = req.params;

        if(isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: "Invalid transaction id"
            });
        }

        const result = await sql`
        DELETE * FROM transactions WHERE id = ${id} RETURNING *
        `;

        if(result.length == 0) {
            return res.status(400).json({
                message: "No transaction found"
            });
        };

        res.status(201).json({
            success: true,
            message: "Transaction deleted successfully"
        });
    } catch (error) {
        console.error("Error while deleting transaction: ", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export async function getTransactionSummary (req, res) {

    try {
        
        const {userId} = req.params;

        const incomeResult = await sql`
            SELECT COALESCE(SUM(amount, 0)) as income FROM transactions WHERE user_id = ${userId} AND amount > 0
        `;

        const expenseResult = sql`
            SELECT COALESCE(SUM(amount, 0)) as expenses FROM transactions WHERE user_id = ${userId} AND amount < 0
        `;

        res.status(201).json({
            success: true,
            message: "Transactions summary fetched successfully",
            data: {
                balance: balanceResult[0].balance,
                income: incomeResult[0].income,
                expenses: expenseResult[0].expenses
            }
        })
    } catch (error) {
        console.error("Error while fetching transaction summary: ", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}