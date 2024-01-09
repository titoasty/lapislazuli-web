// import sounds from 'sounds';
import { create } from 'zustand';

const useMyStore = create<StoreState>()((set) => ({
    focus: true,
    setFocus: (focus: boolean) => set(() => ({ focus })),
    mute: false,
    setMute: (mute: boolean) => set(() => ({ mute })),
    loaded: false,
    setLoaded: (loaded: boolean) => set(() => ({ loaded })),
    loadedPercent: 0,
    setLoadedPercent: (loadedPercent: number) => set(() => ({ loadedPercent })),
    preloaded: false,
    setPreloaded: (preloaded: boolean) => set(() => ({ preloaded })),
    appData: {
        events: [],
    },
    setAppData: (appData: AppData) => set(() => ({ appData })),
}));

export default useMyStore;
