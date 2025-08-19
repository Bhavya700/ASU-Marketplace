import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import PersistentNav from '../components/PersistentNav';
import './LandingPage.css';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string | null;
  tags: string[];
  location: string;
  created_at: string;
  user_id: string;
  status: string;
  quantity: number;
}

interface UserData {
  id: string;
  username: string;
  profile_picture: string | null;
  interests: string[];
  wanted_items: string[];
  favorites: string[];
}

function LandingPage() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [recentListings, setRecentListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownClosing, setDropdownClosing] = useState(false);

  useEffect(() => {
    if (currentUser) {
      fetchUserData();
      fetchRecentListings();
    }
    setLoading(false);
  }, [currentUser]);

  const fetchUserData = async () => {
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (error) throw error;
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchRecentListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setRecentListings(data || []);
    } catch (error) {
      console.error('Error fetching recent listings:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleEditProfile = () => {
    setShowDropdown(false);
    setShowEditProfile(true);
  };

  const handleCancelEditProfile = () => {
    setShowEditProfile(false);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !userData) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({
          interests: userData.interests,
          wanted_items: userData.wanted_items,
        })
        .eq('id', currentUser.id);

      if (error) throw error;
      setShowEditProfile(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleAddInterest = (interest: string) => {
    if (!userData) return;
    if (!userData.interests.includes(interest)) {
      setUserData({
        ...userData,
        interests: [...userData.interests, interest],
      });
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    if (!userData) return;
    setUserData({
      ...userData,
      interests: userData.interests.filter(interest => interest !== interestToRemove),
    });
  };

  const handleAddWantedItem = (item: string) => {
    if (!userData) return;
    if (!userData.wanted_items.includes(item)) {
      setUserData({
        ...userData,
        wanted_items: [...userData.wanted_items, item],
      });
    }
  };

  const handleRemoveWantedItem = (itemToRemove: string) => {
    if (!userData) return;
    setUserData({
      ...userData,
      wanted_items: userData.wanted_items.filter(item => item !== itemToRemove),
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="landing-container">
      <PersistentNav
        handleProfileClick={handleProfileClick}
        handleEditProfile={handleEditProfile}
        handleLogout={handleLogout}
      />

      <main className="landing-main">
        <section className="hero-section">
          <div className="awesome-hero-bg">
            <div className="hero-content">
              <h2 className="hero-headline">
                Welcome to <span className="highlight">ASU Marketplace</span>
              </h2>
              <p className="welcome-text">
                The ultimate campus marketplace for Sun Devils. Buy, sell, and connect with your ASU community!
              </p>
              <div className="hero-tagline">
                Your trusted platform for campus commerce
              </div>
              <div className="hero-buttons">
                <button className="cta-button" onClick={() => navigate('/explore')}>
                  Explore Listings
                </button>
                {currentUser && (
                  <button className="new-listing-button" onClick={() => navigate('/new-listing')}>
                    Create Listing
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {currentUser && (
          <>
            <section className="recent-activity-section">
              <h3 className="recent-activity-title">Recent Activity</h3>
              <div className="recent-activity-feed">
                {recentListings.map((listing) => (
                  <div key={listing.id} className="recent-activity-listing">
                    <img
                      src={listing.image || '/asu-logo.png'}
                      alt={listing.title}
                      className="recent-activity-thumb"
                    />
                    <div className="recent-activity-info">
                      <div className="activity-title-row">
                        <h4 className="activity-title">{listing.title}</h4>
                        <span className="activity-price">${listing.price}</span>
                      </div>
                      <div className="activity-meta-row">
                        <span className="seller-name">{listing.location}</span>
                        <span className="recent-activity-time">{formatDate(listing.created_at)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="recommended-section">
              <div className="recommended-box">
                <h3 className="recommended-title">Recommended for You</h3>
                <div className="recommended-grid">
                  {recentListings.slice(0, 3).map((listing) => (
                    <div key={listing.id} className="recommended-card">
                      <div className="recommended-image">
                        <img
                          src={listing.image || '/asu-logo.png'}
                          alt={listing.title}
                        />
                      </div>
                      <div className="recommended-details">
                        <h4>{listing.title}</h4>
                        <span className="recommended-price">${listing.price}</span>
                        <div className="recommended-tags">
                          {listing.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="recommended-tag">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <button
                          className="recommended-view-btn"
                          onClick={() => navigate('/explore')}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {!currentUser && (
          <div className="login-prompt-banner">
            <div className="login-prompt-content">
              <span>Join ASU Marketplace to buy, sell, and connect with your community!</span>
              <button onClick={() => navigate('/login')}>Sign Up</button>
              <button onClick={() => navigate('/login')}>Login</button>
            </div>
          </div>
        )}
      </main>

      {showEditProfile && (
        <div className="edit-profile-modal">
          <div className="edit-profile-content">
            <h2>Edit Profile</h2>
            <form onSubmit={handleSaveProfile}>
              <div className="form-group">
                <label>Interests</label>
                <div className="tags-container">
                  {userData?.interests.map((interest) => (
                    <span key={interest} className="tag">
                      {interest}
                      <button
                        type="button"
                        className="remove-tag"
                        onClick={() => handleRemoveInterest(interest)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="add-tag-form">
                  <input
                    type="text"
                    placeholder="Add interest..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const input = e.target as HTMLInputElement;
                        if (input.value.trim()) {
                          handleAddInterest(input.value.trim());
                          input.value = '';
                        }
                      }
                    }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Wanted Items</label>
                <div className="tags-container">
                  {userData?.wanted_items.map((item) => (
                    <span key={item} className="tag">
                      {item}
                      <button
                        type="button"
                        className="remove-tag"
                        onClick={() => handleRemoveWantedItem(item)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="add-tag-form">
                  <input
                    type="text"
                    placeholder="Add wanted item..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const input = e.target as HTMLInputElement;
                        if (input.value.trim()) {
                          handleAddWantedItem(input.value.trim());
                          input.value = '';
                        }
                      }
                    }}
                  />
                </div>
              </div>

              <div className="button-group">
                <button type="submit" className="save-button">
                  Save Changes
                </button>
                <button type="button" className="cancel-button" onClick={handleCancelEditProfile}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
