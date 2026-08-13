const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");


const app = express();

const authRoutes = require("./routes/authRoutes");

const productRoutes = require('./routes/productRoutes')


app.use(cors());
app.use(express.json());


db.query("SELECT 1", (err, result)=>{

    if(err){
        console.log("Database connection failed");
        console.log(err);
    }
    else{
        console.log("MySQL connected successfully");
    }

});


app.get("/", (req,res)=>{
    res.send("API is running...");
});

app.use("/api/auth", authRoutes);
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 5000;


app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});