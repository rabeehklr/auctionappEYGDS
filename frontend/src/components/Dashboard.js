import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard({ setNotification }) {
  const [auctions, setAuctions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/signin');
          return;
        }
        const res = await axios.get('http://localhost:5001/auctions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAuctions(res.data);
      } catch (error) {
        setNotification({ type: 'error', message: 'Error fetching auctions' });
      }
    };
    fetchAuctions();
  }, [navigate, setNotification]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:5001/auction/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAuctions(auctions.filter((auction) => auction._id !== id));
      setNotification({ type: 'success', message: 'Auction deleted successfully' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Error deleting auction' });
    }
  };

  return (
    <div className="dashboard">
      <div className="header">
        <h2>Auction Dashboard</h2>
        <Link to="/post-auction">Post New Auction</Link>
      </div>
      <div className="auction-grid">
        {auctions.map((auction) => (
          <div key={auction._id} className="auction-card">
            <h3>{auction.itemName}</h3>
            <p>{auction.description}</p>
            <p>Current Bid: <strong>${auction.currentBid}</strong></p>
            <p>Ends: {new Date(auction.closingTime).toLocaleString()}</p>
            <p className={`status ${auction.isClosed ? 'closed' : 'open'}`}>
              {auction.isClosed ? 'Closed' : 'Open'}
            </p>
            <div className="buttons">
              <Link to={`/auction/${auction._id}`} className="view">View</Link>
              {!auction.isClosed && auction.createdBy === JSON.parse(atob(localStorage.getItem('authToken').split('.')[1])).userId && (
                <>
                  <Link to={`/edit-auction/${auction._id}`} className="edit">Edit</Link>
                  <button onClick={() => handleDelete(auction._id)} className="delete">Delete</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;