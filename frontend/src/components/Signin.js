import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signin({ setNotification, setIsAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5001/signin', { username, password });
      const { token } = res.data;

      if (token) {
        localStorage.setItem('authToken', token);
        setIsAuthenticated(true);
        setNotification({ type: 'success', message: 'Successfully signed in!' });
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Signin Error:', err.response?.data || err.message);
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Signin failed. Please try again.',
      });
    }
  };

  return (
    <div className="form-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSignin}>
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
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default Signin;