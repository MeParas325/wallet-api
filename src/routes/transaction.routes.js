import express from 'express';
import { addTransaction, deleteTransactioo, getTransactionById, getTransactionSummary } from '../controllers/transaction.controllers.js';

const transactionRouter = express.Router();

transactionRouter.get("/:userId", getTransactionById);

transactionRouter.post("/", addTransaction);

transactionRouter.delete("/:id", deleteTransactioo);

transactionRouter.get("/summary/:userId", getTransactionSummary);

export default transactionRouter;

