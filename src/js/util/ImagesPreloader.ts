export default class ImagesPreloader {
    enabled: boolean = false;
    urls: string[] = [];
    images: { [key: string]: HTMLImageElement } = {};
    concurrentNb = 0;
    maxConcurrent = 5;

    add(url: string) {
        this.urls.push(url);
        this.check();
    }

    check() {
        if (!this.enabled) return;
        if (this.urls.length <= 0) return;

        while (this.concurrentNb < this.maxConcurrent) {
            this.concurrentNb++;

            const url = this.urls.shift()!;
            const img = new Image();
            img.onload = () => {
                this.concurrentNb--;

                this.images[url] = img;
                this.check();
            };
            img.src = url;
        }
    }

    getAsync(url: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                resolve(img);
            };
            img.src = url;
        });
    }

    get(url: string): HTMLImageElement {
        return this.images[url];
    }
}
