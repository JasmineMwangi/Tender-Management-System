// frontend/src/components/layout/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import './Layout.css';

const Layout = () => {
  const { user } = useAuth();

  return (
    <div className="layout">
      <Navbar />
      <div className="layout-content">
        <Sidebar userRole={user?.role} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;