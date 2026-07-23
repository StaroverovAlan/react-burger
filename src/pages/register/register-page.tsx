import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { Link } from 'react-router-dom';

import { registerUser } from '@services/auth/actions';
import { getAuthError, getAuthLoading } from '@services/auth/slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';

import { useForm } from '../../hooks/use-form';

import type { FormEvent } from 'react';

import styles from '../auth-form.module.css';

export const RegisterPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(getAuthLoading);
  const error = useAppSelector(getAuthError);

  const { values, handleChange } = useForm({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    void dispatch(registerUser(values));
  };

  return (
    <main className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <h1 className="text text_type_main-medium mt-0 mb-6">Регистрация</h1>

        <Input
          name="name"
          value={values.name}
          placeholder="Имя"
          onChange={handleChange}
          extraClass="mb-6"
          required
        />

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
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </Button>

        <p className={`${styles.error} text text_type_main-default mt-6 mb-0`}>
          {error}
        </p>

        <div className={`${styles.links} mt-20`}>
          <p className="text text_type_main-default text_color_inactive m-0">
            Уже зарегистрированы?{' '}
            <Link className={styles.link} to="/login">
              Войти
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
};
