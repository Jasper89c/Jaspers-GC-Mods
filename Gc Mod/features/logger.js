(function () {
if (window.top !== window.self) return;

function grab(text, label) {
    const m = text.match(new RegExp(label + '\\s*([+-][\\d,]+)', 'i'));
    return m ? parseInt(m[1].replace(/,/g, '')) || 0 : 0;
}

function tryCapture() {
    if (document.body.dataset.gccLogged) return;
    const text = document.body.textContent || '';
    if (!text.includes('You used up')) return;

    document.body.dataset.gccLogged = '1';

    const turnsM = text.match(/You used up (\d+) turn/i);
    const delta = {
        turns:    turnsM ? parseInt(turnsM[1]) : 1,
        cash:     grab(text, 'Credit'),
        food:     grab(text, 'Food'),
        goods:    grab(text, 'Goods'),
        minerals: grab(text, 'Minerals'),
        ore:      grab(text, 'Ore'),
    };

    chrome.storage.local.get(['sessionStart', 'sessionTotals'], (res) => {
        const t = res.sessionTotals || {};
        chrome.storage.local.set({
            sessionStart: res.sessionStart || Date.now(),
            sessionTotals: {
                turns:    (t.turns    || 0) + delta.turns,
                cash:     (t.cash     || 0) + delta.cash,
                food:     (t.food     || 0) + delta.food,
                goods:    (t.goods    || 0) + delta.goods,
                minerals: (t.minerals || 0) + delta.minerals,
                ore:      (t.ore      || 0) + delta.ore,
            },
        });
    });
}

// Run on page load
tryCapture();

// Also catch dynamically injected results (auto-explore without full reload)
new MutationObserver(tryCapture).observe(document.body, { childList: true, subtree: true });

// Ensure sessionStart exists so play time starts from first page visit
chrome.storage.local.get('sessionStart', (res) => {
    if (!res.sessionStart) chrome.storage.local.set({ sessionStart: Date.now() });
});
}());
