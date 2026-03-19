const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    username : {
        type : String,
        required : true,
        unique : [true, "Username already exists"]
    },
    email : {
        type : String,
        required : true,
        unique : [true, "Account already exists with this Email"]
    },
    phone : {
        type : Number,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : String,
        default : "user",
        enum : ["user", "admin"]
    },
    resetOtp : {
        type : Number,
        default : null
    }

})

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;