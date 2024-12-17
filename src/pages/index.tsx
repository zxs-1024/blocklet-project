import { Box, CircularProgress } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import ProfileCard from '../components/profile-card';
import type { Profile } from '../types/profile';

export default function HomePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const id = 1;
      const response = await fetch(`/api/profile/${id}`);
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = useCallback(async (updatedProfile: Profile) => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProfile),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      if (data.success) {
        setProfile(updatedProfile);
        toast.success(data.message);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error(error.message || '用户信息更新失败');
      console.error('Error saving profile:', error);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#1a1b2e', minHeight: '100vh' }}>
      <Toaster />
      {profile && <ProfileCard profile={profile} onSave={handleSaveProfile} />}
    </Box>
  );
}
