import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function AuctionItem({ setNotification }) {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [bid, setBid] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get(`http://localhost:5001/auctions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItem(res.data);
      } catch (error) {
        setNotification({
          type: 'error',
          message: 'Error fetching auction item: ' + (error.response?.data?.message || error.message),
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [id, setNotification]);

  const handleBid = async () => {
    if (!bid || parseFloat(bid) <= (item?.currentBid || 0)) {
      setNotification({
        type: 'error',
        message: 'Bid must be higher than the current bid',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.post(
        `http://localhost:5001/bid/${id}`,
        { amount: parseFloat(bid) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setItem(res.data.item);
      setNotification({
        type: 'success',
        message: 'Bid placed successfully!',
      });
      setBid('');
    } catch (error) {
      setNotification({
        type: 'error',
        message: error.response?.data?.message || 'Error placing bid',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!item) {
    return <div className="text-center">Auction item not found</div>;
  }

  return (
    <div className="auction-item">
      <h2>{item.itemName}</h2>
      <p>{item.description}</p>
      <div className="bid-info">
        <p>Current Bid: <strong>${item.currentBid}</strong></p>
        <p>Highest Bidder: {item.highestBidder || 'No bids yet'}</p>
        <p>Ends: {new Date(item.closingTime).toLocaleString()}</p>
      </div>
      {!item.isClosed && (
        <div className="bid-form">
          <input
            type="number"
            value={bid}
            onChange={(e) => setBid(e.target.value)}
            placeholder="Enter your bid"
            min={item.currentBid + 1}
            step="0.01"
          />
          <button onClick={handleBid} disabled={isSubmitting}>
            {isSubmitting ? 'Placing...' : 'Place Bid'}
          </button>
        </div>
      )}
      {item.isClosed && (
        <div className="closed-notice">
          <p>This auction has ended.</p>
          {item.winner && <p>Winner: <strong>{item.winner}</strong></p>}
        </div>
      )}
    </div>
  );
}

export default AuctionItem;