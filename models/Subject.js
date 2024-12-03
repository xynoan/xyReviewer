const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    userId: { type: String, required: true }, 
    name: { type: String, required: true },   
    createdAt: { type: Date, default: Date.now }, 
});

module.exports = mongoose.model('Subject', subjectSchema);