import { useCallback, useRef, useState } from 'react';
import styles from './styles.module.scss';

import { Drawer } from 'components/Drawer/Drawer';
import { FullSlider } from 'components/FullSlider/FullSlider';
import { PopinVenue } from 'components/PopinVenue/PopinVenue';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const events = [
    {
        title: 'H2o Water Diaries',
        date: '17 April 2024 - 25 September 2024',
        location: 'Oxford Street 203, London',
        curators: 'Mara Hoffman & Nina Jung',
        artists: ['Takashi Murakami', 'Leslie Alexander', 'Jerome Bell', 'Annette Black'],
        press: [
            {
                title: 'Published Article Title and Link',
                author: 'Author name',
            },
        ],
        media: '#',
    },
];

export function Events() {
    const introRef = useRef<HTMLDivElement>(null);
    const [drawerVisible, setDrawerVisible] = useState(true);

    const openDrawer = useCallback((evt: any, swiper: any, slideIndex: number) => {
        swiper.slideTo(slideIndex);
        setDrawerVisible(true);
    }, []);

    const closeDrawer = useCallback(() => {
        setDrawerVisible(false);
    }, []);

    const event = events[0];

    return (
        <div className={styles.page_events}>
            <FullSlider
                spaceBetween={40}
                slides={[
                    {
                        onClick: openDrawer,
                        content: (
                            <>
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
                            </>
                        ),
                    },
                    {
                        onClick: openDrawer,
                        content: (
                            <>
                                <div className={styles.content}>
                                    <div className={styles.image} />
                                    <div className={styles.type}>Fair</div>
                                </div>
                            </>
                        ),
                    },
                    {
                        onClick: openDrawer,
                        content: (
                            <>
                                <div className={styles.content}>
                                    <div className={styles.image} />
                                    <div className={styles.type}>Residency</div>
                                </div>
                            </>
                        ),
                    },
                    {
                        onClick: openDrawer,
                        content: (
                            <>
                                <div className={styles.content}>
                                    <div className={styles.image} />
                                    <div className={styles.type}>Exhibition</div>
                                </div>
                            </>
                        ),
                    },
                    {
                        onClick: openDrawer,
                        content: (
                            <>
                                <div className={styles.content}>
                                    <div className={styles.image} />
                                    <div className={styles.type}>Fair</div>
                                </div>
                            </>
                        ),
                    },
                    {
                        onClick: openDrawer,
                        content: (
                            <>
                                <div className={styles.content}>
                                    <div className={styles.image} />
                                    <div className={styles.type}>Residency</div>
                                </div>
                            </>
                        ),
                    },
                ]}
            />
            <Drawer visible={drawerVisible} close={closeDrawer} className={styles.drawer}>
                <div className={styles.title}>{event.title}</div>
                <div className={styles.date}>{event.date}</div>
                <div className={styles.block}>
                    <div className={styles.subtitle}>LOCATION</div>
                    <div className={styles.text}>{event.location}</div>
                </div>
                <div className={styles.block}>
                    <div className={styles.subtitle}>Curators</div>
                    <div className={styles.text}>{event.curators}</div>
                </div>
                <div className={styles.block}>
                    <div className={styles.subtitle}>Artists</div>
                    <div className={styles.artists}>
                        {Array.from({ length: Math.ceil(event.artists.length / 2) }, (v, i) => event.artists.slice(i * 2, i * 2 + 2)).map((line) => {
                            if (line.length === 0) return null;
                            if (line.length === 1) return <div className={styles.artist}>{line[0]}</div>;
                            return (
                                <div>
                                    <div className={styles.artist}>{line[0]}</div>
                                    <div className={styles.dot} />
                                    <div className={styles.artist}>{line[1]}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className={styles.block}>
                    <div className={styles.subtitle}>Press</div>
                    <div className={styles.text}>
                        Published Article Title and Link <span className={styles.small}>Author name</span>
                    </div>
                </div>
                <a className={styles.media} href={'#'}>
                    MEDIA KIT
                    <div className={styles.download} />
                </a>
                <a className={styles.venue}>VENUE</a>
                <a className={styles.artworks}>ARTWORKS</a>
                {/* <div>
                    Japanese contemporary artist Takashi Murakami is a master of mediums, working with painting, sculpture, fashion, film, and even animation. His influence on Japan equals that of Andy Warhol on America. However, the art of Takashi
                    Murakami unites Japanese and Western elements to create unique, fantastical worlds that are cute and scary. When Takashi Murakami invented the term Superflat in 2001, he launched one of postmodern art's most exciting and refreshing art
                    movements. The artist is influenced by the Post World War II manga and anime craze. Superflat references both the two-dimensional quality of traditional Japanese painting and the shallow qualities of consumer culture. As a result,
                    common motifs and subjects flood the oeuvre of Takashi Murakami, like flowers, skulls, bests, and bears. You can see them across paintings, wallpaper, pillows, Louis Vuitton bags, and NFTs! As a pioneer in the field of NFTs, Murakami
                    continues to be curious about all the possibilities in art. As a result, common motifs and subjects flood the oeuvre of Takashi Murakami, like flowers, skulls, bests, and bears. You can see them across paintings, wallpaper, pillows,
                    Louis Vuitton bags, and NFTs! As a pioneer in the field of NFTs, Murakami continues to be curious about all the possibilities in art. As a result, common motifs and subjects flood the oeuvre of Takashi Murakami, like flowers, skulls,
                    bests, and bears. You can see them across paintings, wallpaper, pillows, Louis Vuitton bags, and NFTs! As a pioneer in the field of NFTs, Murakami continues to be curious about all the possibilities in art.
                </div> */}
            </Drawer>

            <PopinVenue />
        </div>
    );
}
