import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup({ setNotification }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setNotification({ type: 'error', message: 'Username and password are required' });
      return;
    }

    try {
      await axios.post('http://localhost:5001/signup', { username, password });
      setNotification({ type: 'success', message: 'Signup successful! Please sign in.' });
      navigate('/signin');
    } catch (err) {
      console.error('Signup Error:', err.response?.data || err.message);
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Signup failed. Please try again.',
      });
    }
  };

  return (
    <div className="form-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;