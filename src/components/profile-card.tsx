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

interface ValidationErrors {
  username?: string;
  phone?: string;
  email?: string;
}

interface ProfileCardProps {
  profile: Profile;
  onSave: (profile: Profile) => Promise<void>;
}

export default function ProfileCard({ profile, onSave }: ProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Profile>(profile);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // 验证姓名
    if (!editedProfile?.username?.trim()) {
      newErrors.username = '姓名不能为空';
    } else if (editedProfile?.username?.length < 2) {
      newErrors.username = '姓名至少需要2个字符';
    }

    // 验证手机号码
    if (!editedProfile?.phone?.trim()) {
      newErrors.phone = '手机号码不能为空';
    } else if (editedProfile?.phone) {
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(editedProfile.phone)) {
        newErrors.phone = '请输入有效的手机号码';
      }
    }

    // 验证邮箱
    if (editedProfile?.email?.trim()) {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailRegex.test(editedProfile.email)) {
        newErrors.email = '请输入有效的邮箱地址';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = () => {
    setEditedProfile(profile);
    setErrors({});
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (validateForm()) {
      await onSave(editedProfile);
      setIsEditing(false);
      setErrors({});
    }
  };

  const handleChange = (field: keyof Profile) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedProfile((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    // 清除对应字段的错误信息
    if (errors[field as keyof ValidationErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
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
          <StyledTextField
            label="姓名"
            value={editedProfile.username}
            onChange={handleChange('username')}
            error={!!errors.username}
            helperText={errors.username}
            required
          />
          <StyledTextField
            label="手机号码"
            value={editedProfile.phone}
            onChange={handleChange('phone')}
            error={!!errors.phone}
            helperText={errors.phone}
            required
          />
          <StyledTextField
            label="Email"
            value={editedProfile.email}
            onChange={handleChange('email')}
            error={!!errors.email}
            helperText={errors.email}
            type="email"
          />
          <StyledTextField label="个人介绍" value={editedProfile.bio} onChange={handleChange('bio')} />
          <Box mt={4}>
            <SaveButton onClick={handleSave}>保存</SaveButton>
          </Box>
        </Box>
      ) : (
        <Box>
          <StyledTextField label="姓名" value={profile.username} disabled />
          <StyledTextField label="手机号码" value={profile.phone} disabled />
          <StyledTextField label="Email" value={profile.email} disabled />
          <StyledTextField label="个人介绍" value={profile.bio} disabled />
        </Box>
      )}
    </StyledContainer>
  );
}
