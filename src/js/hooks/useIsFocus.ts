import useMyStore from './useMyStore';

export default function (): [boolean, (value: boolean) => void] {
    const { focus, setFocus } = useMyStore((state) => ({ focus: state.focus, setFocus: state.setFocus }));

    return [focus, setFocus];
}
