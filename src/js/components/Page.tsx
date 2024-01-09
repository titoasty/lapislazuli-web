import { motion, useIsPresent } from 'framer-motion';
import { PropsWithChildren, forwardRef, useEffect } from 'react';

interface PageProps extends PropsWithChildren {
    name: string;
    onAnimationStart?: (visible: boolean) => void;
    onAnimationComplete?: (visible: boolean) => void;
    onVisibleChange: (visible: boolean) => any;
}

export const Page = forwardRef(function ({ name, onVisibleChange, children, ...props }: PageProps, ref) {
    const present = useIsPresent();

    useEffect(() => {
        onVisibleChange?.(present);
        // if (present) {
        //     setTimeout(() => {
        //         onVisibleChange?.(true);
        //     }, 500);
        // } else {
        //     onVisibleChange?.(false);
        // }
    }, [present]);

    return (
        <motion.div //
            ref={ref}
            key={name}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1.1 }}
            exit={{ opacity: 1 }}
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
            {children}
        </motion.div>
    );
});
