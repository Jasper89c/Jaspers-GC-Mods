const GC_BASE = 'https://gcc.wrindustries.com/i.cfm';

const PAGE_LABELS = {
    'com_empire&cm=4': 'Important Events',
    'com_empire&cm=3': 'Empire Summary',
    'com_income':      'Income',
    'com_mission':     'Missions',
    'com_col':         'Manage Colonies',
    'com_project':     'Projects',
    'com_market':      'Market',
    'com_explore':     'Explore',
    'com_research':    'Research',
    'com_market_use':  'Artifacts',
    'com_ship':        'Build Ships',
    'com_disband':     'Manage Fleet',
    'com_intel':       'Intelligence',
    'com_attack':      'Attack',
    'com_attack_prev': 'Battle Logs',
    'fed':             'Federation',
    'fed_forum':       'Fed Discussion',
    'rank':            'Rankings (Top)',
    'rank&ty=1':       'Rankings (Planets)',
    'rank_s':          'Rankings (Stats)',
    'rank2':           'Rankings (Near me)',
    'option':          'Options',
    'pm':              'Messages',
};

const LAYOUT_NAMES = {
    cols:        'Side by side',
    rows:        'Top / bottom',
    grid:        '2×2 Grid',
    'main-side': 'Main + sidebar',
};

chrome.storage.local.get(
    ['gc_last_known_sid', 'splitViewCount', 'splitViewLayout', 'splitViewPages'],
    ({ gc_last_known_sid: sid, splitViewCount, splitViewLayout, splitViewPages }) => {
        const count  = Math.min(4, Math.max(1, parseInt(splitViewCount) || 2));
        const layout = splitViewLayout || 'cols';
        const pages  = Array.isArray(splitViewPages) ? splitViewPages : [];

        document.getElementById('sv-info').textContent =
            `${count} pane${count > 1 ? 's' : ''} · ${LAYOUT_NAMES[layout] || layout}`;

        const container = document.getElementById('sv-container');
        applyGrid(container, layout, count);

        const iframesForScaling = [];

        for (let i = 0; i < count; i++) {
            const pageVal = pages[i] || '';
            const pane    = document.createElement('div');
            pane.className = 'sv-pane';
            placePaneInGrid(pane, layout, count, i);

            const tag = document.createElement('div');
            tag.className   = 'sv-pane-tag';
            tag.textContent = `${i + 1} · ${PAGE_LABELS[pageVal] || (pageVal || 'Empty')}`;
            pane.appendChild(tag);

            if (pageVal) {
                const iframe = document.createElement('iframe');
                // Set desktop width before src so the game loads at the right viewport
                iframe.style.cssText = `position:absolute;top:0;left:0;border:none;width:${DESKTOP_WIDTH}px;height:${DESKTOP_WIDTH}px;transform-origin:0 0;`;
                iframe.src = `${GC_BASE}?${sid ? `&${sid}&` : ''}f=${pageVal}`;
                pane.appendChild(iframe);

                const reloadBtn = document.createElement('button');
                reloadBtn.className   = 'sv-pane-reload';
                reloadBtn.textContent = '↻';
                reloadBtn.title       = 'Reload pane';
                reloadBtn.addEventListener('click', () => { iframe.src = iframe.src; });
                pane.appendChild(reloadBtn);

                iframesForScaling.push({ iframe, pane });
            } else {
                const empty = document.createElement('div');
                empty.className   = 'sv-pane-empty';
                empty.textContent = 'No page selected';
                pane.appendChild(empty);
            }

            container.appendChild(pane);
        }

        // Apply scale transform after the grid has resolved dimensions
        setTimeout(() => {
            iframesForScaling.forEach(({ iframe, pane }) => {
                applyScale(iframe, pane);
                new ResizeObserver(() => applyScale(iframe, pane)).observe(pane);
            });
        }, 50);

        document.getElementById('sv-back').addEventListener('click', () => {
            chrome.runtime.openOptionsPage();
        });
    }
);

function applyGrid(container, layout, count) {
    switch (layout) {
        case 'cols':
            container.style.gridTemplateColumns = `repeat(${count}, 1fr)`;
            container.style.gridTemplateRows    = '1fr';
            break;
        case 'rows':
            container.style.gridTemplateColumns = '1fr';
            container.style.gridTemplateRows    = `repeat(${count}, 1fr)`;
            break;
        case 'grid':
            container.style.gridTemplateColumns = '1fr 1fr';
            container.style.gridTemplateRows    = '1fr 1fr';
            break;
        case 'main-side': {
            const sideRows = Math.max(1, count - 1);
            container.style.gridTemplateColumns = '2fr 1fr';
            container.style.gridTemplateRows    = `repeat(${sideRows}, 1fr)`;
            break;
        }
    }
}

const DESKTOP_WIDTH = 1280;

function applyScale(iframe, pane) {
    const pw = pane.offsetWidth;
    const ph = pane.offsetHeight;
    if (!pw || !ph) return;
    const scale = pw / DESKTOP_WIDTH;
    iframe.style.width     = DESKTOP_WIDTH + 'px';
    iframe.style.height    = Math.ceil(ph / scale) + 'px';
    iframe.style.transform = `scale(${scale})`;
}

function placePaneInGrid(pane, layout, count, index) {
    if (layout !== 'main-side') return;
    if (index === 0) {
        pane.style.gridColumn = '1';
        pane.style.gridRow    = `1 / span ${Math.max(1, count - 1)}`;
    } else {
        pane.style.gridColumn = '2';
        pane.style.gridRow    = String(index);
    }
}
