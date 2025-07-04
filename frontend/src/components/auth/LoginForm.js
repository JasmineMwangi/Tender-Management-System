// frontend/src/components/auth/LoginForm.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import BaseForm from '../common/BaseForm';

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const fields = [
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
      required: true,
      placeholder: 'Enter your email'
    },
    {
      name: 'password',
      type: 'password',
      label: 'Password',
      required: true,
      placeholder: 'Enter your password'
    }
  ];

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError('');
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="text-center mb-4">Login to TenderMS</h2>
        
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}
        
        <BaseForm
          fields={fields}
          onSubmit={handleSubmit}
          submitLabel="Login"
          loading={loading}
        />
        
        <div className="text-center mt-3">
          <p>
            Don't have an account?{' '}
            <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;