const mongoose = require('mongoose');

const postsSchema = new mongoose.Schema({
    postId:{
        type: String,
    },
    user:{
        type: String,
        required: true,
        unique: true,
    },
    title:{
        type: String,
        required: true,
        unique: true,
    },
    content:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    }
},{timestamps: true});

module.exports = mongoose.model("Posts", postsSchema);