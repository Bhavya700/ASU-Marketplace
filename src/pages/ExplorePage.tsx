import React, { useMemo, useState, useEffect } from 'react';
import './ExplorePage.css';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const TAGS = [
  'Textbooks',
  'Electronics',
  'Clothing',
  'Furniture',
  'Tickets',
  'Appliances',
  'Other',
] as const;

export type AllowedTag = typeof TAGS[number];

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

function ExplorePage() {
  const navigate = useNavigate();
  const [activeTag, setActiveTag] = useState<AllowedTag | 'All'>('All');
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(50);
      if (!error && data) setListings(data);
      setLoading(false);
    };
    fetchListings();
  }, []);

  const filtered = useMemo(() => {
    if (activeTag === 'All') return listings;
    return listings.filter(l => (l.tags || []).some(t => t.toLowerCase() === activeTag.toLowerCase()));
  }, [activeTag, listings]);

  return (
    <div className="explore-container">
      <h1>Explore Listings</h1>
      <p>Browse items on ASU Marketplace</p>

      <div className="tag-bar">
        <button className={`tag-chip ${activeTag==='All'?'active':''}`} onClick={() => setActiveTag('All')}>All</button>
        {TAGS.map(tag => (
          <button key={tag} className={`tag-chip ${activeTag===tag?'active':''}`} onClick={() => setActiveTag(tag)}>
            {tag}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="listings-grid">
          {filtered.map(l => (
            <div className="listing-card" key={l.id}>
              <div className="listing-image">
                <img src={l.image || '/ui/placeholder.jpg'} alt={l.title} />
                <span className="price-tag">${l.price}</span>
              </div>
              <div className="listing-details">
                <h4>{l.title}</h4>
                <p className="listing-desc">{l.description}</p>
                <div className="listing-meta">
                  <span>{new Date(l.created_at).toLocaleDateString()}</span>
                  <span>{l.location}</span>
                </div>
                <div className="explore-actions">
                  <button className="message-btn" onClick={() => navigate('/conversations')}>Message</button>
                </div>
                <div className="explore-tags">
                  {(l.tags || []).filter(t => TAGS.includes(t as AllowedTag)).slice(0,3).map(t => (
                    <span key={t} className="explore-tag">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="empty">No listings found for this filter.</div>
          )}
        </div>
      )}
    </div>
  );
}

export default ExplorePage;
