import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useLocation } from 'react-router-dom';
import { getUser } from '../../services/slices/UserSlice';
import { useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const location = useLocation();
  const page = location.pathname.match(/\/[a-zA-Z\-]+/)?.[0].slice(1) || '';
  const name = useSelector(getUser)?.name || '';
  return <AppHeaderUI page={page} userName={name} />;
};
