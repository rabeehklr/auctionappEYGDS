import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PostAuction({ setNotification }) {
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    startingBid: '',
    closingTime: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        message: error.response?.data?.message || 'Failed to post auction'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Post New Auction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            name="itemName"
            placeholder="Item Name"
            value={formData.itemName}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <textarea
            name="description"
            placeholder="Item Description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <input
            type="number"
            name="startingBid"
            placeholder="Starting Bid"
            value={formData.startingBid}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <input
            type="datetime-local"
            name="closingTime"
            value={formData.closingTime}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Posting...' : 'Post Auction'}
        </button>
      </form>
    </div>
  );
}

export default PostAuction;