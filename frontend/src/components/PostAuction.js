import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PostAuction({ setNotification }) {
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    startingBid: '',
    closingTime: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('authToken');
      await axios.post(
        'http://localhost:5001/auction',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotification({ type: 'success', message: 'Auction item posted successfully!' });
      navigate('/dashboard');
    } catch (error) {
      setNotification({
        type: 'error',
        message: error.response?.data?.message || 'Failed to post auction',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Post New Auction</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="itemName"
          placeholder="Item Name"
          value={formData.itemName}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Item Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="startingBid"
          placeholder="Starting Bid"
          value={formData.startingBid}
          onChange={handleChange}
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
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Posting...' : 'Post Auction'}
        </button>
      </form>
    </div>
  );
}

export default PostAuction;