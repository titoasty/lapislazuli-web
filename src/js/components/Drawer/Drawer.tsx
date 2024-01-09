import classNames from 'classnames';
import useClickOutside from 'hooks/useClickOutside';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './styles.module.scss';

export function DrawerTitle({ className, children, ...props }: any) {
    return (
        <div className={classNames(styles.title, className)} {...props}>
            {children}
        </div>
    );
}

export function DrawerClose({ className, children, ...props }: any) {
    return (
        <div className={classNames(styles.btnClose, className)} {...props}>
            {children}
        </div>
    );
}

export function Drawer({ visible, hideCloseBtn, close, className, children, ...props }: any) {
    const rootRef = useClickOutside(close);

    useEffect(() => {
        if (!visible) {
            return;
        }

        const onKeyDown = (evt: KeyboardEvent) => {
            if (evt.key === 'Escape') {
                close?.();
            }
        };

        window.addEventListener('keydown', onKeyDown);

        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [visible]);

    return createPortal(
        <div ref={rootRef} className={classNames(styles.drawer, !visible && styles.drawer_hidden, className)} {...props}>
            {!hideCloseBtn && <DrawerClose onClick={close} />}
            <div className={styles.content}>{children}</div>
        </div>,
        document.body
    );
}
