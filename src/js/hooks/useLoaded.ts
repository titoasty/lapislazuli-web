import useMyStore from './useMyStore';

export default function (): [boolean, (value: boolean) => void] {
    const { loaded, setLoaded } = useMyStore((state) => ({ loaded: state.loaded, setLoaded: state.setLoaded }));

    return [loaded, setLoaded];
}
