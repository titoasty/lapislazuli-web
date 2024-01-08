import { Link } from 'react-router-dom';
import styles from './styles.module.scss';

export function Menu() {
    return <div className={styles.menu}>
        <Link to="/artists">ARTISTS</Link>
        <Link to="/events">EVENTS</Link>
        <Link to="/about">ABOUT</Link>
        <div className={styles.search}></div> 
    </div>
}
