import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ userRole }) => {
  const location = useLocation();

  const getMenuItems = () => {
    const commonItems = [
      { path: '/app/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/app/my-tenders', label: 'Tenders', icon: '📋' },
    ];

    const bottomItems = [
      { path: '/app/profile', label: 'Profile', icon: '👤' },
      { path: '/app/settings', label: 'Settings', icon: '⚙️' }, // 👈 also fixed lowercase "settings"
    ];

    const roleBasedItems = {
      admin: [
        { path: '/app/users', label: 'Users', icon: '👥' },
        { path: '/app/bids', label: 'All Bids', icon: '📝' },
        { path: '/app/reports', label: 'Reports', icon: '📈' }
      ],
      organization: [
        { path: '/app/tender/create', label: 'Create Tender', icon: '➕' },
        { path: '/app/bids/received', label: 'Received Bids', icon: '📥' },
      ],
      bidder: [
        { path: '/app/my-bids', label: 'My Bids', icon: '📝' },
        { path: '/app/bid-history', label: 'Bid History', icon: '📜' }
      ]
    };

    // Return role + common first, then bottom always last
    return [...commonItems, ...(roleBasedItems[userRole] || []), ...bottomItems];
  };

  const menuItems = getMenuItems();

  return (
    <aside 
      className="sidebar fixed top-0 left-0 h-full shadow-lg"
      style={{ width: '240px', backgroundColor: '#1f2937', color: '#fff' }}
    >
      <ul className="sidebar-nav p-4">
        {menuItems.map((item) => (
          <li key={item.path} className="mb-2">
            <Link
              to={item.path}
              className={`flex items-center p-2 rounded hover:bg-gray-700 transition ${
                location.pathname === item.path ? 'bg-gray-800 font-bold' : ''
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
