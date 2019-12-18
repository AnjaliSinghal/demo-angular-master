const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Schema
let taleSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  writer_id: {
    type: String,
    unique: true
  },
  myTales: {
    type: [String]
  },
  WinningProbability: {
    type: Number
  },
  shareFlag: {
    type: Boolean
  },
  earning: {
    type: Number
  },
  pulishedTales: {
    type: [Object]
  },
}, {
  collection: 'tales'
})
taleSchema.index({ writer_id: 1, earning: -1 });
module.exports = mongoose.model('Tale', taleSchema);



