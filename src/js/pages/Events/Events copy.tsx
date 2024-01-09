import { AnimatedPage, animateSlides } from 'components/AnimatedsPage/AnimatedPage';
import { FullSlider } from 'components/FullSlider/FullSlider';
import useAppData from 'hooks/useAppData';
import { useCallback, useRef, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { DrawerEvents } from './DrawerEvents/DrawerEvents';
import { PopinVenue } from './PopinVenue/PopinVenue';
import styles from './styles.module.scss';
import { AnimatePresence } from 'framer-motion';

export function Events() {
    const rootRef = useRef<HTMLDivElement>(null);
    const introRef = useRef<HTMLDivElement>(null);
    const [drawerEvent, setDrawerEvent] = useState<EventData>();
    const [venueVisible, setVenueVisible] = useState(false);
    const [artworksVisible, setArtworksVisible] = useState(false);
    const events = useAppData().events;

    const openDrawer = useCallback((evt: any, swiper: any, slideIndex: number, event: EventData) => {
        swiper.slideTo(slideIndex);
        setDrawerEvent(event);
    }, []);

    const closeDrawer = useCallback(() => {
        setDrawerEvent(undefined);
    }, []);

    const openVenue = useCallback((event: any) => {
        setVenueVisible(true);
        setDrawerEvent(undefined);
    }, []);

    const closeVenue = useCallback(() => {
        setVenueVisible(false);
    }, []);

    const openArtworks = useCallback((event: any) => {
        setArtworksVisible(true);
        setDrawerEvent(undefined);
    }, []);

    const closeArtworks = useCallback(() => {
        setArtworksVisible(false);
    }, []);

    const onAnimationStart = useCallback((visible: boolean) => {
        animateSlides(visible, rootRef.current!, styles.slide, styles.slide_content);
    }, []);

    return (
        <AnimatedPage //
            ref={rootRef}
            name="events"
            className={styles.page_events}
            hiddenClassName={styles.page_events_hidden}
            onAnimationStart={onAnimationStart}
        >
            {!venueVisible && (
                <FullSlider
                    slideClassName={styles.slide}
                    spaceBetween={40}
                    slides={events.map((event, idx) => ({
                        onClick: (evt, swiper, slideIndex) => openDrawer(evt, swiper, slideIndex, event),
                        content: (
                            <>
                                <div className={styles.slide_content}>
                                    <div className={styles.image} />
                                    <div className={styles.type}>{event.type}</div>
                                </div>
                                {idx === 0 && (
                                    <div ref={introRef} className={styles.intro}>
                                        <div className={styles.title}>EVENTS</div>
                                        <div className={styles.desc}>
                                            Japanese contemporary artist Takashi Murakami is a master of mediums, working with painting, sculpture, fashion, film, and even animation.{' '}
                                            <b>His influence on Japan equals that of Andy Warhol on America. However, the art of Takashi Murakami unites Japanese and Western elements to create unique, fantastical worlds that are cute and scary.</b>
                                        </div>
                                    </div>
                                )}
                            </>
                        ),
                    }))}
                />
            )}

            <DrawerEvents visible={!!drawerEvent} event={drawerEvent} close={closeDrawer} openVenue={openVenue} openArtworks={openArtworks} />

            <AnimatePresence>{venueVisible && <PopinVenue visible={true} close={closeVenue} />}</AnimatePresence>
        </AnimatedPage>
    );
}
