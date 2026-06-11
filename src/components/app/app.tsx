import {
  ConstructorPage,
  Login,
  NotFound404,
  Feed,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders
} from '@pages';
import { Modal } from '../modal';
import { AppHeader } from '@components';
import styles from './app.module.css';
import { OrderInfo } from '../order-info';
import { IngredientDetails } from '../ingredient-details';
import { useEffect } from 'react';
import { useDispatch } from '../../services/store';
import { useLocation, useNavigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route/protected-route';
import { getIngredients } from '../../services/slices/ingredientsSlice';
import { checkingUserAuth } from '../../services/slices/userSlice';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;

  const handleCloseModal = () => {
    navigate(-1);
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getIngredients());
  }, [dispatch]);

  useEffect(() => {
    dispatch(checkingUserAuth());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      {
        <Routes location={background || location}>
          <Route path='/' element={<ConstructorPage />} />
          <Route path='/feed' element={<Feed />} />

          <Route
            path='/login'
            element={
              <ProtectedRoute onlyUnAuth>
                <Login />
              </ProtectedRoute>
            }
          />

          <Route
            path='/register'
            element={
              <ProtectedRoute onlyUnAuth>
                <Register />
              </ProtectedRoute>
            }
          />

          <Route
            path='/forgot-password'
            element={
              <ProtectedRoute onlyUnAuth>
                <ForgotPassword />
              </ProtectedRoute>
            }
          />

          <Route
            path='/reset-password'
            element={
              <ProtectedRoute onlyUnAuth>
                <ResetPassword />
              </ProtectedRoute>
            }
          />

          <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path='/profile/orders'
            element={
              <ProtectedRoute>
                <ProfileOrders />
              </ProtectedRoute>
            }
          />

          <Route path='/ingredients/:id' element={<IngredientDetails />} />
          <Route path='/feed/:number' element={<OrderInfo />} />

          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <OrderInfo />
              </ProtectedRoute>
            }
          />

          <Route path='*' element={<NotFound404 />} />
        </Routes>
      }
      {background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleCloseModal}>
                <IngredientDetails />
              </Modal>
            }
          />

          <Route
            path='/feed/:number'
            element={
              <Modal title='Информация о заказе' onClose={handleCloseModal}>
                <OrderInfo />
              </Modal>
            }
          />

          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal title='Информация о заказе' onClose={handleCloseModal}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
