import mongoose from "mongoose";

const ProductSchema=new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    sold: {
        type: Boolean,
        required: true
    },
    dateOfSale: {
        type: Date,
        default: Date.now()
    }
})
const rox = mongoose.model('Roxiler', ProductSchema);
export default rox;