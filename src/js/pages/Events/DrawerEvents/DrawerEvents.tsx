import { Drawer } from 'components/Drawer/Drawer';
import styles from './styles.module.scss';

interface DrawerEventsProps {
    visible?: boolean;
    close: () => void;
    event: any;
    openVenue: (event: EventData) => void;
    openArtworks: (event: EventData) => void;
}

export function DrawerEvents({ visible, close, event, openVenue, openArtworks }: DrawerEventsProps) {
    return (
        <Drawer visible={visible} close={close} className={styles.drawer}>
            {visible && (
                <>
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
                            {Array.from({ length: Math.ceil(event.artists.length / 2) }, (v, i) => event.artists.slice(i * 2, i * 2 + 2)).map((line, idx) => {
                                if (line.length === 0) return null;
                                if (line.length === 1)
                                    return (
                                        <div key={idx} className={styles.artist}>
                                            {line[0]}
                                        </div>
                                    );
                                return (
                                    <div key={idx}>
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
                    <a className={styles.venue} onClick={() => openVenue(event)}>
                        VENUE
                    </a>
                    <a className={styles.artworks} onClick={() => openArtworks(event)}>
                        ARTWORKS
                    </a>
                </>
            )}
        </Drawer>
    );
}
