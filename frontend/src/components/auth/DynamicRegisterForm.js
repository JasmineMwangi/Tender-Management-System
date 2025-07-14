// src/components/auth/DynamicRegisterForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseForm from '../common/BaseForm';

const DynamicRegisterForm = ({ fields, registerFunction, UserType }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      const { confirmPassword, ...dataToSend } = formData;

      await registerFunction(dataToSend);

      setSuccess(`${UserType} registration successful! Redirecting...`);
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
        <h2 className="text-center mb-4">Register as {UserType}</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <BaseForm
          fields={fields}
          onSubmit={handleSubmit}
          submitLabel="Register"
          loading={loading}
        />
      </div>
    </div>
  );
};

export default DynamicRegisterForm;
