import React from 'react';
import './AboutPage.css';

function AboutPage() {
  return (
    <div className="about-container">
      <h1>About ASU Marketplace</h1>
      <p>Learn more about our platform</p>
      <div className="placeholder-content">
        <p>This page will contain information about ASU Marketplace.</p>
        <p>Content will include:</p>
        <ul>
          <li>Platform mission and vision</li>
          <li>How it works</li>
          <li>Safety guidelines</li>
          <li>Contact information</li>
        </ul>
      </div>
    </div>
  );
}

export default AboutPage;
