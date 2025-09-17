import React, { useState } from 'react';
import axios from 'axios';

function Login({ setToken, setShowRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      setToken(response.data.token);
    } catch (err) {
      console.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Login</h2>
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
      <button onClick={handleLogin}>Login</button>
      <button onClick={() => setShowRegister(true)}>Register</button>
    </div>
  );
}

export default Login;