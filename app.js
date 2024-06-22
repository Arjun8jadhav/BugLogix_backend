import express from "express";
import rox from "./model/products.js";
import mongoose from "mongoose";
import axios from "axios";
import connectdb from "./db/connect.js";
import cors from "cors";
import { Bar, Sale_amount, Show, Start, Category } from "./controller/controller.js";
const router = express.Router();
const app = express();
app.use(cors());
app.get('/', (req, res) => {
    res.status(200).json({ message: "hello1" })
})
app.get('/start', Start);
app.get('/show', Show);
app.get('/sale_amount', Sale_amount);
app.get('/bar_chart', Bar);
app.get('/category', Category);
app.get('/result', async (req, res) => {
    try {
        await connectdb();
        const { month = 3 } = req.query;
        const monthNumber = parseInt(month);
        const sale_result = await rox.aggregate([
            {
                $addFields: {
                    month: { $month: '$dateOfSale' }
                }
            },
            {
                $match: {
                    $and: [
                        { month: monthNumber },
                        { sold: true }
                    ]
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$price' }
                }
            }
        ]).exec();
        const cat_result=await rox.aggregate([
            {
                $addFields: {
                    month: { $month: '$dateOfSale' }
                }
            },
            {
                $match: {
                    $and: [
                        { month: monthNumber },
                        { sold: true }
                    ]
                }
            },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]).exec();
        console.log(sale_result);
        res.status(200).json({ sale: sale_result ,cat:cat_result})
    }
    catch (err) {
        res.status(500).json("something went wrong");
    }

})
app.listen(8800, () => {
    console.log("server started")
});
