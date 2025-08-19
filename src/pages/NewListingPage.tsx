import React from 'react';
import './NewListingPage.css';

function NewListingPage() {
  return (
    <div className="new-listing-container">
      <h1>Create New Listing</h1>
      <p>Add a new item to the marketplace</p>
      <div className="placeholder-content">
        <p>This page will contain the new listing creation form.</p>
        <p>Features will include:</p>
        <ul>
          <li>Item title and description</li>
          <li>Price setting</li>
          <li>Image upload</li>
          <li>Category selection</li>
          <li>Location details</li>
        </ul>
      </div>
    </div>
  );
}

export default NewListingPage;
