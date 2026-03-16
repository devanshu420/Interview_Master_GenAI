const mongoose = require('mongoose');


const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB successfully ✔️");
    } catch (error) {
        console.log("Error connecting to MongoDB ✖️", error);
    }
}

module.exports = connectToDB;