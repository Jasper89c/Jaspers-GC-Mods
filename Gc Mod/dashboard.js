// dashboard.js - Comprehensive live storage listener with Menu toggles
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get([
        'assimEnabled', 'infectEnabled', 'fedLazy', 'fedFull',
        'clusterCollapsed', 'similareCollapsed', 'viralCollapsed', 'autoContinue',
        'autoExplore', 'simsLinksEnabled', 'importantEventsLinkEnabled', 'chatFeatureEnabled',
        'batchButtonsEnabled', 'quickBuildEnabled', 'battleLogsEnabled', 'marketQuickFillEnabled'
    ], (res) => {

        // 1. Assimilate Status Card Badge
        const assimStatus = document.getElementById('dash-assim-status');
        if (assimStatus) {
            if (res.assimEnabled) {
                assimStatus.textContent = "Active";
                assimStatus.classList.add('active');
            } else {
                assimStatus.textContent = "Disabled";
            }
        }

        // 2. Infect Status Card Badge
        const infectStatus = document.getElementById('dash-infect-status');
        if (infectStatus) {
            if (res.infectEnabled) {
                infectStatus.textContent = "Active";
                infectStatus.classList.add('active');
            } else {
                infectStatus.textContent = "Disabled";
            }
        }

        // 3. Federation Intelligence Mapping Card Badge
        const fedStatus = document.getElementById('dash-fed-status');
        if (fedStatus) {
            if (res.fedFull) {
                fedStatus.textContent = "Active (Full Load)";
                fedStatus.classList.add('active');
            } else if (res.fedLazy) {
                fedStatus.textContent = "Active (Lazy Hover)";
                fedStatus.classList.add('active');
            } else {
                fedStatus.textContent = "Disabled";
            }
        }

        // 4. NEW: Core Helper Section Visibility Switches
        const hideRegularCheck = document.getElementById('dash-hide-regular');
        const hideCollectiveCheck = document.getElementById('dash-hide-collective');
        const hideViralCheck = document.getElementById('dash-hide-viral');

        // Check the boxes if the sections are NOT collapsed (visible)
        if (hideRegularCheck) {
            hideRegularCheck.checked = !res.clusterCollapsed;
            hideRegularCheck.addEventListener('change', () => {
                chrome.storage.local.set({ clusterCollapsed: !hideRegularCheck.checked });
            });
        }

        if (hideCollectiveCheck) {
            hideCollectiveCheck.checked = !res.similareCollapsed;
            hideCollectiveCheck.addEventListener('change', () => {
                chrome.storage.local.set({ similareCollapsed: !hideCollectiveCheck.checked });
            });
        }

        if (hideViralCheck) {
            hideViralCheck.checked = !res.viralCollapsed;
            hideViralCheck.addEventListener('change', () => {
                chrome.storage.local.set({ viralCollapsed: !hideViralCheck.checked });
            });
        }

        // =================================================================
        // 5. FIXED: Auto Click Automation Switches
        // =================================================================
        const autoContinueCheck = document.getElementById('dash-auto-continue');
        const autoExploreCheck = document.getElementById('dash-auto-explore');

        if (autoContinueCheck) {
            // If autoContinue isn't explicitly false, default it to true (ON)
            autoContinueCheck.checked = (res.autoContinue !== false);

            autoContinueCheck.addEventListener('change', () => {
                // Save exactly what the checkbox says: checked = true, unchecked = false
                chrome.storage.local.set({ autoContinue: autoContinueCheck.checked });
            });
        }

        if (autoExploreCheck) {
            // If autoExplore isn't explicitly false, default it to true (ON)
            autoExploreCheck.checked = (res.autoExplore !== false);

            autoExploreCheck.addEventListener('change', () => {
                // Save exactly what the checkbox says: checked = true, unchecked = false
                chrome.storage.local.set({ autoExplore: autoExploreCheck.checked });
            });
        }
        // =================================================================
        // 6. MIGRATED: Feature & Intel Toggle Controls
        // =================================================================
        const assimCheck = document.getElementById('dash-assim-toggle');
        const infectCheck = document.getElementById('dash-infect-toggle');
        const fedLazyCheck = document.getElementById('dash-fed-lazy');
        const fedFullCheck = document.getElementById('dash-fed-full');

        // Synchronize check states based on saved memory keys
        if (assimCheck) {
            assimCheck.checked = !!res.assimEnabled;
            assimCheck.addEventListener('change', () => {
                chrome.storage.local.set({ assimEnabled: assimCheck.checked });
            });
        }

        if (infectCheck) {
            infectCheck.checked = !!res.infectEnabled;
            infectCheck.addEventListener('change', () => {
                chrome.storage.local.set({ infectEnabled: infectCheck.checked });
            });
        }

        if (fedLazyCheck) {
            fedLazyCheck.checked = !!res.fedLazy;
            fedLazyCheck.addEventListener('change', () => {
                // If turning on Lazy Load, uncheck Full Load to prevent conflict
                if (fedLazyCheck.checked && fedFullCheck) fedFullCheck.checked = false;
                chrome.storage.local.set({
                    fedLazy: fedLazyCheck.checked,
                    fedFull: fedFullCheck ? fedFullCheck.checked : false
                });
            });
        }

        if (fedFullCheck) {
            fedFullCheck.checked = !!res.fedFull;
            fedFullCheck.addEventListener('change', () => {
                // If turning on Full Load, uncheck Lazy Load to prevent conflict
                if (fedFullCheck.checked && fedLazyCheck) fedLazyCheck.checked = false;
                chrome.storage.local.set({
                    fedFull: fedFullCheck.checked,
                    fedLazy: fedLazyCheck ? fedLazyCheck.checked : false
                });
            });
        }
        // --- SIMULATIONS LINKS AUTOMATION HANDLE ---
        const eventsLinkCheck = document.getElementById('dash-events-toggle');
        if (eventsLinkCheck) {
            eventsLinkCheck.checked = (res.importantEventsLinkEnabled !== false);
            eventsLinkCheck.addEventListener('change', () => {
                chrome.storage.local.set({ importantEventsLinkEnabled: eventsLinkCheck.checked });
            });
        }

        const simsLinksCheck = document.getElementById('dash-sims-toggle');
        if (simsLinksCheck) {
            simsLinksCheck.checked = (res.simsLinksEnabled !== false);
            simsLinksCheck.addEventListener('change', () => {
                chrome.storage.local.set({ simsLinksEnabled: simsLinksCheck.checked });
            });
        }

        // --- CHAT FEATURE AUTOMATION HANDLE ---
        const chatToggleCheck = document.getElementById('dash-chat-toggle');
        if (chatToggleCheck) {
            // Defaults to true (ON) if it hasn't been set yet
            chatToggleCheck.checked = (res.chatFeatureEnabled !== false);

            chatToggleCheck.addEventListener('change', () => {
                chrome.storage.local.set({ chatFeatureEnabled: chatToggleCheck.checked });
            });
        }

        const batchToggleCheck = document.getElementById('dash-batch-toggle');
        if (batchToggleCheck) {
            batchToggleCheck.checked = (res.batchButtonsEnabled !== false);
            batchToggleCheck.addEventListener('change', () => {
                chrome.storage.local.set({ batchButtonsEnabled: batchToggleCheck.checked });
            });
        }

        const quickBuildCheck = document.getElementById('dash-quick-build');
        if (quickBuildCheck) {
            quickBuildCheck.checked = (res.quickBuildEnabled !== false);
            quickBuildCheck.addEventListener('change', () => {
                chrome.storage.local.set({ quickBuildEnabled: quickBuildCheck.checked });
            });
        }

        const battleLogsCheck = document.getElementById('dash-battle-logs');
        if (battleLogsCheck) {
            battleLogsCheck.checked = (res.battleLogsEnabled !== false);
            battleLogsCheck.addEventListener('change', () => {
                chrome.storage.local.set({ battleLogsEnabled: battleLogsCheck.checked });
            });
        }

        const marketQuickFillCheck = document.getElementById('dash-market-quickfill');
        if (marketQuickFillCheck) {
            marketQuickFillCheck.checked = (res.marketQuickFillEnabled !== false);
            marketQuickFillCheck.addEventListener('change', () => {
                chrome.storage.local.set({ marketQuickFillEnabled: marketQuickFillCheck.checked });
            });
        }
    });
});

// ─── Split View ───────────────────────────────────────────────────────────────

const SV_PAGES = [
    { label: '— None —',        value: '' },
    { label: 'Important Events',value: 'com_empire&cm=4' },
    { label: 'Empire Summary',  value: 'com_empire&cm=3' },
    { label: 'Income',          value: 'com_income' },
    { label: 'Missions',        value: 'com_mission' },
    { label: 'Manage Colonies', value: 'com_col' },
    { label: 'Projects',        value: 'com_project' },
    { label: 'Market',          value: 'com_market' },
    { label: 'Explore',         value: 'com_explore' },
    { label: 'Research',        value: 'com_research' },
    { label: 'Artifacts',       value: 'com_market_use' },
    { label: 'Build Ships',     value: 'com_ship' },
    { label: 'Manage Fleet',    value: 'com_disband' },
    { label: 'Intelligence',    value: 'com_intel' },
    { label: 'Attack',          value: 'com_attack' },
    { label: 'Battle Logs',     value: 'com_attack_prev' },
    { label: 'Federation',      value: 'fed' },
    { label: 'Fed Discussion',  value: 'fed_forum' },
    { label: 'Rankings (Top)',   value: 'rank' },
    { label: 'Rankings (Planets)', value: 'rank&ty=1' },
    { label: 'Rankings (Stats)', value: 'rank_s' },
    { label: 'Rankings (Near me)', value: 'rank2' },
    { label: 'Options',         value: 'option' },
    { label: 'Messages',        value: 'pm' },
];

const SV_LAYOUTS = {
    1: [],
    2: [
        { id: 'cols',      label: 'Side by side' },
        { id: 'rows',      label: 'Top / bottom' },
    ],
    3: [
        { id: 'cols',      label: 'Side by side' },
        { id: 'rows',      label: 'Top / bottom' },
        { id: 'main-side', label: 'Main + sidebar' },
    ],
    4: [
        { id: 'cols',      label: 'Side by side' },
        { id: 'rows',      label: 'Top / bottom' },
        { id: 'grid',      label: '2×2 Grid' },
        { id: 'main-side', label: 'Main + sidebar' },
    ],
};

function svLayoutIcon(id, count) {
    const W = 34, H = 22, G = 1.5;
    const rects = [];

    if (id === 'cols') {
        const w = (W - G * (count - 1)) / count;
        for (let i = 0; i < count; i++) rects.push([i * (w + G), 0, w, H]);
    } else if (id === 'rows') {
        const h = (H - G * (count - 1)) / count;
        for (let i = 0; i < count; i++) rects.push([0, i * (h + G), W, h]);
    } else if (id === 'grid') {
        const hw = (W - G) / 2, hh = (H - G) / 2;
        [[0, 0], [hw + G, 0], [0, hh + G], [hw + G, hh + G]].forEach(([x, y]) => rects.push([x, y, hw, hh]));
    } else if (id === 'main-side') {
        const mw = W * 0.62, sw = W - mw - G;
        const sc = Math.max(1, count - 1), sh = (H - G * (sc - 1)) / sc;
        rects.push([0, 0, mw, H]);
        for (let i = 0; i < sc; i++) rects.push([mw + G, i * (sh + G), sw, sh]);
    }

    const rs = rects.map(([x, y, w, h]) =>
        `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="1.5" fill="currentColor" opacity=".55"/>`
    ).join('');
    return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${rs}</svg>`;
}

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(
        ['splitViewCount', 'splitViewLayout', 'splitViewPages'],
        ({ splitViewCount, splitViewLayout, splitViewPages }) => {
            let svCount  = Math.min(4, Math.max(1, parseInt(splitViewCount) || 2));
            let svLayout = splitViewLayout || 'cols';
            let svPages  = Array.isArray(splitViewPages) ? splitViewPages : [];

            const layoutRow = document.getElementById('sv-layout-row');
            const pagesRow  = document.getElementById('sv-pages-row');

            // ── Count buttons ──────────────────────────────────────────────
            const countBtns = document.querySelectorAll('[data-sv-count]');

            function syncCountBtns() {
                countBtns.forEach(b => b.classList.toggle('active', parseInt(b.dataset.svCount) === svCount));
            }
            syncCountBtns();

            countBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    svCount = parseInt(btn.dataset.svCount);
                    syncCountBtns();
                    const layouts = SV_LAYOUTS[svCount];
                    if (layouts.length && !layouts.find(l => l.id === svLayout)) {
                        svLayout = layouts[0].id;
                    }
                    renderLayoutTiles();
                    renderPageSelects();
                    save();
                });
            });

            // ── Layout tiles ───────────────────────────────────────────────
            function renderLayoutTiles() {
                layoutRow.querySelectorAll('.sv-layout-tile, .sv-layout-note').forEach(el => el.remove());
                const layouts = SV_LAYOUTS[svCount];

                if (!layouts || layouts.length === 0) {
                    const note = document.createElement('span');
                    note.className   = 'sv-layout-note';
                    note.textContent = 'Single pane — no layout needed';
                    layoutRow.appendChild(note);
                    return;
                }

                layouts.forEach(({ id, label }) => {
                    const tile = document.createElement('button');
                    tile.className = 'sv-layout-tile' + (svLayout === id ? ' active' : '');
                    tile.innerHTML = svLayoutIcon(id, svCount) + `<span>${label}</span>`;
                    tile.addEventListener('click', () => {
                        svLayout = id;
                        renderLayoutTiles();
                        save();
                    });
                    layoutRow.appendChild(tile);
                });
            }
            renderLayoutTiles();

            // ── Page selects ───────────────────────────────────────────────
            function renderPageSelects() {
                pagesRow.innerHTML = '';
                for (let i = 0; i < svCount; i++) {
                    const group = document.createElement('div');
                    group.className = 'sv-page-group';

                    const lbl = document.createElement('label');
                    lbl.textContent = `Pane ${i + 1}`;
                    group.appendChild(lbl);

                    const sel = document.createElement('select');
                    SV_PAGES.forEach(({ label, value }) => {
                        const opt = document.createElement('option');
                        opt.value       = value;
                        opt.textContent = label;
                        if (value === (svPages[i] || '')) opt.selected = true;
                        sel.appendChild(opt);
                    });
                    sel.addEventListener('change', () => {
                        svPages[i] = sel.value;
                        save();
                    });
                    group.appendChild(sel);
                    pagesRow.appendChild(group);
                }
            }
            renderPageSelects();

            // ── Persist ────────────────────────────────────────────────────
            function save() {
                chrome.storage.local.set({
                    splitViewCount:  svCount,
                    splitViewLayout: svLayout,
                    splitViewPages:  svPages.slice(0, svCount),
                });
            }

            // ── Open button ────────────────────────────────────────────────
            document.getElementById('sv-open-btn').addEventListener('click', () => {
                window.open(chrome.runtime.getURL('splitview.html'), '_blank');
            });
        }
    );
});