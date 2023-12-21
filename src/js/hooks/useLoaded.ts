import useMyStore from './useMyStore';

export default function (): { loaded: boolean; setLoaded: (value: boolean) => void; loadedPercent: number; setLoadedPercent: (value: number) => void } {
    const { loaded, setLoaded, loadedPercent, setLoadedPercent } = useMyStore((state) => ({ loaded: state.loaded, setLoaded: state.setLoaded, loadedPercent: state.loadedPercent, setLoadedPercent: state.setLoadedPercent }));

    return { loaded, setLoaded, loadedPercent, setLoadedPercent };
}
