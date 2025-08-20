import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ListingsService } from '../lib/listingsService';
import { Listing } from '../lib/supabase';
import './MyListingsPage.css';

function MyListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  
  const navigate = useNavigate();
  const { profile } = useAuth();

  useEffect(() => {
    if (profile) {
      fetchUserListings();
    }
  }, [profile]);

  const fetchUserListings = async () => {
    if (!profile) return;
    
    try {
      setLoading(true);
      const userListings = await ListingsService.getUserListings(profile.id);
      setListings(userListings);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (listing: Listing) => {
    setEditingListing(listing);
  };

  const handleDelete = async (listingId: string) => {
    if (!profile) return;
    
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await ListingsService.deleteListing(listingId, profile.id);
        setListings(prev => prev.filter(l => l.id !== listingId));
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const handleStatusChange = async (listingId: string, newStatus: 'active' | 'sold' | 'inactive') => {
    if (!profile) return;
    
    try {
      const updatedListing = await ListingsService.updateListing(listingId, { status: newStatus }, profile.id);
      setListings(prev => prev.map(l => l.id === listingId ? updatedListing : l));
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!profile) {
    return (
      <div className="my-listings-container">
        <div className="auth-required">
          <h2>Authentication Required</h2>
          <p>You must be logged in to view your listings.</p>
          <button onClick={() => navigate('/login')} className="login-btn">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="my-listings-container">
        <div className="loading">Loading your listings...</div>
      </div>
    );
  }

  return (
    <div className="my-listings-container">
      <div className="my-listings-header">
        <h1>My Listings</h1>
        <p>Manage your marketplace listings</p>
        <button 
          onClick={() => navigate('/new-listing')} 
          className="new-listing-btn"
        >
          + Create New Listing
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {listings.length === 0 ? (
        <div className="no-listings">
          <h3>No Listings Yet</h3>
          <p>You haven't created any listings yet. Start selling by creating your first listing!</p>
          <button 
            onClick={() => navigate('/new-listing')} 
            className="create-first-listing-btn"
          >
            Create Your First Listing
          </button>
        </div>
      ) : (
        <div className="listings-grid">
          {listings.map(listing => (
            <div key={listing.id} className="listing-card">
              <div className="listing-image">
                <img 
                  src={listing.image_url || '/asu-logo.png'} 
                  alt={listing.title}
                  onError={(e) => {
                    e.currentTarget.src = '/asu-logo.png';
                  }}
                />
                <div className="listing-status">
                  <span className={`status-badge ${listing.status}`}>
                    {listing.status}
                  </span>
                </div>
              </div>
              
              <div className="listing-content">
                <h3 className="listing-title">{listing.title}</h3>
                <p className="listing-description">{listing.description}</p>
                
                <div className="listing-tags">
                  {listing.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
                
                <div className="listing-details">
                  <span className="listing-price">${listing.price}</span>
                  <span className="listing-location">{listing.location}</span>
                  <span className="listing-quantity">Qty: {listing.quantity}</span>
                </div>
                
                <div className="listing-actions">
                  <div className="status-controls">
                    <select
                      value={listing.status}
                      onChange={(e) => handleStatusChange(listing.id, e.target.value as 'active' | 'sold' | 'inactive')}
                      className="status-select"
                    >
                      <option value="active">Active</option>
                      <option value="sold">Sold</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  
                  <div className="action-buttons">
                    <button 
                      onClick={() => handleEdit(listing)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(listing.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="listing-meta">
                  <span>Created: {new Date(listing.created_at).toLocaleDateString()}</span>
                  {listing.updated_at !== listing.created_at && (
                    <span>Updated: {new Date(listing.updated_at).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyListingsPage;
