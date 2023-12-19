import useMobile from './useMobile';
import useOrientation from './useOrientation';

export default function () {
    const isMobile = useMobile();
    const orientation = useOrientation();

    if (!isMobile) return false;
    if (window.innerWidth < window.innerHeight) return false;
    if (window.matchMedia('(orientation: portrait)').matches) return false;
    if (orientation === 'portrait') return false;

    return true;
}
