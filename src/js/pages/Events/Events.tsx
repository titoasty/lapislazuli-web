import styles from './styles.module.scss';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { A11y, FreeMode, Mousewheel, Navigation, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

export function Events() {
    return (
        <div className={styles.page_events}>
            <Swiper //
                modules={[Scrollbar, A11y, Mousewheel, FreeMode]}
                spaceBetween={40}
                slidesPerView={3}
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                mousewheel={true}
                freeMode={true}
                onSwiper={(swiper) => console.log(swiper)}
                onSlideChange={() => console.log('slide change')}
                className={styles.slider}
            >
                <SwiperSlide className={styles.slide}>
                    <div className={styles.content}>
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
                    </div>
                </SwiperSlide>
                <SwiperSlide className={styles.slide}>
                    <div className={styles.content}>
                        <div className={styles.image} />
                    </div>
                </SwiperSlide>
                <SwiperSlide className={styles.slide}>
                    <div className={styles.content}>
                        <div className={styles.image} />
                    </div>
                </SwiperSlide>
                <SwiperSlide className={styles.slide}>
                    <div className={styles.content}>
                        <div className={styles.image} />
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    );
}
