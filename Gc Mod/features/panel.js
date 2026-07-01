chrome.storage.local.get(['panelPos', 'presets', 'storedSid', 'assimEnabled', 'infectEnabled',
     'clusterCollapsed', 'similareCollapsed', 'viralCollapsed', 'fedLazy', 'fedFull',
      'clusterMineral', 'simsLinksEnabled', 'importantEventsLinkEnabled', 'chatFeatureEnabled', 'batchButtonsEnabled', 'quickBuildEnabled', 'battleLogsEnabled'], (res) => {
    const pos = res.panelPos || { top: '20px', left: 'auto', right: '20px' };
    const savedPresets = res.presets || {};

    const sidMatch = document.documentElement.innerHTML.match(/&(\d+)&/) || window.location.href.match(/&(\d+)&/);
    sid = sidMatch ? sidMatch[1] : res.storedSid;
    if (sid) chrome.storage.local.set({ storedSid: sid });

    const simsLinksEnabledState          = (res.simsLinksEnabled !== false);
    const importantEventsLinkEnabledState = (res.importantEventsLinkEnabled !== false);
    chatFeatureEnabledState = (res.chatFeatureEnabled !== false);
    batchButtonsEnabledState = (res.batchButtonsEnabled !== false);
    quickBuildEnabledState = (res.quickBuildEnabled !== false);
    battleLogsEnabledState = (res.battleLogsEnabled !== false);

    const container = document.createElement('div');
    container.id = 'gcc-preset-panel';
    container.style.cssText = `position:fixed; top:${pos.top}; left:${pos.left}; right:${pos.right}; width:210px; background:var(--bg-elevated); border:1px solid var(--border); z-index:99999; border-radius:10px; overflow:hidden; box-shadow:var(--shadow-lg); font-family:Arial,sans-serif; color:var(--text-primary);`;

    container.innerHTML = `
        <style>
            #gcc-preset-panel * { box-sizing: border-box; }
            #gcc-refresh-btn { background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.13); color:var(--text-secondary); cursor:pointer; border-radius:5px; padding:3px 8px; font-size:13px; line-height:1; transition:background 0.15s,color 0.15s; }
            #gcc-refresh-btn:hover { background:rgba(255,255,255,0.17); color:var(--text-primary); }
            .gcc-section { padding:8px 10px; border-bottom:1px solid rgba(255,255,255,0.07); }
            .gcc-section-label { font-size:9px; color:var(--accent); font-weight:800; letter-spacing:0.8px; text-transform:uppercase; margin-bottom:6px; }
            .gcc-section-sublabel { font-size:9px; color:var(--text-muted); font-weight:700; letter-spacing:0.5px; text-transform:uppercase; margin-bottom:5px; }
            #gcc-cluster-mineral { background:var(--bg-base); color:var(--text-primary); border:1px solid var(--border); border-radius:5px; font-size:11px; padding:5px 22px 5px 7px; width:100%; cursor:pointer; outline:none; appearance:none; -webkit-appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23888' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 7px center; }
            #gcc-cluster-mineral:focus { border-color:var(--border-strong); }
            .gcc-collapse-header { padding:7px 10px; background:var(--bg-base); cursor:pointer; display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.07); transition:background 0.12s; }
            .gcc-collapse-header:hover { background:var(--bg-surface); }
            .gcc-collapse-title { font-size:10px; color:var(--accent); font-weight:700; letter-spacing:0.4px; }
            .gcc-collapse-arrow { font-size:10px; color:var(--text-muted); transition:color 0.12s; }
            .gcc-collapse-header:hover .gcc-collapse-arrow { color:var(--text-secondary); }
            .gcc-collapse-body { background:var(--bg-base); padding:0 8px 8px; }
            .gcc-cluster-btns { display:flex; flex-direction:column; gap:3px; padding-top:6px; }
            .gcc-global-cluster { background:transparent; color:var(--text-secondary); border:1px solid var(--border); font-size:10px; padding:6px 8px; cursor:pointer; border-radius:5px; text-align:left; transition:background 0.12s,border-color 0.12s,color 0.12s; width:100%; font-family:Arial,sans-serif; }
            .gcc-global-cluster:hover { background:color-mix(in srgb, var(--accent) 10%, transparent); border-color:color-mix(in srgb, var(--accent) 28%, transparent); color:var(--text-primary); }
            #gcc-cluster-status { font-size:9px; color:var(--text-muted); text-align:center; padding:4px 0; min-height:18px; }
            .gcc-footer-link { display:block; background:var(--bg-base); color:var(--accent-cool); font-size:10px; text-decoration:none; padding:9px 0; text-align:center; font-weight:700; letter-spacing:0.3px; transition:background 0.12s,color 0.12s; border-top:1px solid rgba(255,255,255,0.07); }
            .gcc-footer-link:hover { background:var(--bg-surface); color:var(--text-primary); }
        </style>

        <div id="gcc-handle" style="background:var(--bg-base); padding:9px 10px; cursor:move; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.08); user-select:none;">
            <span style="font-size:11px; font-weight:800; color:var(--accent); letter-spacing:1px;">⠿ HELPER</span>
            <button id="gcc-refresh-btn" title="Refresh Page">↻</button>
        </div>

        <div id="gcc-update-banner"></div>

        <div class="gcc-section">
            <div class="gcc-section-label">Ship Presets</div>
            <div id="gcc-btn-area" style="display:flex; gap:3px;"></div>
        </div>

        <div class="gcc-section">
            <div class="gcc-section-sublabel">Target Mineral</div>
            <select id="gcc-cluster-mineral">
                <option value="1">Terran Metal</option>
                <option value="2" selected>Red Crystal</option>
                <option value="3">White Crystal</option>
                <option value="4">Rutile</option>
                <option value="5">Composite</option>
                <option value="6">Strafez Organism</option>
            </select>
        </div>

        <div id="gcc-reg-wrapper">
            <div id="gcc-cluster-header" class="gcc-collapse-header">
                <span class="gcc-collapse-title">Regular Cluster</span>
                <span id="gcc-cluster-arrow" class="gcc-collapse-arrow">▾</span>
            </div>
            <div id="gcc-cluster-body" class="gcc-collapse-body">
                <div class="gcc-cluster-btns">
                    <button class="gcc-global-cluster" data-tid="20">⏫ Upgrade Lvl 1</button>
                    <button class="gcc-global-cluster" data-tid="21">⏫ Upgrade Lvl 2</button>
                    <button class="gcc-global-cluster" data-tid="22">⏫ Upgrade Lvl 3</button>
                </div>
            </div>
        </div>

        <div id="gcc-coll-wrapper">
            <div id="gcc-similare-header" class="gcc-collapse-header">
                <span class="gcc-collapse-title">Collective</span>
                <span id="gcc-similare-arrow" class="gcc-collapse-arrow">▾</span>
            </div>
            <div id="gcc-similare-body" class="gcc-collapse-body">
                <div class="gcc-cluster-btns">
                    <button class="gcc-global-cluster" data-tid="1">⏫ Upgrade C.2</button>
                    <button class="gcc-global-cluster" data-tid="2">⏫ Upgrade C.3</button>
                    <button class="gcc-global-cluster" data-tid="3">⏫ Upgrade C.4</button>
                    <button class="gcc-global-cluster" data-tid="7">⏫ Upgrade C.5</button>
                    <button class="gcc-global-cluster" data-tid="5">⏫ Upgrade C2</button>
                    <button class="gcc-global-cluster" data-tid="6">⏫ Upgrade C3</button>
                </div>
            </div>
        </div>

        <div id="gcc-viral-wrapper">
            <div id="gcc-viral-header" class="gcc-collapse-header">
                <span class="gcc-collapse-title">Viral</span>
                <span id="gcc-viral-arrow" class="gcc-collapse-arrow">▾</span>
            </div>
            <div id="gcc-viral-body" class="gcc-collapse-body">
                <div class="gcc-cluster-btns">
                    <button class="gcc-global-cluster" data-tid="1">⏫ Upgrade C.2</button>
                    <button class="gcc-global-cluster" data-tid="2">⏫ Upgrade C.3</button>
                    <button class="gcc-global-cluster" data-tid="3">⏫ Upgrade C.4</button>
                    <button class="gcc-global-cluster" data-tid="4">⏫ Upgrade C2</button>
                    <button class="gcc-global-cluster" data-tid="5">⏫ Upgrade C3</button>
                </div>
            </div>
        </div>

        <div id="gcc-cluster-status"></div>

        <a href="#" id="lnk-dashboard" class="gcc-footer-link">Dashboard</a>
        <div id="gcc-custom-links"></div>
    `;
    if (window.top !== window.self) {
        if (typeof attachShipHoverTooltips === 'function') attachShipHoverTooltips();
        if (batchButtonsEnabledState && window.location.href.includes('f=com_ship')) {
            try { addShipBuilderBatchButtons(); setInterval(addShipBuilderBatchButtons, 1500); } catch(e) {}
        }
        if (window.location.href.includes('f=com_disband')) { observeUntil('table.Default', addDisbandQuickCells); }
        if (simsLinksEnabledState !== false) { try { addSimulationsLinks(); setTimeout(addSimulationsLinks, 500); } catch(e) {} }
        addImportantEventsLink(); setTimeout(addImportantEventsLink, 1000);
        if (res.assimEnabled) { observeUntil('table.gc-colony-modern-table', () => addAssimilateButtons(sid)); }
        if (res.infectEnabled) { observeUntil('table.gc-colony-modern-table', () => addInfectButtons(sid)); }
        if (quickBuildEnabledState) { observeUntil('table.gc-colony-modern-table', attachQuickBuild); }
        if (battleLogsEnabledState) { observeUntil('table.gc-battle-prev-table', attachBattleLogs); }
        observeUntil('table.gc-colupgrade-minerals', addColonyUpgradeLandColumn);
        if (res.fedLazy) { try { attachFedLazy(sid); } catch(e){} }
        if (res.fedFull) { try { attachFedFull(sid); } catch(e){} }
        observeUntil('table.gc-fed-list', () => { try { attachFedJoinStats(); } catch(e){} });
        addMarketQuickFill();
        initIncomePage();
        return;
    }
    document.body.appendChild(container);

    observeUntil('table.gc-colupgrade-minerals', addColonyUpgradeLandColumn);

    setupLogic(container, savedPresets, sid, !!res.assimEnabled, !!res.infectEnabled, !!res.clusterCollapsed, !!res.similareCollapsed, !!res.viralCollapsed, !!res.fedLazy, !!res.fedFull, simsLinksEnabledState, importantEventsLinkEnabledState);

    renderEmbeddedBottomChat();
});

function renderCustomLinks() {
    const wrap = document.getElementById('gcc-custom-links');
    if (!wrap) return;
    chrome.storage.local.get(['customLinks'], (res) => {
        wrap.innerHTML = '';
        const links = Array.isArray(res.customLinks) ? res.customLinks : [];
        links.forEach(link => {
            const url = link && link.url ? String(link.url).trim() : '';
            if (!url) return;
            const a = document.createElement('a');
            a.className = 'gcc-footer-link';
            a.href = url;
            a.textContent = (link.name && String(link.name).trim()) ? String(link.name).trim() : url;
            wrap.appendChild(a);
        });
    });
}

function observeUntil(selector, callback, timeout = 5000) {
    if (document.querySelector(selector)) { callback(); return; }
    const obs = new MutationObserver(() => {
        if (document.querySelector(selector)) { obs.disconnect(); callback(); }
    });
    obs.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => obs.disconnect(), timeout);
}

function setupLogic(container, presets, sid, assimEnabled, infectEnabled, clusterCollapsed,
    similareCollapsed, viralCollapsed, fedLazy, fedFull, simsLinksEnabledState, importantEventsLinkEnabledState) {
    document.getElementById('gcc-refresh-btn').onclick = () => window.location.reload();

    checkForUpdates();

    const dashLink = document.getElementById('lnk-dashboard');
    if (dashLink) {
        dashLink.addEventListener('click', (e) => {
            e.preventDefault();
            const dashboardUrl = chrome.runtime.getURL('dashboard.html');
            window.open(dashboardUrl, '_blank');
        });
    }

    // User-defined custom links, shown under the Dashboard link.
    renderCustomLinks();
    chrome.storage.onChanged.addListener((changes, ns) => {
        if (ns === 'local' && changes.customLinks) renderCustomLinks();
    });

    // Global Colony Cluster buttons
    document.querySelectorAll('.gcc-global-cluster').forEach(btn => {
        btn.onclick = () => {
            const tid = btn.getAttribute('data-tid');
            if (!sid) return alert("SID not found. Please click 'Cmd' to sync.");
            performGlobalCluster(tid, sid);
        };
    });

    // Ship Preset buttons
    const getTooltip = (data) => {
        if (!data) return "Empty (Right-click to save)";
        return Object.values(data).map(d => `${d.name}: ${d.qty}`).join("\n");
    };

    const btnArea = document.getElementById('gcc-btn-area');
    if (btnArea) {
        for (let i = 1; i <= 5; i++) {
            const btn = document.createElement('button');
            btn.innerText = `P${i}`;
            btn.title = getTooltip(presets[i]);
            btn.style.cssText = `flex:1; padding:6px 0; cursor:pointer; border-radius:5px; border:1px solid ${presets[i] ? 'rgba(46,125,50,0.6)' : 'rgba(255,255,255,0.1)'}; font-size:10px; background:${presets[i] ? '#2e7d32' : 'rgba(255,255,255,0.05)'}; color:white; font-weight:bold; transition:opacity 0.12s; font-family:Arial,sans-serif;`;

            btn.onclick = () => {
                if (!presets[i]) return alert("Preset empty.");
                btn.innerText = "⏳";
                const bWin = window.open(`i.cfm?&${sid}&f=com_ship`, '_blank', 'width=100,height=100,left=10000,top=10000');
                const t = setInterval(() => {
                    try {
                        if (bWin.document.readyState === 'complete') {
                            clearInterval(t);
                            Object.keys(presets[i]).forEach(id => {
                                const inp = bWin.document.getElementById(id) || bWin.document.getElementsByName(id)[0];
                                if (inp) inp.value = presets[i][id].qty;
                            });
                            bWin.document.querySelector('input[name="Build"]').click();
                            setTimeout(() => { bWin.close(); window.location.reload(); }, 1200);
                        }
                    } catch(e){}
                }, 500);
            };

            btn.oncontextmenu = (e) => {
                e.preventDefault();
                const inputs = document.querySelectorAll('.gc-builder-input');
                let data = {};
                inputs.forEach(inp => {
                    if (inp.value > 0) {
                        const card = inp.closest('.gc-builder-card');
                        let shipName = "Unknown";
                        if (card) {
                            const titleEl = card.querySelector('.gc-builder-card__titleline');
                            if (titleEl) shipName = titleEl.innerText.replace(/\n/g, ' ').trim();
                        }
                        data[inp.name || inp.id] = { name: shipName, qty: inp.value };
                    }
                });
                if (Object.keys(data).length === 0) return alert("Enter quantities first.");
                presets[i] = data;
                chrome.storage.local.set({ presets }, () => {
                    btn.style.background = '#2e7d32';
                    btn.style.borderColor = 'rgba(46,125,50,0.6)';
                    btn.title = getTooltip(data);
                });
            };
            btnArea.appendChild(btn);
        }
    }

    // Link Sync
    if (sid) {
        ['lnk-cmd', 'lnk-build', 'lnk-manage', 'lnk-rank'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.href = el.href.replace('i.cfm?', `i.cfm?&${sid}&`);
        });
    }

    // Dragging
    const handle = document.getElementById('gcc-handle');
    let dragging = false, offset = { x: 0, y: 0 };
    if (handle) {
        handle.onmousedown = (e) => { if(e.target.id === 'gcc-refresh-btn') return; dragging = true; offset.x = e.clientX - container.offsetLeft; offset.y = e.clientY - container.offsetTop; };
        const onMouseMove = (e) => { if (dragging) { container.style.left = (e.clientX - offset.x) + 'px'; container.style.top = (e.clientY - offset.y) + 'px'; container.style.right = 'auto'; } };
        const onMouseUp = () => { if (dragging) { dragging = false; chrome.storage.local.set({ panelPos: { top: container.style.top, left: container.style.left } }); } };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    // Ship hover tooltips
    if (typeof attachShipHoverTooltips === 'function') attachShipHoverTooltips();

    if (batchButtonsEnabledState && window.location.href.includes('f=com_ship')) {
        try {
            addShipBuilderBatchButtons();
            setInterval(addShipBuilderBatchButtons, 1500);
        } catch (e) { console.error('Batch Buttons Error:', e); }
    }

    if (window.location.href.includes('f=com_disband')) {
        observeUntil('table.Default', addDisbandQuickCells);
    }

    // Simulations links
    if (simsLinksEnabledState !== false) {
        try {
            addSimulationsLinks();
            setTimeout(addSimulationsLinks, 500);
        } catch (e) { }
    }
    if (importantEventsLinkEnabledState) {
        addImportantEventsLink();
        setTimeout(addImportantEventsLink, 1000);
    }

    if (assimEnabled) {
        observeUntil('table.gc-colony-modern-table', () => addAssimilateButtons(sid));
    }
    if (infectEnabled) {
        observeUntil('table.gc-colony-modern-table', () => addInfectButtons(sid));
    }
    if (quickBuildEnabledState) {
        observeUntil('table.gc-colony-modern-table', attachQuickBuild);
    }
    if (battleLogsEnabledState) {
        observeUntil('table.gc-battle-prev-table', attachBattleLogs);
    }

    // Federation live load
    if (fedLazy) { try { attachFedLazy(sid); } catch(e){} }
    if (fedFull) { try { attachFedFull(sid); } catch(e){} }
    observeUntil('table.gc-fed-list', () => { try { attachFedJoinStats(); } catch(e){} });
    addMarketQuickFill();
    observeUntil('.gc-income-page', enhanceIncomePage);

    // Cluster section visibility
    const applyVisibility = (wrapperId, isHiddenFromDashboard) => {
        const wrapper = document.getElementById(wrapperId);
        if (wrapper) wrapper.style.display = isHiddenFromDashboard ? 'none' : 'block';
    };

    applyVisibility('gcc-reg-wrapper', clusterCollapsed);
    applyVisibility('gcc-coll-wrapper', similareCollapsed);
    applyVisibility('gcc-viral-wrapper', viralCollapsed);

    const applyCollapse = (bodyId, arrowId, isCollapsed) => {
        const body = document.getElementById(bodyId);
        const arrow = document.getElementById(arrowId);
        if (!body || !arrow) return;
        body.style.display = isCollapsed ? 'none' : 'block';
        arrow.textContent = isCollapsed ? '▸' : '▾';
    };

    chrome.storage.local.get([
        'regManualCollapsed',
        'collManualCollapsed',
        'viralManualCollapsed'
    ], (result) => {
        let regInner = result.regManualCollapsed || false;
        let collInner = result.collManualCollapsed || false;
        let viralInner = result.viralManualCollapsed || false;

        applyCollapse('gcc-cluster-body', 'gcc-cluster-arrow', regInner);
        applyCollapse('gcc-similare-body', 'gcc-similare-arrow', collInner);
        applyCollapse('gcc-viral-body', 'gcc-viral-arrow', viralInner);

        const regHeader = document.getElementById('gcc-cluster-header');
        if (regHeader) {
            regHeader.onclick = () => {
                regInner = !regInner;
                applyCollapse('gcc-cluster-body', 'gcc-cluster-arrow', regInner);
                chrome.storage.local.set({ regManualCollapsed: regInner });
            };
        }

        const collHeader = document.getElementById('gcc-similare-header');
        if (collHeader) {
            collHeader.onclick = () => {
                collInner = !collInner;
                applyCollapse('gcc-similare-body', 'gcc-similare-arrow', collInner);
                chrome.storage.local.set({ collManualCollapsed: collInner });
            };
        }

        const viralHeader = document.getElementById('gcc-viral-header');
        if (viralHeader) {
            viralHeader.onclick = () => {
                viralInner = !viralInner;
                applyCollapse('gcc-viral-body', 'gcc-viral-arrow', viralInner);
                chrome.storage.local.set({ viralManualCollapsed: viralInner });
            };
        }
    });

    const mineralSelect = document.getElementById('gcc-cluster-mineral');
    if (mineralSelect) {
        chrome.storage.local.get(['clusterMineral'], (stored) => {
            if (stored.clusterMineral) mineralSelect.value = stored.clusterMineral;
        });

        mineralSelect.addEventListener('change', () => {
            chrome.storage.local.set({ clusterMineral: mineralSelect.value });
        });
    }
}
