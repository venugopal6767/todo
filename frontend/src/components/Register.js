import React, { useState } from 'react';
import axios from 'axios';

function Register({ setToken, setShowRegister }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleRegister = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/register`, { username, email, password });
      const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      setToken(response.data.token);
    } catch (err) {
      console.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Register</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleRegister}>Register</button>
      <button onClick={() => setShowRegister(false)}>Back to Login</button>
    </div>
  );
}

export default Register;