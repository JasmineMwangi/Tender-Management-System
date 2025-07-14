// src/components/auth/OrganizationRegister.js
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import DynamicRegisterForm from './DynamicRegisterForm';
import { Link } from 'react-router-dom';

const orgFields = [
  { name: 'organization', type: 'text', label: 'Organization Name', required: true, placeholder: 'Enter organization name' },
  { name: 'email', type: 'email', label: 'Email', required: true, placeholder: 'Enter official email' },
  { name: 'phone', type: 'tel', label: 'Phone Number', required: true, placeholder: 'Enter phone number' },
  { name: 'password', type: 'password', label: 'Password', required: true, placeholder: 'Enter password' },
  { name: 'confirmPassword', type: 'password', label: 'Confirm Password', required: true, placeholder: 'Confirm your password' },
];

const OrganizationRegister = () => {
  const { registerOrganization } = useAuth(); // Also from AuthContext
  return (
    <>
      <DynamicRegisterForm
        fields={orgFields}
        registerFunction={registerOrganization}
        UserType="Organization"
      />
      <div className="text-center mt-3">
        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </>
  );
};

export default OrganizationRegister;
