import React from 'react';
import ReactDOM from 'react-dom/client';

// const App = () => {
//   return <h1> Tender Management System</h1>;
// };
import App from './App'; // ✅ import the actual App component
import './App.css'; // optional global styles

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
