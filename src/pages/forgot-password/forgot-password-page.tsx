import { Button, EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { Link, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@services/hooks';
import { forgotPassword } from '@services/password/actions';
import { getPasswordError, getPasswordLoading } from '@services/password/slice';
import { setResetPasswordAllowed } from '@utils/tokens';

import { useForm } from '../../hooks/use-form';

import type { FormEvent } from 'react';

import styles from '../auth-form.module.css';

export const ForgotPasswordPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector(getPasswordLoading);
  const error = useAppSelector(getPasswordError);

  const { values, handleChange } = useForm({
    email: '',
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    void dispatch(forgotPassword(values))
      .unwrap()
      .then(() => {
        setResetPasswordAllowed();
        void navigate('/reset-password');
      })
      .catch(() => undefined);
  };

  return (
    <main className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <h1 className="text text_type_main-medium mt-0 mb-6">Восстановление пароля</h1>

        <EmailInput
          name="email"
          value={values.email}
          placeholder="Укажите e-mail"
          onChange={handleChange}
          extraClass="mb-6"
          required
        />

        <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
          {isLoading ? 'Отправка...' : 'Восстановить'}
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
