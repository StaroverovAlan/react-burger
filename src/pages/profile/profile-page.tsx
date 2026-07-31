import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo, useState } from 'react';

import { updateUser } from '@services/auth/actions';
import { getAuthError, getAuthLoading, getUser } from '@services/auth/slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';

import type { TUpdateUserRequest } from '@utils/types';
import type { ChangeEvent, FormEvent } from 'react';

import styles from './profile-page.module.css';

type TProfileForm = {
  name: string;
  email: string;
  password: string;
};

export const ProfilePage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(getUser);
  const isLoading = useAppSelector(getAuthLoading);
  const error = useAppSelector(getAuthError);

  const initialForm = useMemo<TProfileForm>(
    () => ({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
    }),
    [user]
  );

  const [form, setForm] = useState<TProfileForm>(initialForm);

  useEffect(() => {
    setForm(initialForm);
  }, [initialForm]);

  const isChanged =
    form.name !== initialForm.name ||
    form.email !== initialForm.email ||
    form.password !== initialForm.password;

  const handleChange =
    (field: keyof TProfileForm) =>
    (event: ChangeEvent<HTMLInputElement>): void => {
      setForm((currentForm) => ({
        ...currentForm,
        [field]: event.target.value,
      }));
    };

  const handleCancel = (): void => {
    setForm(initialForm);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (!isChanged) {
      return;
    }

    const updateData: TUpdateUserRequest = {};

    if (form.name !== initialForm.name) {
      updateData.name = form.name;
    }

    if (form.email !== initialForm.email) {
      updateData.email = form.email;
    }

    if (form.password) {
      updateData.password = form.password;
    }

    void dispatch(updateUser(updateData))
      .unwrap()
      .then(() => {
        setForm((currentForm) => ({
          ...currentForm,
          password: '',
        }));
      })
      .catch(() => undefined);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <Input
        name="name"
        value={form.name}
        placeholder="Имя"
        icon="EditIcon"
        onChange={handleChange('name')}
        extraClass="mb-6"
      />

      <Input
        name="email"
        type="email"
        value={form.email}
        placeholder="Логин"
        icon="EditIcon"
        onChange={handleChange('email')}
        extraClass="mb-6"
      />

      <Input
        name="password"
        type="password"
        value={form.password}
        placeholder="Пароль"
        icon="EditIcon"
        onChange={handleChange('password')}
        extraClass="mb-6"
      />

      {isChanged && (
        <div className={styles.actions}>
          <Button
            htmlType="button"
            type="secondary"
            size="medium"
            onClick={handleCancel}
          >
            Отмена
          </Button>

          <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
            {isLoading ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
      )}

      <p className={`${styles.error} text text_type_main-default mt-6 mb-0`}>{error}</p>
    </form>
  );
};
