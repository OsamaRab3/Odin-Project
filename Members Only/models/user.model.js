const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  FirstName: { 
    type: String,
    required: true
  },
  LastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  membership_status: {
    type: String,
    enum: ["NotMember", "Member"],
    default: "NotMember"
  },
  membership_date: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    enum: ["User", "Admin"],
    default: "User"
  }
});

module.exports = mongoose.model('User', UserSchema);