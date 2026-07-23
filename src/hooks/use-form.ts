import { useState } from 'react';

import type { ChangeEvent, Dispatch, SetStateAction } from 'react';

type TFormValues = Record<string, string>;

type TUseFormReturn<T extends TFormValues> = {
  values: T;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  setValues: Dispatch<SetStateAction<T>>;
};

export const useForm = <T extends TFormValues>(initialValues: T): TUseFormReturn<T> => {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  };

  return {
    values,
    handleChange,
    setValues,
  };
};
