import { animateSlides } from 'components/AnimatedsPage/AnimatedPage';
import { FullSlider } from 'components/FullSlider/FullSlider';
import { Page } from 'components/Page';
import { VisibleDiv } from 'components/VisibleDiv/VisibleDiv';
import useAppData from 'hooks/useAppData';
import { useCallback, useEffect, useRef, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { DrawerEvents } from './DrawerEvents/DrawerEvents';
import { PopinVenue } from './PopinVenue/PopinVenue';
import styles from './styles.module.scss';

export function Events() {
    const rootRef = useRef<HTMLDivElement>(null);
    const introRef = useRef<HTMLDivElement>(null);
    const [drawerEvent, setDrawerEvent] = useState<EventData>();
    const [venueVisible, setVenueVisible] = useState(false);
    const [artworksVisible, setArtworksVisible] = useState(false);
    const events = useAppData().events;
    const [pageVisible, setPageVisible] = useState(false);

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

    useEffect(() => {
        const visible = pageVisible && !venueVisible;
        animateSlides(visible, rootRef.current!, styles.slide, styles.slide_content);
    }, [pageVisible, venueVisible]);

    return (
        <Page //
            ref={rootRef}
            name="events"
            onVisibleChange={setPageVisible}
        >
            <div className={styles.page_events}>
                <VisibleDiv visible={pageVisible && !venueVisible} className={styles.content} hiddenClassName={styles.content_hidden}>
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
                </VisibleDiv>

                <DrawerEvents visible={!!drawerEvent} event={drawerEvent} close={closeDrawer} openVenue={openVenue} openArtworks={openArtworks} />

                <PopinVenue visible={pageVisible && venueVisible} close={closeVenue} />
            </div>
        </Page>
    );
}
