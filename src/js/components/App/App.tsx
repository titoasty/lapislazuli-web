import { Preload } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { AsyncLoader } from 'components/AsyncLoader';
import { Loader } from 'components/Loader/Loader';
import { Logo } from 'components/Logo/Logo';
import { Menu } from 'components/Menu/Menu';
import { PopinPainting } from 'components/PopinPainting/PopinPainting';
import { AnimatePresence } from 'framer-motion';
import useLoaded from 'hooks/useLoaded';
import { Artists } from 'pages/Artists/Artists';
import { Events } from 'pages/Events/Events';
import { Home } from 'pages/Home/Home';
import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { NoToneMapping } from 'three';
import styles from './styles.module.scss';

const Tmp = () => {
    useEffect(() => {
        console.log('start');
        return () => {
            console.log('end');
        };
    }, []);

    return null;
};

export function App() {
    const location = useLocation();
    const { loaded } = useLoaded();

    return (
        <div className={styles.app}>
            <Canvas //
                camera={{ fov: 40 }}
                gl={{
                    toneMapping: NoToneMapping, //
                    antialias: true,
                    alpha: false,
                }}
                dpr={1}
            >
                <color attach="background" args={['white']} />
                <AsyncLoader />
                {loaded && (
                    <>
                        {/* <Home3D /> */}
                        <Preload all />
                    </>
                )}
                {/* <Stats /> */}
            </Canvas>
            {loaded && (
                <div className={styles.content}>
                    <AnimatePresence>
                        <Routes location={location} key={location.pathname}>
                            <Route index element={<Home />} />
                            <Route path="/events" element={<Events />} />
                            <Route path="/artists" element={<Artists />} />
                        </Routes>
                        <Logo />
                    </AnimatePresence>
                </div>
            )}
            <PopinPainting />
            <Menu />
            <Loader />
        </div>
    );
}
