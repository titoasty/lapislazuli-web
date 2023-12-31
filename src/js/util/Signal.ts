type Callback = (...args: any) => any;

interface Binding {
    id: number;
    callback: Callback;
    scope?: any;
    addOnce?: boolean;
}

export default class Signal<T extends unknown[] = never> {
    bindings: Binding[];
    currentID: number = 0;

    constructor() {
        this.bindings = [];
        this.currentID = 0;
    }

    getNextID() {
        return this.currentID++;
    }

    add(callback: (...args: T) => void, scope = null, addOnce = false) {
        let id = this.getNextID();

        this.bindings.push({
            id,
            callback,
            scope,
            addOnce,
        });

        return id;
    }

    addOnce(callback: (...args: T) => void, scope = null) {
        return this.add(callback, scope, true);
    }

    emit(...args: T) {
        let i = this.bindings.length;
        while (i-- > 0) {
            const binding = this.bindings[i];
            binding.callback.apply(binding.scope, args);
            if (binding.addOnce) {
                this.bindings.splice(i, 1);
            }
        }
    }

    removeId(id: number) {
        let i = this.bindings.length;
        while (i-- > 0) {
            const binding = this.bindings[i];
            if (binding.id === id) {
                this.bindings.splice(i, 1);
                break;
            }
        }
    }

    remove(callback: Callback) {
        let i = this.bindings.length;
        while (i-- > 0) {
            const binding = this.bindings[i];

            if (binding.callback === callback) {
                this.bindings.splice(i, 1);
                break;
            }
        }
    }

    clear() {
        this.bindings = [];

        return this;
    }

    static multisub(cb: any, ...signals: Signal<any>[]) {
        const ids: number[] = [];

        for (const signal of signals) {
            ids.push(signal.add(cb));
        }

        return () => {
            for (let i = 0; i < signals.length; i++) {
                signals[i].removeId(ids[i]);
            }
        };
    }
}
