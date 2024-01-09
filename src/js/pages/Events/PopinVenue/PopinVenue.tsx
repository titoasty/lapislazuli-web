import { animateSlides } from 'components/AnimatedsPage/AnimatedPage';
import { FullSlider } from 'components/FullSlider/FullSlider';
import { VisibleDiv } from 'components/VisibleDiv/VisibleDiv';
import { useEffect, useRef } from 'react';
import styles from './styles.module.scss';

const venueData = [
    {
        imageUrl: '/slide.png',
    },
    {
        imageUrl: '/slide.png',
    },
    {
        imageUrl: '/slide.png',
    },
    {
        imageUrl: '/slide.png',
    },
    {
        imageUrl: '/slide.png',
    },
];

interface PopinVenueProps {
    visible?: boolean;
    close: () => void;
}

export function PopinVenue({ visible, close }: PopinVenueProps) {
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        animateSlides(visible, rootRef.current!, styles.slide, styles.slide_content);
    }, [visible]);

    return (
        <VisibleDiv visible={visible} ref={rootRef} className={styles.popinVenue} hiddenClassName={styles.popinVenue_hidden}>
            <FullSlider
                slideClassName={styles.slide}
                slides={venueData.map((data) => ({
                    content: (
                        <div className={styles.slide_content}>
                            <div className={styles.image} style={{ backgroundImage: `url(${data.imageUrl})` }} />
                        </div>
                    ),
                }))}
                topContent={
                    <div className={styles.top}>
                        <div className={styles.title}>H2O WATER DIARIES</div>
                        <div className={styles.back} onClick={close}>
                            <div className={styles.icon} />
                            BACK
                        </div>
                    </div>
                }
            />
        </VisibleDiv>
    );
}
