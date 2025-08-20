import { supabase, TABLES, Listing, ALLOWED_TAGS, AllowedTag } from './supabase';

export interface CreateListingData {
  title: string;
  description: string;
  price: number;
  image_url?: string;
  tags: AllowedTag[];
  location: string;
  lat?: number;
  lng?: number;
  quantity: number;
}

export interface UpdateListingData {
  title?: string;
  description?: string;
  price?: number;
  image_url?: string;
  tags?: AllowedTag[];
  location?: string;
  lat?: number;
  lng?: number;
  status?: 'active' | 'sold' | 'inactive';
  quantity?: number;
}

export interface ListingsFilters {
  tags?: AllowedTag[];
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: 'active' | 'sold' | 'inactive';
  search?: string;
}

export class ListingsService {
  // Get all active listings with optional filters
  static async getListings(filters: ListingsFilters = {}, page = 1, limit = 20) {
    let query = supabase
      .from(TABLES.LISTINGS)
      .select(`
        *,
        profiles:user_id (
          id,
          username,
          profile_picture
        )
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.tags && filters.tags.length > 0) {
      query = query.overlaps('tags', filters.tags);
    }

    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    if (filters.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice);
    }

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Error fetching listings: ${error.message}`);
    }

    return { listings: data || [], count: count || 0 };
  }

  // Get a single listing by ID
  static async getListing(id: string) {
    const { data, error } = await supabase
      .from(TABLES.LISTINGS)
      .select(`
        *,
        profiles:user_id (
          id,
          username,
          profile_picture
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Error fetching listing: ${error.message}`);
    }

    return data;
  }

  // Get user's own listings
  static async getUserListings(userId: string) {
    const { data, error } = await supabase
      .from(TABLES.LISTINGS)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching user listings: ${error.message}`);
    }

    return data || [];
  }

  // Create a new listing
  static async createListing(listingData: CreateListingData, userId: string): Promise<Listing> {
    // Validate tags
    const invalidTags = listingData.tags.filter(tag => !ALLOWED_TAGS.includes(tag));
    if (invalidTags.length > 0) {
      throw new Error(`Invalid tags: ${invalidTags.join(', ')}. Allowed tags: ${ALLOWED_TAGS.join(', ')}`);
    }

    const { data, error } = await supabase
      .from(TABLES.LISTINGS)
      .insert([
        {
          ...listingData,
          user_id: userId,
        }
      ])
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating listing: ${error.message}`);
    }

    return data;
  }

  // Update a listing
  static async updateListing(id: string, updates: UpdateListingData, userId: string): Promise<Listing> {
    // Validate tags if provided
    if (updates.tags) {
      const invalidTags = updates.tags.filter(tag => !ALLOWED_TAGS.includes(tag));
      if (invalidTags.length > 0) {
        throw new Error(`Invalid tags: ${invalidTags.join(', ')}. Allowed tags: ${ALLOWED_TAGS.join(', ')}`);
      }
    }

    const { data, error } = await supabase
      .from(TABLES.LISTINGS)
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId) // Ensure user owns the listing
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating listing: ${error.message}`);
    }

    return data;
  }

  // Delete a listing
  static async deleteListing(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from(TABLES.LISTINGS)
      .delete()
      .eq('id', id)
      .eq('user_id', userId); // Ensure user owns the listing

    if (error) {
      throw new Error(`Error deleting listing: ${error.message}`);
    }
  }

  // Get all allowed tags
  static getAllowedTags(): AllowedTag[] {
    return [...ALLOWED_TAGS];
  }

  // Search listings by text
  static async searchListings(searchTerm: string, limit = 20) {
    const { data, error } = await supabase
      .from(TABLES.LISTINGS)
      .select(`
        *,
        profiles:user_id (
          id,
          username,
          profile_picture
        )
      `)
      .eq('status', 'active')
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Error searching listings: ${error.message}`);
    }

    return data || [];
  }
}
