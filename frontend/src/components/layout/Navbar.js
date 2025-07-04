// frontend/src/components/layout/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        TenderMS
      </Link>
      
      {user && (
        <div className="navbar-user">
          <div className="user-info">
            <div className="user-avatar">
              {getInitials(user.name)}
            </div>
            <span>{user.name}</span>
            <span className="text-muted">({user.role})</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;