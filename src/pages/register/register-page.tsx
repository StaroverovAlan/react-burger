import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { registerUser } from '@services/auth/actions';
import { getAuthError, getAuthLoading } from '@services/auth/slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';

import type { ChangeEvent, FormEvent } from 'react';

import styles from '../auth-form.module.css';

export const RegisterPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(getAuthLoading);
  const error = useAppSelector(getAuthError);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    void dispatch(registerUser({ name, email, password }));
  };

  return (
    <main className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <h1 className="text text_type_main-medium mt-0 mb-6">Регистрация</h1>

        <Input
          name="name"
          value={name}
          placeholder="Имя"
          onChange={handleNameChange}
          extraClass="mb-6"
          required
        />

        <EmailInput
          name="email"
          value={email}
          placeholder="E-mail"
          onChange={handleEmailChange}
          extraClass="mb-6"
          required
        />

        <PasswordInput
          name="password"
          value={password}
          placeholder="Пароль"
          onChange={handlePasswordChange}
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
