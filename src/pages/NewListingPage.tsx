import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ListingsService, CreateListingData, AllowedTag } from '../lib/listingsService';
import './NewListingPage.css';

function NewListingPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    quantity: '1',
    tags: [] as AllowedTag[]
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { profile } = useAuth();

  const allowedTags = ListingsService.getAllowedTags();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagToggle = (tag: AllowedTag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) {
      setError('You must be logged in to create a listing');
      return;
    }

    if (formData.tags.length === 0) {
      setError('Please select at least one tag');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // TODO: Implement image upload to Supabase Storage
      // For now, we'll use a placeholder
      const imageUrl = imageFile ? '/asu-logo.png' : undefined;

      const listingData: CreateListingData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        image_url: imageUrl,
        tags: formData.tags,
        location: formData.location,
        quantity: parseInt(formData.quantity)
      };

      await ListingsService.createListing(listingData, profile.id);
      
      navigate('/my-listings');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="new-listing-container">
        <div className="auth-required">
          <h2>Authentication Required</h2>
          <p>You must be logged in to create a new listing.</p>
          <button onClick={() => navigate('/login')} className="login-btn">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="new-listing-container">
      <div className="new-listing-header">
        <h1>Create New Listing</h1>
        <p>Share what you're selling with the ASU community</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="new-listing-form">
        <div className="form-section">
          <h3>Basic Information</h3>
          
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="What are you selling?"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Describe your item in detail..."
              rows={4}
              className="form-textarea"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price *</label>
              <div className="price-input-wrapper">
                <span className="currency-symbol">$</span>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="form-input price-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="1"
                className="form-input"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Categories & Location</h3>
          
          <div className="form-group">
            <label>Tags *</label>
            <div className="tags-container">
              {allowedTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  className={`tag ${formData.tags.includes(tag) ? 'selected' : ''}`}
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
            <p className="form-help">Select at least one tag to categorize your listing</p>
          </div>

          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              placeholder="e.g., Tempe Campus, ASU Downtown, etc."
              className="form-input"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Images</h3>
          
          <div className="form-group">
            <label htmlFor="image">Listing Image</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="form-file-input"
            />
            <p className="form-help">Upload a clear image of your item (optional)</p>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/my-listings')}
            className="cancel-btn"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Listing'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewListingPage;
