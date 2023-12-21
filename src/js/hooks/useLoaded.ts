import useMyStore from './useMyStore';

export default function (): { loaded: boolean; setLoaded: (value: boolean) => void; loadedPercent: number; setLoadedPercent: (value: number) => void; preloaded: boolean; setPreloaded: (value: boolean) => void } {
    const { loaded, setLoaded, loadedPercent, setLoadedPercent, preloaded, setPreloaded } = useMyStore((state) => ({
        loaded: state.loaded,
        setLoaded: state.setLoaded,
        loadedPercent: state.loadedPercent,
        setLoadedPercent: state.setLoadedPercent,
        preloaded: state.preloaded,
        setPreloaded: state.setPreloaded,
    }));

    return { loaded, setLoaded, loadedPercent, setLoadedPercent, preloaded, setPreloaded };
}
