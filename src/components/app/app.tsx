import { useCallback, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import { IngredientDetailsContainer } from '@components/ingredient-details-container/ingredient-details-container';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { FeedPage } from '@pages/feed/feed-page';
import { ForgotPasswordPage } from '@pages/forgot-password/forgot-password-page';
import { Home } from '@pages/home/home';
import { IngredientPage } from '@pages/ingredient/ingredient-page';
import { LoginPage } from '@pages/login/login-page';
import { NotFoundPage } from '@pages/not-found/not-found-page';
import { ProfileLayout } from '@pages/profile-layout/profile-layout';
import { ProfileOrdersPage } from '@pages/profile-orders/profile-orders-page';
import { ProfilePage } from '@pages/profile/profile-page';
import { RegisterPage } from '@pages/register/register-page';
import { ResetPasswordPage } from '@pages/reset-password/reset-password-page';
import { checkUserAuth } from '@services/auth/actions';
import { clearConstructor } from '@services/burger-constructor/slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { fetchIngredients } from '@services/ingredients/actions';
import { clearOrder, getOrderNumber } from '@services/order/slice';

import { ProtectedRoute } from '../protected-route/protected-route';

import type { Location } from 'react-router-dom';

import styles from './app.module.css';

type TLocationState = {
  backgroundLocation?: Location;
};

export const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const orderNumber = useAppSelector(getOrderNumber);

  const locationState = location.state as TLocationState | null;
  const backgroundLocation = locationState?.backgroundLocation;

  useEffect(() => {
    void dispatch(fetchIngredients());
    void dispatch(checkUserAuth());
  }, [dispatch]);

  const handleCloseIngredientModal = useCallback((): void => {
    void navigate(-1);
  }, [navigate]);

  const handleCloseOrderModal = useCallback((): void => {
    dispatch(clearOrder());
    dispatch(clearConstructor());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={backgroundLocation ?? location}>
        <Route path="/" element={<Home />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/ingredients/:id" element={<IngredientPage />} />
        <Route
          path="/login"
          element={
            <ProtectedRoute onlyUnAuth>
              <LoginPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute onlyUnAuth>
              <RegisterPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPasswordPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPasswordPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfileLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ProfilePage />} />
          <Route path="orders" element={<ProfileOrdersPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <Modal title="Детали ингредиента" onClose={handleCloseIngredientModal}>
                <IngredientDetailsContainer />
              </Modal>
            }
          />
        </Routes>
      )}

      {orderNumber && (
        <Modal onClose={handleCloseOrderModal}>
          <OrderDetails />
        </Modal>
      )}
    </div>
  );
};

export default App;
