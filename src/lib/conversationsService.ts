import { supabase, TABLES, Conversation, Message, ConversationParticipant } from './supabase';

export interface CreateConversationData {
  listing_id?: string;
  participant_ids: string[];
}

export interface SendMessageData {
  conversation_id: string;
  content: string;
}

export class ConversationsService {
  // Get all conversations for a user
  static async getUserConversations(userId: string) {
    const { data, error } = await supabase
      .from(TABLES.CONVERSATIONS)
      .select(`
        *,
        conversation_participants!inner(user_id),
        listings(listing_id, title, image_url),
        messages(
          id,
          content,
          created_at,
          sender_id
        )
      `)
      .eq('conversation_participants.user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching conversations: ${error.message}`);
    }

    return data || [];
  }

  // Get a single conversation with messages
  static async getConversation(conversationId: string, userId: string) {
    // First check if user is participant
    const { data: participantCheck, error: participantError } = await supabase
      .from(TABLES.CONVERSATION_PARTICIPANTS)
      .select('user_id')
      .eq('conversation_id', conversationId)
      .eq('user_id', userId)
      .single();

    if (participantError || !participantCheck) {
      throw new Error('Access denied to this conversation');
    }

    const { data, error } = await supabase
      .from(TABLES.CONVERSATIONS)
      .select(`
        *,
        conversation_participants(
          user_id,
          profiles!inner(id, username, profile_picture)
        ),
        listings(listing_id, title, image_url),
        messages(
          id,
          content,
          created_at,
          sender_id,
          profiles!sender_id(id, username, profile_picture)
        )
      `)
      .eq('id', conversationId)
      .single();

    if (error) {
      throw new Error(`Error fetching conversation: ${error.message}`);
    }

    return data;
  }

  // Create a new conversation
  static async createConversation(conversationData: CreateConversationData): Promise<Conversation> {
    const { data: conversation, error: conversationError } = await supabase
      .from(TABLES.CONVERSATIONS)
      .insert([conversationData])
      .select()
      .single();

    if (conversationError) {
      throw new Error(`Error creating conversation: ${conversationError.message}`);
    }

    // Add participants
    const participants = conversationData.participant_ids.map(userId => ({
      conversation_id: conversation.id,
      user_id: userId
    }));

    const { error: participantsError } = await supabase
      .from(TABLES.CONVERSATION_PARTICIPANTS)
      .insert(participants);

    if (participantsError) {
      throw new Error(`Error adding participants: ${participantsError.message}`);
    }

    return conversation;
  }

  // Send a message in a conversation
  static async sendMessage(messageData: SendMessageData, senderId: string): Promise<Message> {
    // Check if sender is participant
    const { data: participantCheck, error: participantError } = await supabase
      .from(TABLES.CONVERSATION_PARTICIPANTS)
      .select('user_id')
      .eq('conversation_id', messageData.conversation_id)
      .eq('user_id', senderId)
      .single();

    if (participantError || !participantCheck) {
      throw new Error('Access denied to this conversation');
    }

    const { data, error } = await supabase
      .from(TABLES.MESSAGES)
      .insert([
        {
          conversation_id: messageData.conversation_id,
          sender_id: senderId,
          content: messageData.content
        }
      ])
      .select()
      .single();

    if (error) {
      throw new Error(`Error sending message: ${error.message}`);
    }

    // Update conversation's updated_at timestamp
    await supabase
      .from(TABLES.CONVERSATIONS)
      .update({ updated_at: new Date().toISOString() })
      .eq('id', messageData.conversation_id);

    return data;
  }

  // Start a conversation about a listing
  static async startListingConversation(listingId: string, buyerId: string, sellerId: string): Promise<Conversation> {
    // Check if conversation already exists
    const { data: existingConversation, error: checkError } = await supabase
      .from(TABLES.CONVERSATIONS)
      .select(`
        *,
        conversation_participants(user_id)
      `)
      .eq('listing_id', listingId)
      .eq('conversation_participants.user_id', buyerId)
      .eq('conversation_participants.user_id', sellerId)
      .single();

    if (existingConversation) {
      return existingConversation;
    }

    // Create new conversation
    return await this.createConversation({
      listing_id: listingId,
      participant_ids: [buyerId, sellerId]
    });
  }
}
