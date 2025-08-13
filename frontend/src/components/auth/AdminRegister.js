// src/components/auth/AdminRegister.js
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import DynamicRegisterForm from './DynamicRegisterForm';
import { Link } from 'react-router-dom';

const adminFields = [
  { name: 'firstName', type: 'text', label: 'First Name', required: true, placeholder: 'Enter your first name' },
  { name: 'lastName', type: 'text', label: 'Last Name', required: true, placeholder: 'Enter your last name' },
  { name: 'email', type: 'email', label: 'Email', required: true, placeholder: 'Enter your email' },
  { name: 'phone', type: 'tel', label: 'Phone Number', required: true, placeholder: 'Enter your phone number' },
  { name: 'password', type: 'password', label: 'Password', required: true, placeholder: 'Enter your password' },
  { name: 'confirmPassword', type: 'password', label: 'Confirm Password', required: true, placeholder: 'Confirm your password' },
];

const AdminRegister = () => {
  const { registerAdmin } = useAuth(); // You'll need to define this in AuthContext
  return (
    <>
      <DynamicRegisterForm
        fields={adminFields}
        registerFunction={registerAdmin}
        UserType="Admin"
      />
      <div className="text-center mt-3">
        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </>
  );
};

export default AdminRegister;
