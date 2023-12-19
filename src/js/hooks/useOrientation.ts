import { useEffect, useState } from 'react';

function getOrientation() {
    if (window.orientation === 0 || window.orientation === 180 || window.orientation === -180) return 'portrait';
    return 'landscape';
}

export default function () {
    const [orientation, setOrientation] = useState(getOrientation());

    useEffect(() => {
        const onOrientationChange = () => {
            setOrientation(getOrientation());
        };

        window.addEventListener('orientationchange', onOrientationChange);

        return () => {
            window.removeEventListener('orientationchange', onOrientationChange);
        };
    }, []);

    return orientation;
}
