import React from 'react';
import './ConversationsPage.css';

function ConversationsPage() {
  return (
    <div className="conversations-container">
      <h1>Conversations</h1>
      <p>Your messages with other Sun Devils appear here.</p>
      <div className="placeholder-content">
        <p>Select a conversation from the sidebar or start a new chat from a listing.</p>
      </div>
    </div>
  );
}

export default ConversationsPage;
