import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Navbar.scss';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <svg className="navbar-logo" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 8h-9.2L9.3 5.5c-.2-.3-.5-.5-.9-.5H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2z" fill="currentColor"/>
          </svg>
          <span>ShippingApp</span>
        </div>

        {isAuthenticated && (
          <button 
            onClick={handleLogout} 
            className="logout-button"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 