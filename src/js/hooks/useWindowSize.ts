import { useEffect, useState } from 'react';

let freezeRatio = false;

function computeREM() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    let remW = 10;
    if (width < 700) {
        remW = 7;
    } else if (width < 900) {
        remW = 8;
    } else if (width < 1200) {
        remW = 9;
    }

    let remH = 10;
    if (height < 700) {
        remH = 8;
    } else if (height < 800) {
        remH = 9;
    }

    // mobile
    if (width < height) {
        remW = remH = 10;
    }

    const rem = Math.min(remW, remH);

    return rem;
}

export default function () {
    function keyboardOpen() {
        freezeRatio = true;
    }

    function keyboardClose() {
        freezeRatio = false;
    }

    const [size, setSize] = useState({
        width: window.innerWidth, //
        height: window.innerHeight,
        rem: computeREM(),
        keyboardOpen,
        keyboardClose,
    });

    useEffect(() => {
        function onResize() {
            setSize({
                width: window.innerWidth, //
                height: window.innerHeight,
                // viewHeightRatio,
                rem: computeREM(),
                keyboardOpen,
                keyboardClose,
            });

            // thanks, Chrome iOS
            setTimeout(() => {
                setSize({
                    width: window.innerWidth, //
                    height: window.innerHeight,
                    rem: computeREM(),
                    keyboardOpen,
                    keyboardClose,
                });
            }, 200);
        }

        window.addEventListener('resize', onResize, false);

        return () => {
            window.removeEventListener('resize', onResize, false);
        };
    }, []);

    return size;
}
