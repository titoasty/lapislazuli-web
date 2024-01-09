import { FullSlider } from 'components/FullSlider/FullSlider';
import styles from './styles.module.scss';

export function PopinVenue() {
    return (
        <div className={styles.popinVenue}>
            <FullSlider
                slides={[
                    {
                        content: <></>,
                    },
                ]}
                topContent={
                    <div className={styles.top}>
                        <div className={styles.title}>H2O WATER DIARIES</div>
                        <div className={styles.back}>
                            <div className={styles.icon} />
                            BACK
                        </div>
                    </div>
                }
            />
        </div>
    );
}
