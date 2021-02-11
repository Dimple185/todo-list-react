const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Todo = new Schema({
    key: {
        type: String,
    },
    text: {
        type: String,
    },
});

module.exports = mongoose.model('Todo', Todo);