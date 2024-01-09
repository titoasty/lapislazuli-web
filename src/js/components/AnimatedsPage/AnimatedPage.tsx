import classNames from 'classnames';
import { motion, useIsPresent } from 'framer-motion';
import { PropsWithChildren, forwardRef, useEffect, useState } from 'react';
import { isRectInView } from 'util/misc';

interface AnimatedPageProps extends PropsWithChildren {
    name: string;
    className?: string;
    hiddenClassName?: string;
    onAnimationStart?: (visible: boolean) => void;
    onAnimationComplete?: (visible: boolean) => void;
}

export const AnimatedPage = forwardRef(function ({ name, className, hiddenClassName, children, ...props }: AnimatedPageProps, ref) {
    const [visible, setVisible] = useState(false);
    const present = useIsPresent();

    useEffect(() => {
        setVisible(present);
    }, [present]);

    return (
        <motion.div //
            key={name}
            // initial={{ opacity: 1 }}
            // animate={{ opacity: 1.1 }}
            // exit={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            animate={{
                opacity: 1,
                transition: {
                    duration: 1,
                    delay: 0.5,
                },
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{ position: 'fixed', left: 0, top: 0, right: 0, bottom: 0 }}
            {...props}
            onAnimationStart={() => {
                props.onAnimationStart?.(present);
            }}
            onAnimationComplete={() => {
                props.onAnimationComplete?.(present);
            }}
        >
            <div ref={ref} className={classNames(className, !visible && hiddenClassName)}>
                {children}
            </div>
        </motion.div>
    );
});

export function animateSlides(visible: boolean, elt: HTMLElement, slideClassName: string, slideContentClassName: string) {
    const slides = elt.getElementsByClassName(slideClassName);

    const visibleSlides: any[] = [];

    // filter visible slides
    for (const slide of slides) {
        const rect = slide.getBoundingClientRect();
        if (!isRectInView(rect)) {
            continue;
        }

        visibleSlides.push({
            elt: slide,
            rect,
        });
    }

    // sort by position from left
    visibleSlides.sort((a, b) => {
        if (visible) {
            return a.rect.left <= b.rect.left ? -1 : 1;
        } else {
            return a.rect.left <= b.rect.left ? 1 : -1;
        }
    });

    // apply css transition from left to right
    for (let i = 0; i < visibleSlides.length; i++) {
        visibleSlides[i].elt.getElementsByClassName(slideContentClassName)[0].style.transitionDelay = `${i * 0.1}s`;
    }
}
