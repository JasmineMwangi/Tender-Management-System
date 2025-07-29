import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ userRole }) => {
  const location = useLocation();

  const getMenuItems = () => {
    const commonItems = [
      { path: '/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/app/my-tenders', label: 'My Tenders', icon: '📋' },

    ];

    const roleBasedItems = {
      admin: [
        { path: '/app/users', label: 'Users', icon: '👥' },
        { path: '/app/tenders', label: 'All Tenders', icon: '📋' },
        { path: '/app/bids', label: 'All Bids', icon: '📝' },
        { path: '/app/reports', label: 'Reports', icon: '📈' }
      ],
      organization: [
        // { path: '/app/my-tenders', label: 'My Tenders', icon: '📋' },
        { path: '/app/tender/create', label: 'Create Tender', icon: '➕' },
        { path: '/app/bids/received', label: 'Received Bids', icon: '📥' },
        //{ path: '/app/reports', label: 'reports', icon: '📈' }
      ],
      bidder: [
        // { path: '/app/available-tenders', label: 'Available Tenders', icon: '🔍' },
        { path: '/app/my-bids', label: 'My Bids', icon: '📝' },
        { path: '/app/bid-history', label: 'Bid History', icon: '📜' }
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
