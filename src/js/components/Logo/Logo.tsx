import { Link } from 'react-router-dom';
import styles from './styles.module.scss';

export function Logo() {
    return <Link to="/" className={styles.logo} />;
}
