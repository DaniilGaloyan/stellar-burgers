import { FC } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectUser } from '../../services/slices/authSlice';

interface OnlyUnAuthRouteProps {
  children: JSX.Element;
}

export const OnlyUnAuthRoute: FC<OnlyUnAuthRouteProps> = ({ children }) => {
  const user = useSelector(selectUser);

  if (user) {
    return <Navigate to='/' replace />;
  }

  return children;
};
