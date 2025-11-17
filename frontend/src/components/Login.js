import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.message === 'Login successful') {
      setLoginStatus('success');
      localStorage.setItem('username', data.username);
      setTimeout(() => {
        navigate('/dashboard', {
          state: { message: `Welcome ${data.username}!` }
        });
      }, 1500);
    } else {
      setLoginStatus('error');
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Login Test</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">LOGIN</button>
        </form>
        {loginStatus === 'success' && <p className="success">Login successful</p>}
        {loginStatus === 'error' && <p className="error">Invalid credentials</p>}
        <a href="/signup">Sign Up</a>
      </div>
    </div>
  );
}

export default Login;
