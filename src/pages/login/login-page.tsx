import {
  Button,
  EmailInput,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { Link } from 'react-router-dom';

import { loginUser } from '@services/auth/actions';
import { getAuthError, getAuthLoading } from '@services/auth/slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';

import { useForm } from '../../hooks/use-form';

import type { FormEvent } from 'react';

import styles from '../auth-form.module.css';

export const LoginPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(getAuthLoading);
  const error = useAppSelector(getAuthError);

  const { values, handleChange } = useForm({
    email: '',
    password: '',
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    void dispatch(loginUser(values));
  };

  return (
    <main className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <h1 className="text text_type_main-medium mt-0 mb-6">Вход</h1>

        <EmailInput
          name="email"
          value={values.email}
          placeholder="E-mail"
          onChange={handleChange}
          extraClass="mb-6"
          required
        />

        <PasswordInput
          name="password"
          value={values.password}
          placeholder="Пароль"
          onChange={handleChange}
          extraClass="mb-6"
          required
        />

        <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
          {isLoading ? 'Вход...' : 'Войти'}
        </Button>

        <p className={`${styles.error} text text_type_main-default mt-6 mb-0`}>
          {error}
        </p>

        <div className={`${styles.links} mt-10`}>
          <p className="text text_type_main-default text_color_inactive m-0">
            Вы — новый пользователь?{' '}
            <Link className={styles.link} to="/register">
              Зарегистрироваться
            </Link>
          </p>

          <p className="text text_type_main-default text_color_inactive m-0">
            Забыли пароль?{' '}
            <Link className={styles.link} to="/forgot-password">
              Восстановить пароль
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
};
