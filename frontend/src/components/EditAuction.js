import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditAuction({ setNotification }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    startingBid: '',
    closingTime: '',
  });

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get(`http://localhost:5001/auctions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData({
          itemName: res.data.itemName,
          description: res.data.description,
          startingBid: res.data.startingBid,
          closingTime: res.data.closingTime.slice(0, 16),
        });
      } catch (error) {
        setNotification({ type: 'error', message: 'Error fetching auction' });
      }
    };
    fetchAuction();
  }, [id, setNotification]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`http://localhost:5001/auction/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotification({ type: 'success', message: 'Auction updated successfully!' });
      navigate('/dashboard');
    } catch (error) {
      setNotification({ type: 'error', message: 'Error updating auction' });
    }
  };

  return (
    <div className="form-container">
      <h2>Edit Auction</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="itemName"
          value={formData.itemName}
          onChange={handleChange}
          placeholder="Item Name"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />
        <input
          type="number"
          name="startingBid"
          value={formData.startingBid}
          onChange={handleChange}
          placeholder="Starting Bid"
          required
          min="0"
          step="0.01"
        />
        <input
          type="datetime-local"
          name="closingTime"
          value={formData.closingTime}
          onChange={handleChange}
          required
        />
        <button type="submit">Update Auction</button>
      </form>
    </div>
  );
}

export default EditAuction;