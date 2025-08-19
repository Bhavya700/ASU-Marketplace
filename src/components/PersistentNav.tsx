import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './PersistentNav.css';

interface PersistentNavProps {
  handleProfileClick: () => void;
  handleEditProfile: () => void;
  handleLogout: () => void;
}

const PersistentNav: React.FC<PersistentNavProps> = ({
  handleProfileClick,
  handleEditProfile,
  handleLogout,
}) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownClosing, setDropdownClosing] = useState(false);
  const [notifCount, setNotifCount] = useState(0);

  const handleProfileClickInternal = () => {
    setShowDropdown(!showDropdown);
    handleProfileClick();
  };

  const handleDropdownClose = () => {
    setDropdownClosing(true);
    setTimeout(() => {
      setShowDropdown(false);
      setDropdownClosing(false);
    }, 300);
  };

  return (
    <nav className="landing-nav glass-nav">
      <div className="landing-nav-left" style={{ cursor: 'pointer' }} onClick={() => navigate('/') }>
        <img src="/asu-logo.png" alt="ASU Logo" className="asu-logo" />
        <h1 className="landing-title">ASU Marketplace</h1>
      </div>
      <div className="landing-nav-center">
        {currentUser && (
          <div className="nav-links">
            <span className="nav-link" onClick={() => navigate('/explore')}>Explore</span>
            <span className={`nav-link${notifCount > 0 ? ' has-badge' : ''}`} onClick={() => navigate('/messages')}>
              Messages
              {notifCount > 0 && (
                <span className="notif-badge">{notifCount}</span>
              )}
            </span>
            <span className="nav-link" onClick={() => navigate('/purchase-history')}>Purchase History</span>
            <span className="nav-link" onClick={() => navigate('/my-listings')}>My Listings</span>
          </div>
        )}
      </div>
      <div className="landing-nav-right">
        {currentUser ? (
          <div className="user-section" onClick={handleProfileClickInternal} style={{ position: 'relative' }}>
            <img 
              src={currentUser.user_metadata?.profile_picture || '/default-avatar.png'} 
              alt="Profile" 
              className="profile-pic" 
            />
            <span className="username">{currentUser.user_metadata?.username || currentUser.email}</span>
            {(showDropdown || dropdownClosing) && (
              <div className={`profile-dropdown${dropdownClosing ? ' closing' : ''}`}> 
                <button onClick={handleEditProfile}>Edit Profile</button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <button className="landing-nav-button" onClick={() => navigate('/login')}>Login</button>
        )}
      </div>
    </nav>
  );
};

export default PersistentNav;
