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
        const res = await axios.get(`http://localhost:5001/auctions/${id}`);
        setItem(res.data);
      } catch (error) {
        setNotification({
          type: 'error',
          message: 'Error fetching auction item: ' + (error.response?.data?.message || error.message)
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
        message: 'Bid must be higher than the current bid'
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
        message: 'Bid placed successfully!'
      });
      setBid('');
    } catch (error) {
      setNotification({
        type: 'error',
        message: error.response?.data?.message || 'Error placing bid'
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
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">{item.itemName}</h2>
      <div className="space-y-4">
        <p className="text-gray-700">{item.description}</p>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-lg font-semibold">Current Bid: ${item.currentBid}</p>
          <p className="text-gray-600">Highest Bidder: {item.highestBidder || 'No bids yet'}</p>
        </div>
        {!item.isClosed && (
          <div className="flex gap-2">
            <input
              type="number"
              value={bid}
              onChange={(e) => setBid(e.target.value)}
              placeholder="Enter your bid"
              min={item.currentBid + 1}
              step="0.01"
              className="flex-grow p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={handleBid}
              disabled={isSubmitting}
              className="w-32 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isSubmitting ? 'Placing...' : 'Place Bid'}
            </button>
          </div>
        )}
        {item.isClosed && (
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-yellow-800">This auction has ended.</p>
            {item.winner && (
              <p className="font-semibold">Winner: {item.winner}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
export default AuctionItem;