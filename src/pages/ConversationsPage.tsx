import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ConversationsService } from '../lib/conversationsService';
import './ConversationsPage.css';

function ConversationsPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();

  useEffect(() => {
    if (profile) {
      fetchConversations();
    }
  }, [profile]);

  const fetchConversations = async () => {
    if (!profile) return;
    
    try {
      setLoading(true);
      const userConversations = await ConversationsService.getUserConversations(profile.id);
      setConversations(userConversations);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConversationClick = (conversationId: string) => {
    navigate(`/conversations/${conversationId}`);
  };

  const getConversationTitle = (conversation: any) => {
    if (conversation.listings && conversation.listings.title) {
      return conversation.listings.title;
    }
    
    // Get other participant's name
    const otherParticipant = conversation.conversation_participants?.find(
      (p: any) => p.user_id !== profile?.id
    );
    
    if (otherParticipant?.profiles?.username) {
      return `Chat with ${otherParticipant.profiles.username}`;
    }
    
    return 'Conversation';
  };

  const getLastMessage = (conversation: any) => {
    if (conversation.messages && conversation.messages.length > 0) {
      const lastMessage = conversation.messages[conversation.messages.length - 1];
      return lastMessage.content;
    }
    return 'No messages yet';
  };

  const getLastMessageTime = (conversation: any) => {
    if (conversation.messages && conversation.messages.length > 0) {
      const lastMessage = conversation.messages[conversation.messages.length - 1];
      return new Date(lastMessage.created_at).toLocaleDateString();
    }
    return new Date(conversation.created_at).toLocaleDateString();
  };

  if (!profile) {
    return (
      <div className="conversations-container">
        <div className="auth-required">
          <h2>Authentication Required</h2>
          <p>You must be logged in to view your conversations.</p>
          <button onClick={() => navigate('/login')} className="login-btn">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="conversations-container">
        <div className="loading">Loading conversations...</div>
      </div>
    );
  }

  return (
    <div className="conversations-container">
      <div className="conversations-header">
        <h1>Conversations</h1>
        <p>Your marketplace conversations and messages</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {conversations.length === 0 ? (
        <div className="no-conversations">
          <h3>No Conversations Yet</h3>
          <p>You haven't started any conversations yet. Browse listings and message sellers to get started!</p>
          <button 
            onClick={() => navigate('/explore')} 
            className="browse-listings-btn"
          >
            Browse Listings
          </button>
        </div>
      ) : (
        <div className="conversations-list">
          {conversations.map(conversation => (
            <div 
              key={conversation.id} 
              className="conversation-item"
              onClick={() => handleConversationClick(conversation.id)}
            >
              <div className="conversation-avatar">
                <img 
                  src="/asu-logo.png" 
                  alt="Avatar"
                  className="avatar-image"
                />
              </div>
              
              <div className="conversation-content">
                <div className="conversation-header">
                  <h3 className="conversation-title">
                    {getConversationTitle(conversation)}
                  </h3>
                  <span className="conversation-time">
                    {getLastMessageTime(conversation)}
                  </span>
                </div>
                
                <p className="conversation-preview">
                  {getLastMessage(conversation)}
                </p>
                
                {conversation.listings && (
                  <div className="conversation-listing">
                    <span className="listing-label">About:</span>
                    <span className="listing-title">{conversation.listings.title}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ConversationsPage;
