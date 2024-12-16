import { Box, CircularProgress } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

import ProfileCard from '../components/profile-card';
import type { Profile } from '../types/profile';

export default function HomePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
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
      if (data.success) {
        setProfile(updatedProfile);
      }
    } catch (error) {
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
      {profile && <ProfileCard profile={profile} onSave={handleSaveProfile} />}
    </Box>
  );
}
