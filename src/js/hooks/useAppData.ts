import useMyStore from './useMyStore';

export default function (): AppData {
    return useMyStore((state) => state.appData);
}
