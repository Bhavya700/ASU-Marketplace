import React from 'react';
import './PurchaseHistoryPage.css';

function PurchaseHistoryPage() {
  return (
    <div className="purchase-history-container">
      <h1>Purchase History</h1>
      <p>View your past purchases</p>
      <div className="placeholder-content">
        <p>This page will contain your purchase history.</p>
        <p>Features will include:</p>
        <ul>
          <li>List of completed purchases</li>
          <li>Purchase details and dates</li>
          <li>Seller information</li>
          <li>Transaction status</li>
        </ul>
      </div>
    </div>
  );
}

export default PurchaseHistoryPage;
