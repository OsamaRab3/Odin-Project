const mongoose = require('mongoose');
const User = require('./user.model'); 

const PostSchema = new mongoose.Schema({
  Title: {
    type: String,
    required: true
  },
  Timestamp: {
    type: Date,
    default: Date.now 
  },
  TextContent: {
    type: String,
    required: true
  },
  Author: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
  }
});

module.exports = mongoose.model('Post', PostSchema); 