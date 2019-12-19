const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Schema
let issueSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  writer_id: {
    type: String,
  },
  tale_id: {
    type: String
  },
  date: {
      type: Number
  }
}, {
  collection: 'issues'
})

module.exports = mongoose.model('Issue', issueSchema);