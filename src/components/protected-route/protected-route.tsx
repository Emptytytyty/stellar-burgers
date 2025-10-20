import { useDispatch, useSelector } from '../../services/store';
import type ProtectedRouteProps from './type';
import {
  getIsAuthChecked,
  getIsAuthenticated,
  getUserData
} from '../../services/slices/UserSlice';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';
import { useEffect } from 'react';

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(getIsAuthChecked);
  const isAuthenticated = useSelector(getIsAuthenticated);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !isAuthenticated)
    return <Navigate replace state={{ from: location }} to={'/login'} />;

  if (onlyUnAuth && isAuthenticated) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }
  return <>{children}</>;
};
