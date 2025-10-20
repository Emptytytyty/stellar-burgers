import { ReactNode } from 'react';

type ProtectedRouteProps = {
  children: ReactNode;
  onlyUnAuth?: boolean;
};
export default ProtectedRouteProps;
