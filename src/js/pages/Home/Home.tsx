import classnames from 'classnames';
import { useCallback, useState } from 'react';
import { enterVenice } from './Home3D';
import styles from './styles.module.scss';

export function Home() {
    const [btnVisible, setBtnVisible] = useState(true);

    const enter = useCallback(() => {
        setBtnVisible(false);
        enterVenice();
    }, []);

    return (
        <div className={styles.page_home}>
            <div className={classnames(styles.btnEnter, !btnVisible && styles.btnEnter_hidden)} onClick={enter}>
                ENTER
            </div>
        </div>
    );
}
