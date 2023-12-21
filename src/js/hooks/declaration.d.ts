declare type StoreSetter<T> = (value: StoreSetterArg<T>) => void;
declare type StoreGetter<T> = () => T;

type StoreState = {
    focus: boolean;
    setFocus: (value: boolean) => void;
    mute: boolean;
    setMute: (value: boolean) => void;
    loaded: boolean;
    setLoaded: (value: boolean) => void;
    loadedPercent: number;
    setLoadedPercent: (value: number) => void;
    preloaded: boolean;
    setPreloaded: (value: boolean) => void;
};
