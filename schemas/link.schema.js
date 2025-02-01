const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema({
    originalUrl: { 
        type: String, 
        required: true 
    },
    shortCode: { 
        type: String, 
        required: true, 
        unique: true 
    },  
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    expiresAt: { 
        type: Date, 
        default: null 
    },  
    remarks: { 
        type: String, 
        default: "" 
    }
});

module.exports = mongoose.model("Link", linkSchema);
