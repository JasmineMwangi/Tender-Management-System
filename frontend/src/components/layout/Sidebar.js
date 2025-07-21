// frontend/src/components/layout/Sidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ userRole }) => {
  const location = useLocation();

  const getMenuItems = () => {
    const commonItems = [
      { path: '/dashboard', label: 'Dashboard', icon: '📊' }
    ];

    const roleBasedItems = {
      admin: [
        { path: '/users', label: 'Users', icon: '👥' },
        { path: '/tenders', label: 'All Tenders', icon: '📋' },
        { path: '/bids', label: 'All Bids', icon: '📝' },
        { path: '/reports', label: 'Reports', icon: '📈' }
      ],
      organisation: [
        { path: '/my-tenders', label: 'My Tenders', icon: '📋' },
        { path: '/tender/create', label: 'Create Tender', icon: '➕' },
        { path: '/bids/received', label: 'Received Bids', icon: '📥' }
      ],
      user: [
        { path: '/available-tenders', label: 'Available Tenders', icon: '🔍' },
        { path: '/my-bids', label: 'My Bids', icon: '📝' },
        { path: '/bid-history', label: 'Bid History', icon: '📜' }
      ]
    };

    return [...commonItems, ...(roleBasedItems[userRole] || [])];
  };

  const menuItems = getMenuItems();

  return (
    <aside className="sidebar">
      <ul className="sidebar-nav">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={location.pathname === item.path ? 'active' : ''}
            >
              <span className="icon">{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;