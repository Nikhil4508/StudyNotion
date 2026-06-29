const mongoose = require("mongoose");
require("dotenv").config();
exports.connectDB = () => {
    mongoose.connect(process.env.DATABASE_URL)
    .then( () => console.log("Database connected successfully") )
    .catch( (err) => {
        console.log("Database connection Failed");
        console.error(err);
        process.exit(1);
    });
};