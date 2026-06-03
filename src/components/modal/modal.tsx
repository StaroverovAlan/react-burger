import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { ModalOverlay } from '@components/modal-overlay/modal-overlay';

import styles from './modal.module.css';

type TModalProps = {
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
};

export const Modal = ({
  title = '',
  onClose,
  children,
}: TModalProps): React.JSX.Element | null => {
  useEffect((): (() => void) => {
    const handleEscClose = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscClose);

    return (): void => {
      document.removeEventListener('keydown', handleEscClose);
    };
  }, [onClose]);

  const modalRoot = document.getElementById('modals');

  if (!modalRoot) {
    return null;
  }

  return createPortal(
    <>
      <ModalOverlay onClose={onClose} />

      <section className={styles.modal}>
        <div className={styles.header}>
          {title && <h2 className="text text_type_main-large m-0">{title}</h2>}

          <button
            className={styles.close_button}
            type="button"
            onClick={onClose}
            aria-label="Закрыть модальное окно"
          >
            <CloseIcon type="primary" />
          </button>
        </div>

        <div className={styles.content}>{children}</div>
      </section>
    </>,
    modalRoot
  );
};
