import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@services/hooks';
import { resetPassword } from '@services/password/actions';
import { getPasswordError, getPasswordLoading } from '@services/password/slice';
import { isResetPasswordAllowed, removeResetPasswordAllowed } from '@utils/tokens';

import type { ChangeEvent, FormEvent } from 'react';

import styles from '../auth-form.module.css';

export const ResetPasswordPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector(getPasswordLoading);
  const error = useAppSelector(getPasswordError);

  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    if (!isResetPasswordAllowed()) {
      void navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPassword(event.target.value);
  };

  const handleTokenChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setToken(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    void dispatch(resetPassword({ password, token }))
      .unwrap()
      .then(() => {
        removeResetPasswordAllowed();
        void navigate('/login', { replace: true });
      })
      .catch(() => undefined);
  };

  return (
    <main className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <h1 className="text text_type_main-medium mt-0 mb-6">Восстановление пароля</h1>

        <PasswordInput
          name="password"
          value={password}
          placeholder="Введите новый пароль"
          onChange={handlePasswordChange}
          extraClass="mb-6"
          required
        />

        <Input
          name="token"
          value={token}
          placeholder="Введите код из письма"
          onChange={handleTokenChange}
          extraClass="mb-6"
          required
        />

        <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
          {isLoading ? 'Сохранение...' : 'Сохранить'}
        </Button>

        <p className={`${styles.error} text text_type_main-default mt-6 mb-0`}>
          {error}
        </p>

        <div className={`${styles.links} mt-20`}>
          <p className="text text_type_main-default text_color_inactive m-0">
            Вспомнили пароль?{' '}
            <Link className={styles.link} to="/login">
              Войти
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
};
