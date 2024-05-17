const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const AppSchema = new mongoose.Schema({
  _userID: {
    type: ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  like: {
    type: Number,
    default: 0
  },
  dislike: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const App = mongoose.model('App', AppSchema);

module.exports = App; 