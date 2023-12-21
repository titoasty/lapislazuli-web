import classnames from 'classnames';
import { setLogoVisible } from 'components/Logo/Logo';
import { hidePainting } from 'pages/Home/Home3D';
import { useCallback, useEffect, useState } from 'react';
import styles from './styles.module.scss';

let _setVisible: any;
export const setPopinPaintingVisible = (visible: boolean) => _setVisible(visible);

export function PopinPainting() {
    const [visible, setVisible] = useState(false);
    _setVisible = setVisible;

    useEffect(() => {
        setLogoVisible(!visible);
    }, [visible]);

    const close = useCallback(() => {
        hidePainting();
    }, []);

    return (
        <div className={classnames(styles.popinPainting, !visible && styles.popinPainting_hidden)}>
            <div className={styles.btnClose} onClick={close} />
        </div>
    );
}
