const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    phone: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 10,
    },
    password: {
        type: String,
        required: true,
        minlength: 3,
    },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);