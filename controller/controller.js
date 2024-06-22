import express from "express";

import mongoose from "mongoose";
import axios from "axios";
import connectdb from "../db/connect.js";
import rox from "../model/products.js";


const app=express();


export const Start=async (req,res)=>{
    try {
        
        console.log("hello");
        await connectdb();
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const data = response.data;
        await rox.create(data);
        console.log("done");
        res.status(200).json({message: "process done"});
    } catch (error) {
        console.error('Error initializing database:', error);
        res.status(500).json({ error: 'Failed to initialize database' });
    }
}
export const Show=async (req, res) => {
    try {
       await connectdb();
       const { page = 1, perPage = 10 } = req.query;
       const month= req.query.month || 3;
        const monthNumber = parseInt(month); 
        const skip = (page - 1) + perPage;
        console.log(monthNumber);
        const transactions = await rox.aggregate([
            {
                $addFields: {
                    month: { $month: '$dateOfSale' }
                }
            },
            {
                $match: { month: monthNumber }
            },
            {
                $skip: skip
            },
            {
                $limit: parseInt(perPage)
            }
        ]).exec();

        res.status(200).json(transactions);

    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
};
export const Sale_amount= async (req, res) => {
    try {
        await connectdb();
        const { month = 3 } = req.query;
        const monthNumber = parseInt(month); 

        const totalSale = await rox.aggregate([
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
        const show_for = await rox.aggregate([
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
            
        ]).exec();
        res.status(200).json(totalSale);
    } catch (error) {
    
        res.status(500).json({ error: error });
    }
};
export const Bar=async (req,res)=>{
    await connectdb();
    const ans=[];
    const {month=3}=req.query;
    const monthNumber = parseInt(month);
    for(let i=0;i<10;i++){
        let start=parseInt(i*100),end=parseInt((i+1)*100);
        if(end==1000){
            end=10000000000000;
        }
        const totalSale = await rox.aggregate([
            {
                $addFields: {
                    month: { $month: '$dateOfSale' }
                }
            },
            {
                $match: { month: monthNumber,
                    price: { $gte: start, $lte: end }
                 }
            },
            {
                $count: 'totalProductsInMonthInRange'
            }
        ]).exec();
        ans.push(totalSale.length > 0 ? totalSale[0].totalProductsInMonthInRange : 0);
        console.log(ans[i]);
    }
   
    
    res.status(200).json(ans);
    
}
export const Category = async (req, res) => {
    try {
        await connectdb();
        const { month = 3 } = req.query;
        const monthNumber = parseInt(month); 

        const totalSale = await rox.aggregate([
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
                    count: { $sum: 1 },  
                    total: { $sum: '$price' }  
                }
            }
        ]).exec();
        res.status(200).json(totalSale);
    } catch (error) {
        console.error('Error fetching category data:', error);
        res.status(500).json({ error: 'Failed to fetch category data' });
    }
};


