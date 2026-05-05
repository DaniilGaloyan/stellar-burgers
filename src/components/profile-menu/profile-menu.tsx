import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../services/store';
import { logout } from '../../services/slices/authSlice';
import { ProfileMenuUI } from '@ui';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
