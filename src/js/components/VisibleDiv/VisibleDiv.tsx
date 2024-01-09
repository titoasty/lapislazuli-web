import classNames from 'classnames';
import { PropsWithChildren, forwardRef, useEffect, useState } from 'react';

interface VisibleDivProps extends PropsWithChildren {
    visible?: boolean;
    className?: string;
    hiddenClassName?: string;
    onChange?: (visible: boolean) => void;
    props?: any;
}

export const VisibleDiv = forwardRef(function ({ visible, onChange, className, hiddenClassName, children, ...props }: VisibleDivProps, ref: any) {
    const [_visible, _setVisible] = useState(visible);

    useEffect(() => {
        onChange?.(!!visible);

        if (visible) {
            let to = setTimeout(() => {
                _setVisible(true);
            }, 700);

            return () => {
                clearTimeout(to);
            };
        } else {
            _setVisible(false);
        }
    }, [visible]);

    return (
        <div ref={ref} className={classNames(className, !_visible && hiddenClassName)} {...props}>
            {children}
        </div>
    );
});
