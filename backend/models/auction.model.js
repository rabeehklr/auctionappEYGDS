const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  description: { type: String, required: true },
  startingBid: { type: Number, required: true, min: 0 },
  currentBid: { type: Number, default: 0 },
  highestBidder: { type: String, default: null },
  closingTime: { type: Date, required: true },
  isClosed: { type: Boolean, default: false },
  winner: { type: String, default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Auction', auctionSchema);