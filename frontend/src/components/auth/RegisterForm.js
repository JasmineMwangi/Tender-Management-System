// frontend/src/components/auth/RegisterForm.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import BaseForm from '../common/BaseForm';

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const fields = [
    {
      name: 'firstName',
      type: 'text',
      label: 'First Name',
      required: true,
      placeholder: 'Enter your first name'
    },
    {
      name: 'lastName',
      type: 'text',
      label: 'Last Name',
      required: true,
      placeholder: 'Enter your last name'
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
      required: true,
      placeholder: 'Enter your email'
    },
    {
      name: 'phone',
      type: 'tel',
      label: 'Phone Number',
      required: true,
      placeholder: 'Enter your phone number'
    },
    {
      name: 'organization',
      type: 'text',
      label: 'Organization',
      required: true,
      placeholder: 'Enter your organization name'
    },
    {
      name: 'password',
      type: 'password',
      label: 'Password',
      required: true,
      placeholder: 'Enter your password'
    },
    {
      name: 'confirmPassword',
      type: 'password',
      label: 'Confirm Password',
      required: true,
      placeholder: 'Confirm your password'
    }
  ];

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Validate password confirmation
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      // Remove confirmPassword from data sent to backend
      const { confirmPassword, ...registerData } = formData;

      await register(registerData);
      
      setSuccess('Registration successful! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="text-center mb-4">Register for TenderMS</h2>
        
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}
        
        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}
        
        <BaseForm
          fields={fields}
          onSubmit={handleSubmit}
          submitLabel="Register"
          loading={loading}
        />
        
        <div className="text-center mt-3">
          <p>
            Already have an account?{' '}
            <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;