import classnames from 'classnames';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.scss';

let _setVisible: any;
export const setLogoVisible = (visible: boolean) => _setVisible?.(visible);

export function Logo() {
    const [visible, setVisible] = useState(true);
    _setVisible = setVisible;

    return <Link to="/" className={classnames(styles.logo, !visible && styles.logo_hidden)} />;
}
