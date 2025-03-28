
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://btkehyaxzttrzjcaofav.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0a2VoeWF4enR0cnpqY2FvZmF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxOTIzNjcsImV4cCI6MjA1ODc2ODM2N30.41vUltVdXwgFobW9GKFKYYPIHApELyjSq600Wm75vDg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      headers: {
        'x-client-info': 'socialcalendar-app',
      },
    },
  }
);

/**
 * Helper function to safely get items from localStorage
 * @param key The key to retrieve from localStorage
 * @returns The parsed JSON value or null if not found/invalid
 */
export const getFromLocalStorage = (key: string) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return null;
  }
};

/**
 * Helper function to safely set items in localStorage
 * @param key The key to set in localStorage
 * @param value The value to store
 */
export const setInLocalStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error storing ${key} in localStorage:`, error);
  }
};

/**
 * Fetch clients from Supabase
 */
export const fetchClients = async () => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching clients:', error);
    return [];
  }
};

/**
 * Fetch posts for a specific client from Supabase
 */
export const fetchClientPosts = async (clientId: string) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('clientid', clientId)
      .order('date');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching posts for client ${clientId}:`, error);
    return [];
  }
};

/**
 * Add or update a post in Supabase
 */
export const savePost = async (post: any) => {
  try {
    // If post has an id, update it, otherwise insert a new one
    const { data, error } = post.id ? 
      await supabase
        .from('posts')
        .update(post)
        .eq('id', post.id)
        .select() :
      await supabase
        .from('posts')
        .insert(post)
        .select();
    
    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error('Error saving post:', error);
    return null;
  }
};

/**
 * Delete a post from Supabase
 */
export const deletePost = async (postId: number) => {
  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error deleting post ${postId}:`, error);
    return false;
  }
};

/**
 * Fetch a client by ID with optional password verification
 */
export const fetchClientById = async (clientId: string, password?: string) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single();
    
    if (error) throw error;
    
    // If password is provided, verify it matches
    if (password && data.password && data.password !== password) {
      return null;
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching client ${clientId}:`, error);
    return null;
  }
};

/**
 * Save client to Supabase
 */
export const saveClient = async (client: any) => {
  try {
    // If client has an id, update it, otherwise insert a new one
    const { data, error } = client.id ? 
      await supabase
        .from('clients')
        .update(client)
        .eq('id', client.id)
        .select() :
      await supabase
        .from('clients')
        .insert(client)
        .select();
    
    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error('Error saving client:', error);
    return null;
  }
};
