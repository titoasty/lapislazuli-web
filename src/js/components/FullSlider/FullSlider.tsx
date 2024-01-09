import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';

import classNames from 'classnames';
import useWindowSize from 'hooks/useWindowSize';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { A11y, FreeMode, Keyboard, Mousewheel } from 'swiper/modules';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';

interface SlideProps {
    content: any;
    slideClassName?: string;
    contentClassName?: string;
    onClick?: (evt: any, swiper: any, slide: any) => void;
}

interface FullSliderProps {
    slides: SlideProps[];
    spaceBetween?: number;
    sliderClassName?: string;
    slideClassName?: string;
    topContent?: any;
    bottomContent?: any;
}

function Slide({ slide, slideIndex }: { slide: SlideProps; slideIndex: number }) {
    const swiper = useSwiper();

    const onClick = useCallback(
        (evt: any) => {
            slide.onClick?.(evt, swiper, slideIndex);
        },
        [swiper, slideIndex]
    );

    return (
        <div //
            onClick={onClick}
            className={classNames(styles.slide_content, slide.contentClassName)}
        >
            {slide.content}
        </div>
    );
}

export function FullSlider({ slides, spaceBetween = 40, sliderClassName, slideClassName, topContent, bottomContent }: FullSliderProps) {
    const swiperRef = useRef<any>();
    const scrollbarRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const topRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
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
        topRef.current!.style.height = `${height}px`;
    }, [windowSize]);

    return (
        <div className={styles.fullslider}>
            <div ref={topRef} className={styles.top}>
                {topContent}
            </div>
            <Swiper //
                ref={swiperRef}
                modules={[A11y, Mousewheel, FreeMode, Keyboard]}
                spaceBetween={spaceBetween}
                slidesPerView={'auto'}
                pagination={{ clickable: true }}
                mousewheel={true}
                keyboard={{ enabled: true }}
                // freeMode={true}
                centeredSlides={true}
                speed={500}
                className={classNames(styles.slider, sliderClassName)}
                onSwiper={(swiper) => setSwiperInst(swiper)}
                onResize={updateScrollbar}
                onSetTranslate={updateScrollbar}
                onSetTransition={onSetTransition}
            >
                {slides.map((slide, idx) => (
                    <SwiperSlide key={idx} className={classNames(styles.slide, slideClassName, slide.slideClassName)}>
                        <Slide slide={slide} slideIndex={idx} />
                    </SwiperSlide>
                ))}
            </Swiper>
            <div ref={bottomRef} className={styles.bottom}>
                {bottomContent}
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
