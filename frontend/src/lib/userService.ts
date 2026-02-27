import { API_URL } from './config';

export interface UserProfile {
  id: string;
  email: string;
  user_metadata: any;
  created_at: string;
  avatar_url?: string;
  display_name?: string;
}

export const userService = {
  async getProfile(): Promise<UserProfile> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/users/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    const result = await response.json();
    return result.data;
  },

  async updateProfile(data: { display_name?: string; avatar_url?: string }): Promise<UserProfile> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    const result = await response.json();
    return result.data;
  },

  async uploadAvatar(file: File): Promise<{ avatar_url: string }> {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);

    console.log('📤 Uploading avatar...');
    console.log('   File:', file.name, file.size, 'bytes');

    const response = await fetch(`${API_URL}/users/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload avatar');
    }

    const result = await response.json();
    console.log('✅ Avatar uploaded:', result.data.avatar_url);
    return result.data;
  },
};
