import { Preload } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { AsyncLoader } from 'components/AsyncLoader';
import { Loader } from 'components/Loader/Loader';
import { Logo } from 'components/Logo/Logo';
import { PopinPainting } from 'components/PopinPainting/PopinPainting';
import useLoaded from 'hooks/useLoaded';
import { Home } from 'pages/Home/Home';
import { Home3D } from 'pages/Home/Home3D';
import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
                <AsyncLoader />
                {loaded && (
                    <>
                        <Home3D />
                        <Preload all />
                    </>
                )}
                {/* <Stats /> */}
            </Canvas>
            {loaded && (
                <div className={styles.content}>
                    <BrowserRouter>
                        <Routes>
                            <Route index element={<Home />} />
                        </Routes>
                        <Logo />
                    </BrowserRouter>
                </div>
            )}
            <PopinPainting />
            <Loader />
        </div>
    );
}
