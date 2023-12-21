import classnames from 'classnames';
import useLoaded from 'hooks/useLoaded';
import { useEffect, useState } from 'react';
import styles from './styles.module.scss';

let lastPercent = 0;
let lastTime = Date.now();
let interval: NodeJS.Timer;

export function Loader() {
    const { loaded, loadedPercent } = useLoaded();
    const [number, setNumber] = useState('00');

    useEffect(() => {
        clearInterval(interval);

        if (loaded) {
            setNumber('100');
            return;
        }

        // simulate percentage animation between steps
        const now = Date.now();
        const delta = (now - lastTime) / 1000;
        lastTime = now;

        // we are pessimist on load times
        const speed = (10 * delta) / (loadedPercent - lastPercent);
        const targetPct = loadedPercent;

        interval = setInterval(() => {
            lastPercent += 1;
            const pct = Math.floor(lastPercent);
            setNumber((pct < 10 ? '0' : '') + pct);

            // we reached target
            if (lastPercent >= targetPct) {
                clearInterval(interval);
            }
        }, Math.floor(speed * 1000));
    }, [loadedPercent, loaded]);

    return (
        <div className={classnames(styles.loader, loaded && styles.loader_hidden)}>
            <div className={styles.content}>
                <div className={styles.lapis} />
                <div className={styles.arte} />
                <div className={styles.percent}>{number}</div>
            </div>
        </div>
    );
}
