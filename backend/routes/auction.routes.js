const router = require('express').Router();
const Auction = require('../models/auction.model');
const authMiddleware = require('../middleware/auth.middleware');

// Get all auctions
router.get('/auctions', async (req, res) => {
  try {
    const auctions = await Auction.find();
    res.json(auctions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching auctions' });
  }
});

// Get single auction
router.get('/auctions/:id', async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ message: 'Auction not found' });
    res.json(auction);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching auction' });
  }
});

// Create auction
router.post('/auction', authMiddleware, async (req, res) => {
  try {
    const { itemName, description, startingBid, closingTime } = req.body;
    const auction = new Auction({
      itemName,
      description,
      startingBid,
      currentBid: startingBid,
      closingTime,
      createdBy: req.user.userId,
    });
    await auction.save();
    res.status(201).json(auction);
  } catch (error) {
    res.status(500).json({ message: 'Error creating auction' });
  }
});

// Update auction
router.put('/auction/:id', authMiddleware, async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ message: 'Auction not found' });
    if (auction.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    Object.assign(auction, req.body);
    await auction.save();
    res.json(auction);
  } catch (error) {
    res.status(500).json({ message: 'Error updating auction' });
  }
});

// Delete auction
router.delete('/auction/:id', authMiddleware, async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ message: 'Auction not found' });
    if (auction.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await auction.remove();
    res.json({ message: 'Auction deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting auction' });
  }
});

// Place bids
router.post('/bid/:id', authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;
    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ message: 'Auction not found' });
    if (auction.isClosed) return res.status(400).json({ message: 'Auction is closed' });
    if (amount <= auction.currentBid) {
      return res.status(400).json({ message: 'Bid must be higher than current bid' });
    }
    auction.currentBid = amount;
    auction.highestBidder = req.user.username;
    if (new Date() >= auction.closingTime) {
      auction.isClosed = true;
      auction.winner = req.user.username;
    }
    await auction.save();
    res.json({ item: auction });
  } catch (error) {
    res.status(500).json({ message: 'Error placing bid' });
  }
});

module.exports = router;