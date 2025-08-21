import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ userRole }) => {
  const location = useLocation();

  const getMenuItems = () => {
    const commonItems = [
      { path: '/app/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/app/my-tenders', label: 'Tenders', icon: '📋' },
      { path: '/app/profile', label: 'Profile', icon: '👤' },
      { path: '/app/Settings', label: 'Settings', icon: '⚙️' },
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

    return [...commonItems, ...(roleBasedItems[userRole] || [])];
  };

  const menuItems = getMenuItems();

  return (
    // CHANGED: Added Tailwind-like fixed positioning and full height
    <aside 
      className="sidebar fixed top-0 left-0 h-full shadow-lg" // CHANGED
      style={{ width: '240px', backgroundColor: '#1f2937', color: '#fff' }} // CHANGED: Added inline style for width + bg color
    >
      <ul className="sidebar-nav p-4"> {/* CHANGED: Added padding */}
        {menuItems.map((item) => (
          <li key={item.path} className="mb-2"> {/* CHANGED: Added margin between links */}
            <Link
              to={item.path}
              className={`flex items-center p-2 rounded hover:bg-gray-700 transition ${
                location.pathname === item.path ? 'bg-gray-800 font-bold' : ''
              }`} // CHANGED: Added flex, hover effects, and active style
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
