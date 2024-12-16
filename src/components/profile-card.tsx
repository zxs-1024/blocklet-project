import EditIcon from '@mui/icons-material/Edit';
import { Avatar, Box, Button, IconButton, TextField, styled } from '@mui/material';
import React, { useState } from 'react';

import type { Profile } from '../types/profile';

const StyledContainer = styled(Box)({
  maxWidth: '100%',
  margin: 'auto',
  padding: '20px',
  backgroundColor: '#1a1b2e',
  borderRadius: '20px',
  color: 'white',
  height: '100%',
  minHeight: 'calc(100vh - 40px)',
});

const StyledHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
  height: '40px',
  '& h1': {
    margin: 0,
    fontSize: '20px',
    fontWeight: 'normal',
  },
});

const StyledAvatar = styled(Box)({
  position: 'relative',
  width: '120px',
  height: '120px',
  margin: '20px auto',
  '& .MuiAvatar-root': {
    width: '100%',
    height: '100%',
  },
  '& .edit-icon': {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#7f7fd5',
    borderRadius: '50%',
    padding: '8px',
  },
});

const StyledTextField = styled(TextField)({
  marginBottom: '20px',
  width: '100%',
  '& .MuiOutlinedInput-root': {
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    '&.Mui-disabled': {
      backgroundColor: 'transparent',
      color: 'rgba(255, 255, 255, 0.8)',
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      '& input': {
        '-webkit-text-fill-color': 'rgba(255, 255, 255, 0.8)',
      },
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-disabled': {
      color: 'rgba(255, 255, 255, 0.7)',
    },
  },
});

const SaveButton = styled(Button)({
  width: '100%',
  padding: '12px',
  backgroundColor: '#7ee2ff',
  color: '#1a1b2e',
  borderRadius: '12px',
  '&:hover': {
    backgroundColor: '#6cc8e6',
  },
});

interface ProfileCardProps {
  profile: Profile;
  onSave: (profile: Profile) => Promise<void>;
}

export default function ProfileCard({ profile, onSave }: ProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Profile>(profile);

  const handleEdit = () => {
    setEditedProfile(profile);
    setIsEditing(true);
  };

  const handleSave = async () => {
    await onSave(editedProfile);
    setIsEditing(false);
  };

  const handleChange = (field: keyof Profile) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedProfile((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  return (
    <StyledContainer>
      <StyledHeader>
        <h1>{isEditing ? '编辑信息' : '个人信息'}</h1>
        <IconButton
          onClick={isEditing ? undefined : handleEdit}
          sx={{
            color: 'white',
            visibility: isEditing ? 'hidden' : 'visible',
            width: '40px',
            height: '40px',
          }}>
          <EditIcon />
        </IconButton>
      </StyledHeader>

      <StyledAvatar>
        <Avatar src={isEditing ? editedProfile.avatar : profile.avatar} alt={profile.username} />
        {isEditing && (
          <IconButton className="edit-icon" size="small">
            <EditIcon sx={{ color: 'white', fontSize: '16px' }} />
          </IconButton>
        )}
      </StyledAvatar>

      {isEditing ? (
        <Box>
          <StyledTextField label="姓名" value={editedProfile.username} onChange={handleChange('username')} />
          <StyledTextField label="电话号码" value={editedProfile.phone} onChange={handleChange('phone')} />
          <StyledTextField label="Email" value={editedProfile.email} onChange={handleChange('email')} type="email" />
          <StyledTextField label="个人介绍" value={editedProfile.bio} onChange={handleChange('bio')} />
          <Box mt={4}>
            <SaveButton onClick={handleSave}>保存</SaveButton>
          </Box>
        </Box>
      ) : (
        <Box>
          <StyledTextField label="姓名" value={profile.username} disabled />
          <StyledTextField label="电话号码" value={profile.phone} disabled />
          <StyledTextField label="Email" value={profile.email} disabled />
          <StyledTextField label="个人介绍" value={profile.bio} disabled />
        </Box>
      )}
    </StyledContainer>
  );
}
