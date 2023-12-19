import { isMobile } from 'util/misc';
import useWindowSize from './useWindowSize';

export default function () {
    const windowSize = useWindowSize();

    // return isMobile();
    return windowSize.width < windowSize.height;
}
