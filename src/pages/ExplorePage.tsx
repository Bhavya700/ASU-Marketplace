import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ListingsService, ListingsFilters, AllowedTag } from '../lib/listingsService';
import { Listing } from '../lib/supabase';
import './ExplorePage.css';

function ExplorePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTags, setSelectedTags] = useState<AllowedTag[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  
  const navigate = useNavigate();
  const { profile } = useAuth();

  const allowedTags = ListingsService.getAllowedTags();

  useEffect(() => {
    fetchListings();
  }, [selectedTags, searchTerm, location, minPrice, maxPrice]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const filters: ListingsFilters = {};
      
      if (selectedTags.length > 0) {
        filters.tags = selectedTags;
      }
      
      if (searchTerm) {
        filters.search = searchTerm;
      }
      
      if (location) {
        filters.location = location;
      }
      
      if (minPrice) {
        filters.minPrice = parseFloat(minPrice);
      }
      
      if (maxPrice) {
        filters.maxPrice = parseFloat(maxPrice);
      }

      const { listings: fetchedListings } = await ListingsService.getListings(filters);
      setListings(fetchedListings);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTagToggle = (tag: AllowedTag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleMessage = (listing: Listing) => {
    // Navigate to conversations page with listing context
    navigate('/conversations', { state: { listingId: listing.id } });
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSearchTerm('');
    setLocation('');
    setMinPrice('');
    setMaxPrice('');
  };

  if (loading) {
    return (
      <div className="explore-container">
        <div className="loading">Loading listings...</div>
      </div>
    );
  }

  return (
    <div className="explore-container">
      <div className="explore-header">
        <h1>Explore Listings</h1>
        <p>Find what you're looking for in the ASU community</p>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search listings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters-row">
          <div className="filter-group">
            <label>Tags:</label>
            <div className="tags-container">
              {allowedTags.map(tag => (
                <button
                  key={tag}
                  className={`tag ${selectedTags.includes(tag) ? 'selected' : ''}`}
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Location:</label>
            <input
              type="text"
              placeholder="Enter location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label>Price Range:</label>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="price-input"
                min="0"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="price-input"
                min="0"
              />
            </div>
          </div>

          <button onClick={clearFilters} className="clear-filters-btn">
            Clear Filters
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Listings Grid */}
      <div className="listings-grid">
        {listings.length === 0 ? (
          <div className="no-listings">
            <p>No listings found matching your criteria.</p>
            <p>Try adjusting your filters or check back later!</p>
          </div>
        ) : (
          listings.map(listing => (
            <div key={listing.id} className="listing-card">
              <div className="listing-image">
                <img 
                  src={listing.image_url || '/asu-logo.png'} 
                  alt={listing.title}
                  onError={(e) => {
                    e.currentTarget.src = '/asu-logo.png';
                  }}
                />
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
                </div>
                
                <div className="listing-actions">
                  <button 
                    onClick={() => handleMessage(listing)}
                    className="message-btn"
                  >
                    Message
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ExplorePage;
