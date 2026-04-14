require('dotenv').config();
const app = require("./src/app");
const connectToDB = require('./src/db/db');


// ✅ Fix karo
app.listen(process.env.PORT || 5000, '0.0.0.0', () => {
    console.log(`Server is running on PORT ${process.env.PORT || 5000}`);
    connectToDB();
})