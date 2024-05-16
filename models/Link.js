const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema({
  _userID: {
    type: ObjectId,
    required: true
  },
  _appID: {
    type: ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  requirements: {
    type: Array,
    required: true
  },
  active: {
    type: Boolean,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Link = mongoose.model('Link', LinkSchema);

module.exports = Link; 