import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';

import useWindowSize from 'hooks/useWindowSize';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { A11y, FreeMode, Keyboard, Mousewheel } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

export function Events() {
    const swiperRef = useRef<any>();
    const scrollbarRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const introRef = useRef<HTMLDivElement>(null);
    const windowSize = useWindowSize();
    const [swiperInst, setSwiperInst] = useState<unknown>();

    useEffect(() => {
        if (!swiperInst) {
            return;
        }

        updateScrollbar(swiperInst);
    }, [swiperInst]);

    const updateScrollbar = useCallback((swiper: any) => {
        const track = trackRef.current!;
        if (!track) {
            return;
        }

        const size = swiper.size / swiper.virtualSize;
        track.style.width = `${size * 100}%`;
        track.style.left = `${100 * swiper.progress * (1 - size)}%`;

        const firstSlide = document.getElementsByClassName(styles.slide)[0];
        const slideRect = firstSlide.getBoundingClientRect();

        introRef.current!.style.width = `${(window.innerWidth - slideRect.width) * 0.5}px`;
    }, []);

    const onSetTransition = useCallback((swiper: any, transition: any) => {
        const track = trackRef.current!;
        if (!track) {
            return;
        }

        track.style.transitionDuration = `${transition}ms`;
    }, []);

    useEffect(() => {
        const rect = (swiperRef.current! as HTMLElement).getBoundingClientRect();
        const height = (window.innerHeight - rect.height) / 2;
        bottomRef.current!.style.height = `${height}px`;
    }, [windowSize]);

    return (
        <div className={styles.page_events}>
            <Swiper //
                ref={swiperRef}
                modules={[A11y, Mousewheel, FreeMode, Keyboard]}
                spaceBetween={40}
                slidesPerView={'auto'}
                pagination={{ clickable: true }}
                mousewheel={true}
                keyboard={{ enabled: true }}
                // freeMode={true}
                centeredSlides={true}
                className={styles.slider}
                onSwiper={(swiper) => setSwiperInst(swiper)}
                onResize={updateScrollbar}
                onSetTranslate={updateScrollbar}
                onSetTransition={onSetTransition}
            >
                <SwiperSlide className={styles.slide}>
                    <div className={styles.content}>
                        <div className={styles.image} />
                        <div className={styles.type}>Exhibition</div>
                    </div>
                    <div ref={introRef} className={styles.intro}>
                        <div className={styles.title}>EVENTS</div>
                        <div className={styles.desc}>
                            Japanese contemporary artist Takashi Murakami is a master of mediums, working with painting, sculpture, fashion, film, and even animation.{' '}
                            <b>His influence on Japan equals that of Andy Warhol on America. However, the art of Takashi Murakami unites Japanese and Western elements to create unique, fantastical worlds that are cute and scary.</b>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide className={styles.slide}>
                    <div className={styles.content}>
                        <div className={styles.image} />
                        <div className={styles.type}>Fair</div>
                    </div>
                </SwiperSlide>
                <SwiperSlide className={styles.slide}>
                    <div className={styles.content}>
                        <div className={styles.image} />
                        <div className={styles.type}>Residency</div>
                    </div>
                </SwiperSlide>
                <SwiperSlide className={styles.slide}>
                    <div className={styles.content}>
                        <div className={styles.image} />
                    </div>
                </SwiperSlide>
            </Swiper>
            <div ref={bottomRef} className={styles.bottom}>
                <div ref={scrollbarRef} className={styles.scrollbar}>
                    <div className={styles.trackContainer}>
                        <div ref={trackRef} className={styles.track} />
                    </div>
                    <div className={styles.text}>SCROLL TO EXPLORE</div>
                </div>
            </div>
        </div>
    );
}
