const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true }, 
    questionText: { type: String, required: true }, 
    answer: { type: String, required: true }, 
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Question', questionSchema);