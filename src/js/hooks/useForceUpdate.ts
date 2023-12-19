import { useState, useCallback } from 'react';

export default function useForceUpdate(): () => void {
    const [, updateState] = useState();
    // @ts-ignore
    const forceUpdate = useCallback(() => updateState({}), []);

    return forceUpdate;
}
