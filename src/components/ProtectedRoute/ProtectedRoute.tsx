import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';
import {
  selectIsAuthChecked,
  selectUser
} from '../../services/slices/userSlice';

type ProtectedRouteProps = {
  children: React.ReactElement;
  isAuthed?: boolean;
};

export const ProtectedRoute = ({
  isAuthed = false,
  children
}: ProtectedRouteProps) => {
  const user = useSelector(selectUser);
  const authChecked = useSelector(selectIsAuthChecked);
  const location = useLocation();

  if (!authChecked) {
    return <Preloader />;
  }

  if (isAuthed && user) {
    const from = location.state?.from || {
      pathname: '/'
    };

    return <Navigate to={from} replace />;
  }

  if (!isAuthed && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
