import { useEffect } from 'react';
import styles from './styles.module.scss';

export function Loader() {
    return (
        <div className={styles.loader}>
            <div className={styles.content}>
                <div className={styles.lapis} />
                <div className={styles.arte} />
            </div>
        </div>
    );
}
