import Plausible from 'plausible-tracker';

const plausible = Plausible({
    domain: 'buzzclub.xyz',
});

function pageView(url?: string) {
    if (url) {
        plausible.trackPageview({
            url,
        });
    } else {
        plausible.trackPageview();
    }
}

export default {
    pageView,
};
