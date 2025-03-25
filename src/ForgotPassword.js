import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const supabase = createClient('https://vvacfhireitcofqbtxnv.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2YWNmaGlyZWl0Y29mcWJ0eG52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MjE0NTYsImV4cCI6MjA1ODQ5NzQ1Nn0.8zGhQOqH-MyUm8qWsqkbMACiNOzx7SVpddct5mmhr8A');
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://filmdata.onrender.com/updatepassword',
      })
      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccessMessage('Password Reset Email Has Been Sent. Kindly review your email inbox.');
      }
    } catch (error) {
      console.error('Error resetting password:', error.message);
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <img src="filmdb.png" alt="logo" style={{ width: '150px' }} />
        </div>
        <h2 style={{ marginBottom: '1rem' }}>Forgot Password</h2>
        {successMessage && <div className="alert alert-success my-3" role="alert" >{successMessage}</div>}
        {errorMessage && <div className="alert alert-danger my-3" role="alert" >{errorMessage}</div>}
        <form onSubmit={handleForgotPassword} style={{ width: '300px', display: 'flex', flexDirection: 'column' }}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginBottom: '1rem', padding: '0.5rem', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <button type="submit" className="btn btn-warning" style={{ padding: '0.5rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Reset Password</button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
