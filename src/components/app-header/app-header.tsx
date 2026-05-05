import { FC } from 'react';
import { useSelector } from 'react-redux';
import { AppHeaderUI } from '@ui';
import { selectUser } from '../../services/slices/authSlice';

export const AppHeader: FC = () => {
  const user = useSelector(selectUser);
  const userName = user?.name || undefined;

  return <AppHeaderUI userName={userName} />;
};
