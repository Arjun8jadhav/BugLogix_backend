import mongoose from "mongoose";
const uri="mongodb+srv://arjun8jadhav:arjunjadhav@cluster0.2yq82of.mongodb.net/Roxiler?retryWrites=true&w=majority&appName=Cluster0";
const connectdb=()=>{
    return mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true ,
        serverSelectionTimeoutMS: 30000, 
        socketTimeoutMS: 45000})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
};

 export default connectdb;
