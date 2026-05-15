import { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../services/store';
import {
  selectIsAuthChecked,
  selectUser
} from '../../services/slices/authSlice';
import { Preloader } from '@ui';

interface ProtectedRouteProps {
  children: JSX.Element;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const user = useAppSelector(selectUser);
  const isAuthChecked = useAppSelector(selectIsAuthChecked);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
