/** * GC Helper Tool - Final Polished Version with Auto-Explore & Global Clustering
 */
let sid = null;

// === 1. AUTO-EXPLORE FEATURE ===
(function autoExplore() {
    const exploreBtn = document.querySelector('input[type="button"][onclick*="com_explore"]');
    if (exploreBtn) {
        exploreBtn.click();
    }
})();

function autoClickContinue() {
    const buttons = document.querySelectorAll('input[type="button"][onclick*="f=com_col"]');
    const btn = Array.from(buttons).find(b => b.value.trim().toLowerCase() === 'continue');
    if (btn) btn.click();
}

// === 2. MAIN EXTENSION PANEL LOGIC ===
chrome.storage.local.get(['panelPos', 'presets', 'storedSid', 'assimEnabled', 'infectEnabled', 'clusterCollapsed', 'similareCollapsed', 'viralCollapsed', 'fedLazy', 'fedFull'], (res) => {
    const pos = res.panelPos || { top: '20px', left: 'auto', right: '20px' };
    const savedPresets = res.presets || {};

    const sidMatch = document.documentElement.innerHTML.match(/&(\d+)&/) || window.location.href.match(/&(\d+)&/);
    sid = sidMatch ? sidMatch[1] : res.storedSid;
    if (sid) chrome.storage.local.set({ storedSid: sid });

    const container = document.createElement('div');
    container.id = 'gcc-preset-panel';
    container.style.cssText = `position:fixed; top:${pos.top}; left:${pos.left}; right:${pos.right}; width:190px; background:#2a365a; border:2px solid #444; z-index:99999; border-radius:8px; overflow:hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); font-family: Arial, sans-serif; color: white;`;

    container.innerHTML = `
        <div id="gcc-handle" style="background:#1f2842; padding:8px; cursor:move; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #444; user-select:none;">
            <span style="font-size:11px; font-weight:bold; margin-left:5px; color:#ff9800;">⠿ HELPER</span>
            <button id="gcc-refresh-btn" title="Refresh Page" style="background:#444; border:1px solid #555; color:white; cursor:pointer; border-radius:3px; padding:2px 6px; font-size:12px; line-height:1;">↻</button>
        </div>

        <div style="padding:8px; border-bottom:1px solid #333;">
            <div style="font-size:10px; color:#ff9800; margin-bottom:5px; font-weight:bold; letter-spacing:0.5px;">SHIP PRESETS</div>
            <div id="gcc-btn-area" style="display:flex; justify-content:space-between; gap:2px;"></div>
        </div>

        <div style="border-bottom:1px solid #333;">
            <div id="gcc-cluster-header" style="padding:8px; background:#1f2842; cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
                <div style="font-size:10px; color:#ff9800; font-weight:bold; letter-spacing:0.5px;">Regular Cluster</div>
                <span id="gcc-cluster-arrow" style="font-size:10px; color:#aaa;">▾</span>
            </div>
            <div id="gcc-cluster-body" style="padding:0 8px 8px; background:#1f2842;">
                <div style="display:flex; flex-direction:column; gap:4px; padding-top:6px;">
                    <button class="gcc-global-cluster" data-tid="20" style="background:#1f2842; color:white; border:1px solid #444; font-size:10px; padding:6px; cursor:pointer; border-radius:3px; text-align:left;">⏫ Upgrade Lvl 1</button>
                    <button class="gcc-global-cluster" data-tid="21" style="background:#1f2842; color:white; border:1px solid #444; font-size:10px; padding:6px; cursor:pointer; border-radius:3px; text-align:left;">⏫ Upgrade Lvl 2</button>
                    <button class="gcc-global-cluster" data-tid="22" style="background:#1f2842; color:white; border:1px solid #444; font-size:10px; padding:6px; cursor:pointer; border-radius:3px; text-align:left;">⏫ Upgrade Lvl 3</button>
                </div>
                <div id="gcc-cluster-status" style="font-size:9px; color:#888; text-align:center; margin-top:4px; height:10px;"></div>
            </div>
            <div id="gcc-similare-header" style="padding:8px; background:#1f2842; cursor:pointer; display:flex; justify-content:space-between; align-items:center; border-top:1px solid #333;">
                <div style="font-size:10px; color:#ff9800; font-weight:bold; letter-spacing:0.5px;">Collective</div>
                <span id="gcc-similare-arrow" style="font-size:10px; color:#aaa;">▾</span>
            </div>
            <div id="gcc-similare-body" style="padding:0 8px 8px; background:#1f2842;">
                <div style="display:flex; flex-direction:column; gap:4px; padding-top:6px;">
                    <button class="gcc-global-cluster" data-tid="1" style="background:#1f2842; color:white; border:1px solid #444; font-size:10px; padding:6px; cursor:pointer; border-radius:3px; text-align:left;">⏫ Upgrade C.2</button>
                    <button class="gcc-global-cluster" data-tid="2" style="background:#1f2842; color:white; border:1px solid #444; font-size:10px; padding:6px; cursor:pointer; border-radius:3px; text-align:left;">⏫ Upgrade C.3</button>
                    <button class="gcc-global-cluster" data-tid="3" style="background:#1f2842; color:white; border:1px solid #444; font-size:10px; padding:6px; cursor:pointer; border-radius:3px; text-align:left;">⏫ Upgrade C.4</button>
                    <button class="gcc-global-cluster" data-tid="7" style="background:#1f2842; color:white; border:1px solid #444; font-size:10px; padding:6px; cursor:pointer; border-radius:3px; text-align:left;">⏫ Upgrade C.5</button>
                    <button class="gcc-global-cluster" data-tid="5" style="background:#1f2842; color:white; border:1px solid #444; font-size:10px; padding:6px; cursor:pointer; border-radius:3px; text-align:left;">⏫ Upgrade C2</button>
                    <button class="gcc-global-cluster" data-tid="6" style="background:#1f2842; color:white; border:1px solid #444; font-size:10px; padding:6px; cursor:pointer; border-radius:3px; text-align:left;">⏫ Upgrade C3</button>
                </div>
            </div>
            <div id="gcc-viral-header" style="padding:8px; background:#1f2842; cursor:pointer; display:flex; justify-content:space-between; align-items:center; border-top:1px solid #333;">
                <div style="font-size:10px; color:#ff9800; font-weight:bold; letter-spacing:0.5px;">Viral</div>
                <span id="gcc-viral-arrow" style="font-size:10px; color:#aaa;">▾</span>
            </div>
            <div id="gcc-viral-body" style="padding:0 8px 8px; background:#1f2842;">
                <div style="display:flex; flex-direction:column; gap:4px; padding-top:6px;">
                    <button class="gcc-global-cluster" data-tid="1" style="background:#1f2842; color:white; border:1px solid #444; font-size:10px; padding:6px; cursor:pointer; border-radius:3px; text-align:left;">⏫ Upgrade C.2</button>
                    <button class="gcc-global-cluster" data-tid="2" style="background:#1f2842; color:white; border:1px solid #444; font-size:10px; padding:6px; cursor:pointer; border-radius:3px; text-align:left;">⏫ Upgrade C.3</button>
                    <button class="gcc-global-cluster" data-tid="3" style="background:#1f2842; color:white; border:1px solid #444; font-size:10px; padding:6px; cursor:pointer; border-radius:3px; text-align:left;">⏫ Upgrade C.4</button>
                    <button class="gcc-global-cluster" data-tid="4" style="background:#1f2842; color:white; border:1px solid #444; font-size:10px; padding:6px; cursor:pointer; border-radius:3px; text-align:left;">⏫ Upgrade C2</button>
                    <button class="gcc-global-cluster" data-tid="5" style="background:#1f2842; color:white; border:1px solid #444; font-size:10px; padding:6px; cursor:pointer; border-radius:3px; text-align:left;">⏫ Upgrade C3</button>
                </div>
            </div>
        </div>

        <div style="padding:8px; border-bottom:1px solid #333;">
            <div style="font-size:10px; color:#ff9800; margin-bottom:5px; font-weight:bold; letter-spacing:0.5px;">FEATURES</div>
            <label style="display:flex; align-items:center; gap:6px; cursor:pointer; font-size:11px; color:#ddd; margin-bottom:4px;">
                <input type="checkbox" id="gcc-assim-toggle" style="cursor:pointer;">
                Assimilate Buttons
            </label>
            <label style="display:flex; align-items:center; gap:6px; cursor:pointer; font-size:11px; color:#ddd; margin-bottom:4px;">
                <input type="checkbox" id="gcc-infect-toggle" style="cursor:pointer;">
                Infect Buttons
            </label>
            <div style="font-size:10px; color:#ff9800; margin:6px 0 4px; font-weight:bold; letter-spacing:0.5px;">FEDERATION NAMES</div>
            <label style="display:flex; align-items:center; gap:6px; cursor:pointer; font-size:11px; color:#ddd; margin-bottom:4px;">
                <input type="checkbox" id="gcc-fed-lazy" style="cursor:pointer;">
                Lazy Load (hover)
            </label>
            <label style="display:flex; align-items:center; gap:6px; cursor:pointer; font-size:11px; color:#ddd;">
                <input type="checkbox" id="gcc-fed-full" style="cursor:pointer;">
                Full Load
            </label>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1px; background:#444; border-top:1px solid #444;">
            <a href="i.cfm?f=com_empire&cm=3" id="lnk-cmd" class="gcc-footer-link">Cmd</a>
            <a href="i.cfm?f=com_ship" id="lnk-build" class="gcc-footer-link">Build</a>
            <a href="i.cfm?f=com_disband" id="lnk-manage" class="gcc-footer-link">Fleet</a>
            <a href="i.cfm?f=rank" id="lnk-rank" class="gcc-footer-link">Rank</a>
            <a href="#" id="lnk-dashboard" class="gcc-footer-link" style="grid-column: span 2;">Dashboard</a>
        </div>

        <style>
            .gcc-footer-link { background: #1f2842; color: #9edcfe; font-size: 10px; text-decoration: none; padding: 8px 0; text-align: center; font-weight: bold; transition: background 0.2s; }
            .gcc-footer-link:hover { background: #222c4b; color: #fff; }
        </style>
    `;
    document.body.appendChild(container);
    setupLogic(container, savedPresets, sid, !!res.assimEnabled, !!res.infectEnabled, !!res.clusterCollapsed, !!res.similareCollapsed, !!res.viralCollapsed, !!res.fedLazy, !!res.fedFull);
});

async function performGlobalCluster(tid, sid) {
    const status = document.getElementById('gcc-cluster-status');
    status.innerText = "⏳ Upgrading...";
    status.style.color = "#aaa";

    const url = `i.cfm?&${sid}&f=com_colupgrade&tid=${tid}&con=1`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: new URLSearchParams({ 'goodid': '2' })
        });

        if (response.ok) {
            status.style.color = "#4caf50";
            status.innerText = "✅ Upgrade Success!";
            setTimeout(() => { window.location.reload(); }, 1000);
        } else {
            throw new Error();
        }
    } catch (e) {
        status.style.color = "#f44336";
        status.innerText = "❌ Failed - Check Resources";
    }
}

// Cache for federation names: eid -> federation name string (or '' for none)
const fedCache = {};

async function fetchFederationName(eid, sid) {
    if (fedCache[eid] !== undefined) return fedCache[eid];
    try {
        const url = `i.cfm?&${sid}&f=com_intel&eid=${eid}`;
        const response = await fetch(url, { credentials: 'same-origin' });
        if (!response.ok) { fedCache[eid] = ''; return ''; }
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        // Find the Federation row: <td>Federation</td> followed by <td>name...</td>
        const rows = Array.from(doc.querySelectorAll('tr'));
        let fedName = '';
        for (const row of rows) {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 2 && cells[0].textContent.trim() === 'Federation') {
                // Get text content of the second cell, excluding the "More info" link text
                const clone = cells[1].cloneNode(true);
                const link = clone.querySelector('a');
                if (link) link.remove();
                fedName = clone.textContent.replace(/\u00A0/g, ' ').trim();
                break;
            }
        }
        fedCache[eid] = fedName;
        return fedName;
    } catch (e) {
        fedCache[eid] = '';
        return '';
    }
}

let warFedCache = null;

async function fetchWarFederations(sid) {
    if (warFedCache !== null) return warFedCache;
    try {
        const response = await fetch(`i.cfm?&${sid}&f=fed_war`, { credentials: 'same-origin' });
        if (!response.ok) { warFedCache = []; return []; }
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const warFeds = [];
        const table = doc.querySelector('table.gc-fed-war-table');
        if (table) {
            Array.from(table.querySelectorAll('tr')).forEach(row => {
                if (row.classList.contains('Header')) return;
                const a = row.querySelector('a');
                if (a) {
                    // Strip any trailing image alt text and whitespace
                    const name = a.childNodes[0].textContent.trim();
                    if (name) warFeds.push(name.toLowerCase());
                }
            });
        }
        warFedCache = warFeds;
        return warFeds;
    } catch (e) {
        warFedCache = [];
        return [];
    }
}

function applyWarHighlight(row, fedName, warFeds) {
    if (!fedName || fedName === 'No Federation' || !warFeds.length) return;
    if (!warFeds.includes(fedName.toLowerCase())) return;
    const attackLink = row.querySelector('a[href*="f=com_attack"]');
    if (attackLink) {
        attackLink.style.color = '#4caf50';
        attackLink.style.fontWeight = 'bold';
    }
}

function getOrCreateFedSpan(nameTd) {
    let span = nameTd.querySelector('.gcc-fed-name');
    if (!span) {
        span = document.createElement('div');
        span.className = 'gcc-fed-name';
        span.style.cssText = 'font-size:8px; color:#81d4fa; margin-top:1px; font-style:italic;';
        nameTd.appendChild(span);
    }
    return span;
}

function attachFedLazy(sid) {
    if (!window.location.href.includes('f=rank')) return;
    const tables = document.querySelectorAll('table.rank-results-table, table.rank-page-table');
    if (!tables.length) return;

    const rows = Array.from(tables).flatMap(table =>
    Array.from(table.querySelectorAll('tr')).filter(r => !r.classList.contains('rank-results-header') && !r.classList.contains('Header'))
    );
    
    rows.forEach(row => {
        if (row.dataset.gccFedLazyBound) return;
        const intelAnchor = row.querySelector('a[href*="f=com_intel"]');
        if (!intelAnchor) return;
        const eidMatch = intelAnchor.getAttribute('href').match(/eid=(\d+)/);
        if (!eidMatch) return;
        const eid = eidMatch[1];
        const nameTd = intelAnchor.closest('td');
        if (!nameTd) return;

        intelAnchor.addEventListener('mouseenter', async () => {
            const span = getOrCreateFedSpan(nameTd);
            if (span.dataset.loaded) return;
            span.textContent = '...';
            const [name, warFeds] = await Promise.all([
            fetchFederationName(eid, sid),
            fetchWarFederations(sid)
            ]);
            span.textContent = name || 'No Federation';
            span.dataset.loaded = '1';
            applyWarHighlight(row, name, warFeds);
        });

        row.dataset.gccFedLazyBound = '1';
    });
}

async function attachFedFull(sid) {
    if (!window.location.href.includes('f=rank')) return;
    const tables = document.querySelectorAll('table.rank-results-table, table.rank-page-table');
    if (!tables.length) return;

    const rows = Array.from(tables).flatMap(table =>
    Array.from(table.querySelectorAll('tr')).filter(r => !r.classList.contains('rank-results-header') && !r.classList.contains('Header'))
    );
    // Fire all fetches in parallel
    const tasks = rows.map(async row => {
        if (row.dataset.gccFedFullDone) return;
        const intelAnchor = row.querySelector('a[href*="f=com_intel"]');
        if (!intelAnchor) return;
        const eidMatch = intelAnchor.getAttribute('href').match(/eid=(\d+)/);
        if (!eidMatch) return;
        const eid = eidMatch[1];
        const nameTd = intelAnchor.closest('td');
        if (!nameTd) return;

        const span = getOrCreateFedSpan(nameTd);
        span.textContent = '...';
        const [name, warFeds] = await Promise.all([
            fetchFederationName(eid, sid),
            fetchWarFederations(sid)
        ]);
        span.textContent = name || 'No Federation';
        span.dataset.loaded = '1';
        applyWarHighlight(row, name, warFeds);
        row.dataset.gccFedFullDone = '1';
    });

    await Promise.all(tasks);
}

function removeFedNames() {
    document.querySelectorAll('.gcc-fed-name').forEach(el => el.remove());
    // Clear bound flags so they can be re-attached if re-enabled
    document.querySelectorAll('[data-gcc-fed-lazy-bound]').forEach(el => delete el.dataset.gccFedLazyBound);
    document.querySelectorAll('[data-gcc-fed-full-done]').forEach(el => delete el.dataset.gccFedFullDone);
}

function setupLogic(container, presets, sid, assimEnabled, infectEnabled, clusterCollapsed, similareCollapsed, viralCollapsed, fedLazy, fedFull) {
    document.getElementById('gcc-refresh-btn').onclick = () => window.location.reload();

    // Add this line inside your setupLogic execution function block in content.js
    const dashLink = document.getElementById('lnk-dashboard');
    if (dashLink) {
        dashLink.addEventListener('click', (e) => {
            e.preventDefault();
        
            // Use the chrome runtime API to pull the accurate internal address
            const dashboardUrl = chrome.runtime.getURL('dashboard.html');
        
            window.open(dashboardUrl, '_blank');
        });
    }

    // 1. Global Colony Cluster Logic
    document.querySelectorAll('.gcc-global-cluster').forEach(btn => {
        btn.onclick = () => {
            const tid = btn.getAttribute('data-tid');
            if (!sid) return alert("SID not found. Please click 'Cmd' to sync.");
            performGlobalCluster(tid, sid);
        };
    });

    // 2. Ship Preset Logic
    const getTooltip = (data) => {
        if (!data) return "Empty (Right-click to save)";
        return Object.values(data).map(d => `${d.name}: ${d.qty}`).join("\n");
    };

    const btnArea = document.getElementById('gcc-btn-area');
    for (let i = 1; i <= 5; i++) {
        const btn = document.createElement('button');
        btn.innerText = `P${i}`;
        btn.title = getTooltip(presets[i]);
        btn.style.cssText = `flex:1; padding:6px 0; cursor:pointer; border-radius:4px; border:1px solid #444; font-size:10px; background:${presets[i] ? "#2e7d32" : "#1f2842"}; color:white; font-weight:bold;`;

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
                btn.style.background = "#2e7d32";
                btn.title = getTooltip(data);
            });
        };
        btnArea.appendChild(btn);
    }

    // 3. Link Sync
    if (sid) {
        ['lnk-cmd', 'lnk-build', 'lnk-manage', 'lnk-rank'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.href = el.href.replace('i.cfm?', `i.cfm?&${sid}&`);
        });
    }

    // 4. Dragging Logic
    const handle = document.getElementById('gcc-handle');
    let dragging = false, offset = { x: 0, y: 0 };
    handle.onmousedown = (e) => { if(e.target.id === 'gcc-refresh-btn') return; dragging = true; offset.x = e.clientX - container.offsetLeft; offset.y = e.clientY - container.offsetTop; };
    document.onmousemove = (e) => { if (dragging) { container.style.left = (e.clientX - offset.x) + 'px'; container.style.top = (e.clientY - offset.y) + 'px'; container.style.right = 'auto'; } };
    document.onmouseup = () => { if (dragging) { dragging = false; chrome.storage.local.set({ panelPos: { top: container.style.top, left: container.style.left } }); } };

    // 5. Ship hover tooltips
    attachShipHoverTooltips();

    // 6. Add ship builder batch buttons on the ship page only
    try {
        if (window.location.href.includes('f=com_ship')) {
            addShipBuilderBatchButtons();
            setTimeout(addShipBuilderBatchButtons, 500);
            setTimeout(addShipBuilderBatchButtons, 1000);
        }
    } catch (e) {}

    // 7. Add disband quick-action cells on the disband page only
    try {
        if (window.location.href.includes('f=com_disband')) {
            addDisbandQuickCells();
            setTimeout(addDisbandQuickCells, 500);
            setTimeout(addDisbandQuickCells, 1000);
        }
    } catch (e) {}

    // 8. Add Simulations links to the bottom of the left nav bar
    try {
        addSimulationsLinks();
        setTimeout(addSimulationsLinks, 500);
    } catch (e) {}

    // 9a. Assimilate toggle
    const assimToggle = document.getElementById('gcc-assim-toggle');
    assimToggle.checked = assimEnabled;

    const removeAssimilateButtons = () => {
        document.querySelectorAll('tr[data-gcc-assim-added]').forEach(row => {
            const lastTd = row.querySelector('td:last-child');
            if (lastTd) lastTd.remove();
            delete row.dataset.gccAssimAdded;
        });
        const header = document.querySelector('.gcc-assim-header');
        if (header) header.remove();
    };

    assimToggle.addEventListener('change', () => {
        chrome.storage.local.set({ assimEnabled: assimToggle.checked });
        if (assimToggle.checked) {
            addAssimilateButtons(sid);
        } else {
            removeAssimilateButtons();
        }
    });

    if (assimEnabled) {
        try {
            addAssimilateButtons(sid);
            setTimeout(() => addAssimilateButtons(sid), 500);
            setTimeout(() => addAssimilateButtons(sid), 1000);
        } catch (e) {}
    }
    // 9b. infect toggle
    const infectToggle = document.getElementById('gcc-infect-toggle');
    infectToggle.checked = infectEnabled;

    const removeInfectButtons = () => {
        document.querySelectorAll('tr[data-gcc-infect-added]').forEach(row => {
            const lastTd = row.querySelector('td:last-child');
            if (lastTd) lastTd.remove();
            delete row.dataset.gccInfectAdded;
        });
        const header = document.querySelector('.gcc-infect-header');
        if (header) header.remove();
    };

    infectToggle.addEventListener('change', () => {
        chrome.storage.local.set({ infectEnabled: infectToggle.checked });
        if (infectToggle.checked) {
            addInfectButtons(sid);
        } else {
            removeInfectButtons();
        }
    });

    if (infectEnabled) {
        try {
            addInfectButtons(sid);
            setTimeout(() => addInfectButtons(sid), 500);
            setTimeout(() => addInfectButtons(sid), 1000);
        } catch (e) {}
    }

    // 10. Auto-click Continue button
    try {
        autoClickContinue();
    } catch(e) {}

    // 11. Collapsible cluster sections
    const applyCollapse = (bodyId, arrowId, collapsed) => {
        const body = document.getElementById(bodyId);
        const arrow = document.getElementById(arrowId);
        if (!body || !arrow) return;
        body.style.display = collapsed ? 'none' : 'block';
        arrow.textContent = collapsed ? '▸' : '▾';
    };

    applyCollapse('gcc-cluster-body', 'gcc-cluster-arrow', clusterCollapsed);
    applyCollapse('gcc-similare-body', 'gcc-similare-arrow', similareCollapsed);
    applyCollapse('gcc-viral-body', 'gcc-viral-arrow', viralCollapsed);

    document.getElementById('gcc-cluster-header').addEventListener('click', () => {
        clusterCollapsed = !clusterCollapsed;
        applyCollapse('gcc-cluster-body', 'gcc-cluster-arrow', clusterCollapsed);
        chrome.storage.local.set({ clusterCollapsed });
    });

    document.getElementById('gcc-similare-header').addEventListener('click', () => {
        similareCollapsed = !similareCollapsed;
        applyCollapse('gcc-similare-body', 'gcc-similare-arrow', similareCollapsed);
        chrome.storage.local.set({ similareCollapsed });
    });

    document.getElementById('gcc-viral-header').addEventListener('click', () => {
        viralCollapsed = !viralCollapsed;
        applyCollapse('gcc-viral-body', 'gcc-viral-arrow', viralCollapsed);
        chrome.storage.local.set({ viralCollapsed });
    });

    // 12. Federation name toggles
    const fedLazyToggle = document.getElementById('gcc-fed-lazy');
    const fedFullToggle = document.getElementById('gcc-fed-full');

    fedLazyToggle.checked = fedLazy;
    fedFullToggle.checked = fedFull;

    // Apply on load
    if (fedLazy) attachFedLazy(sid);
    if (fedFull) attachFedFull(sid);

    fedLazyToggle.addEventListener('change', () => {
        if (fedLazyToggle.checked) {
            fedFullToggle.checked = false;
            chrome.storage.local.set({ fedLazy: true, fedFull: false });
            removeFedNames();
            attachFedLazy(sid);
        } else {
            chrome.storage.local.set({ fedLazy: false });
            removeFedNames();
        }
    });

    fedFullToggle.addEventListener('change', () => {
        if (fedFullToggle.checked) {
            fedLazyToggle.checked = false;
            chrome.storage.local.set({ fedFull: true, fedLazy: false });
            removeFedNames();
            attachFedFull(sid);
        } else {
            chrome.storage.local.set({ fedFull: false });
            removeFedNames();
        }
    });
}

function addDisbandQuickCells() {
    if (!window.location.href.includes('f=com_disband')) return;
    const tables = Array.from(document.querySelectorAll('table.Default'));
    if (!tables.length) return;
    tables.forEach(table => {
        const header = table.querySelector('tr.Header');
        if (!header) return;

        Array.from(header.querySelectorAll('td')).forEach(td => {
            const t = (td.textContent || '').trim();
            if (t === '10%' || t === '50%' || t === 'All') td.remove();
        });
        const headerTds = Array.from(header.querySelectorAll('td'));
        let disIdx = headerTds.findIndex(td => /disband/i.test(td.textContent || ''));
        if (disIdx === -1) disIdx = 2;
        const disHeaderRef = headerTds[disIdx];
        if (disHeaderRef) {
            const frag = document.createDocumentFragment();
            ['10%','50%','All'].forEach(label => {
                const td = document.createElement('td');
                td.style.textAlign = 'center';
                td.style.verticalAlign = 'middle';
                td.textContent = label;
                frag.appendChild(td);
            });
            header.insertBefore(frag, disHeaderRef);
        }

        const rows = Array.from(table.querySelectorAll('tr')).filter(r => !/header/i.test(r.className || ''));
        rows.forEach(row => {
            const disInput = row.querySelector('input[name^="dis_"]');
            if (!disInput) return;
            const disTd = disInput.closest('td');
            if (!disTd) return;

            let prev = disTd.previousElementSibling;
            while (prev && ['10%','50%','All'].includes((prev.textContent||'').trim())) {
                const rem = prev;
                prev = prev.previousElementSibling;
                rem.remove();
            }

            const frag = document.createDocumentFragment();
            ['10%','50%','All'].forEach(label => {
                const td = document.createElement('td');
                td.style.textAlign = 'center';
                const a = document.createElement('a');
                a.href = 'javascript:void(0);';
                a.textContent = label;
                a.style.display = 'inline-block';
                a.style.padding = '4px 8px';
                a.style.background = '#e8b563';
                a.style.color = '#08203a';
                a.style.borderRadius = '4px';
                a.style.fontWeight = '700';
                const pct = label === 'All' ? 1 : (parseInt(label,10) / 100);
                a.addEventListener('click', () => {
                    const inFleetTd = disTd.nextElementSibling;
                    if (!inFleetTd) return;
                    const raw = (inFleetTd.textContent || '').replace(/[^0-9,.-]/g,'').replace(/,/g,'').trim();
                    let n = parseInt(raw,10);
                    if (isNaN(n) || n < 0) n = 0;
                    const val = pct === 1 ? n : Math.floor(n * pct);
                    disInput.value = val;
                    disInput.dispatchEvent(new Event('input', { bubbles: true }));
                    disInput.dispatchEvent(new Event('change', { bubbles: true }));
                });
                td.appendChild(a);
                frag.appendChild(td);
            });
            row.insertBefore(frag, disTd);
            disTd.dataset.gccQuickCellsAdded = '1';
        });
    });
}

function addSimulationsLinks() {
    const container = document.querySelector('.icon-bar2');
    if (!container) return;
    if (document.getElementById('gcc-sim-links')) return;

    const wrapper = document.createElement('div');
    wrapper.id = 'gcc-sim-links';
    wrapper.style.display = 'flex';
    wrapper.style.flexWrap = 'wrap';
    wrapper.style.alignItems = 'center';
    wrapper.style.gap = '8px';
    wrapper.style.marginTop = '12px';
    wrapper.style.paddingTop = '10px';
    wrapper.style.borderTop = '1px solid var(--border)';

    const title = document.createElement('span');
    title.textContent = 'Simulations';
    title.style.color = 'var(--accent)';
    title.style.fontFamily = "'IBM Plex Mono', ui-monospace, 'SF Mono', Consolas, monospace";
    title.style.fontWeight = 'bold';
    title.style.lineHeight = '1.2';
    wrapper.appendChild(title);

    const links = [
        { text: 'Battle Sim', href: 'https://augury.drlat.dev/sim' },
        { text: 'Eco Sim', href: 'https://augury.drlat.dev/eco' }
    ];

    links.forEach(linkData => {
        const a = document.createElement('a');
        a.href = linkData.href;
        a.target = '_blank';
        a.rel = 'noreferrer noopener';
        a.textContent = linkData.text;
        a.style.color = 'var(--text-primary)';
        a.style.textDecoration = 'none';
        a.style.fontWeight = 'normal';
        a.style.lineHeight = '1.2';
        a.addEventListener('mouseenter', () => a.style.color = '#f2c57a');
        a.addEventListener('mouseleave', () => a.style.color = 'var(--text-primary)');
        wrapper.appendChild(a);
    });

    container.appendChild(wrapper);
}

function addShipBuilderBatchButtons() {
    if (!window.location.href.includes('f=com_ship')) return;
    const controlsList = Array.from(document.querySelectorAll('.gc-builder-card__controls'));
    if (!controlsList.length) return;

    controlsList.forEach(controls => {
        if (controls.dataset.gccBatchButtonsAdded) return;
        const orig = controls.querySelector('button.gc-builder-adjust.gc-builder-adjust--add');
        if (!orig) return;

        const input = controls.querySelector('input.gc-builder-input, input[type="number"], input[type="text"], input[type="tel"], input:not([type])');
        if (!input) return;

        const createBatchButton = (label, amount) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'gcc-builder-batch-button';
            btn.textContent = label;
            btn.setAttribute('aria-label', `Increase by ${label} turns`);
            btn.style.marginLeft = '4px';
            btn.style.minWidth = '32px';
            btn.style.padding = '0 8px';
            btn.style.height = orig.offsetHeight ? `${orig.offsetHeight}px` : '28px';
            btn.style.border = '1px solid rgba(255,255,255,0.14)';
            btn.style.borderRadius = '4px';
            btn.style.background = '#145A32';
            btn.style.color = '#FFFFFF';
            btn.style.cursor = 'pointer';
            btn.style.font = '11.8px Arial, Helvetica, sans-serif';
            btn.style.fontWeight = '700';
            btn.addEventListener('click', () => {
                const current = parseInt(input.value, 10);
                const value = Number.isNaN(current) ? 0 : current;
                const card = controls.closest('.gc-builder-card');
                let rate = 1;
                if (card && card.dataset.turnStep) {
                    const parsed = parseInt(card.dataset.turnStep, 10);
                    if (!Number.isNaN(parsed) && parsed > 0) rate = parsed;
                }
                input.value = value + amount * rate;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
            });
            return btn;
        };

        const plus5 = createBatchButton('+5', 5);
        const plus10 = createBatchButton('+10', 10);
        orig.insertAdjacentElement('afterend', plus5);
        plus5.insertAdjacentElement('afterend', plus10);
        controls.dataset.gccBatchButtonsAdded = '1';
    });
}

const shipStatCache = {};

function attachShipHoverTooltips() {
    const tooltip = createShipTooltip();

    const bindTooltip = (anchor) => {
        if (!anchor || anchor.__gccTooltipBound) return;
        anchor.__gccTooltipBound = true;

        const card = anchor.closest('.gc-builder-card');
        const shipHref = anchor.getAttribute('href');
        const detailUrl = shipHref ? new URL(shipHref, window.location.href).href : null;

        const showTooltip = (event, content) => {
            const body = tooltip.querySelector('#gcc-ship-tooltip-body');
            if (body) body.innerHTML = content;
            tooltip.style.display = 'block';
            positionShipTooltip(event, tooltip);
        };

        anchor.addEventListener('mouseenter', async (event) => {
            const fallback = buildShipTooltipHtml(extractShipStats(card));
            showTooltip(event, fallback || 'Loading ship stats...');

            if (!detailUrl) return;
            const stats = await loadShipStatsFromUrl(detailUrl);
            if (!stats || Object.keys(stats).length === 0) return;

            showTooltip(event, buildShipTooltipHtml(stats));
        });

        anchor.addEventListener('mousemove', (event) => {
            if (tooltip.style.display === 'block') positionShipTooltip(event, tooltip);
        });

        anchor.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });
    };

    const attachAll = () => {
        const anchors = Array.from(document.querySelectorAll('.gc-builder-card__titleline a'));
        anchors.forEach(bindTooltip);
    };

    attachAll();
    const observer = new MutationObserver(attachAll);
    observer.observe(document.body, { childList: true, subtree: true });
}

async function loadShipStatsFromUrl(url) {
    if (shipStatCache[url]) return shipStatCache[url];

    try {
        const response = await fetch(url, { credentials: 'same-origin' });
        if (!response.ok) return null;
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const stats = extractShipStatsFromDetailDoc(doc);
        shipStatCache[url] = stats;
        return stats;
    } catch (e) {
        return null;
    }
}

function createLabelMap() {
    const map = shipStatLabels.reduce((labelMap, label) => {
        labelMap[label.toLowerCase()] = label;
        return labelMap;
    }, {});

    const synonyms = {
        'pwr': 'Power rating',
        'power': 'Power rating',
        'power rating': 'Power rating',
        'scanner': 'Scanner rating',
        'scanner rating': 'Scanner rating',
        'weapon': 'Weapon',
        'energy damage': 'Energy Damage',
        'kinetic damage': 'Kinetic Damage',
        'missile damage': 'Missile Damage',
        'chemical damage': 'Chemical Damage',
        'hull': 'Hull',
        'range': 'Range',
        'absorption shield': 'Absorption Shield',
        'ecm': 'ECM',
        'ionized hull': 'Ionized Hull',
        'energy shield': 'Energy Shield'
    };

    Object.entries(synonyms).forEach(([key, canonical]) => {
        map[key] = canonical;
    });

    return map;
}

function extractShipStatsFromDetailDoc(doc) {
    if (!doc || !doc.body) return null;
    const stats = {};
    const labelMap = createLabelMap();

    const textContent = (doc.body.textContent || '').replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();
    shipStatLabels.forEach(label => {
        const regex = new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*[:\-]?\\s*([+\d.,%]+)', 'i');
        const match = textContent.match(regex);
        if (match) stats[label] = match[1].trim();
    });

    const rows = Array.from(doc.querySelectorAll('tr'));
    rows.forEach(row => {
        const cells = Array.from(row.querySelectorAll('td,th'));
        if (cells.length < 2) return;
        const rawLabel = cells[0].textContent.trim().replace(/[:\s]+$/, '');
        const rawValue = cells[1].textContent.trim();
        const normalized = rawLabel.replace(/\s+/g, ' ').toLowerCase();
        if (labelMap[normalized]) stats[labelMap[normalized]] = rawValue;
    });

    const auxTables = Array.from(doc.querySelectorAll('table.gc-ship-aux-table'));
    auxTables.forEach(table => {
        try {
            const headerTd = table.querySelector('tr.Header td');
            const headerText = headerTd ? (headerTd.textContent || '').trim().toLowerCase() : '';
            if (/ship specials?/.test(headerText)) {
                const specials = [];
                Array.from(table.querySelectorAll('tr')).forEach(tr => {
                    if (tr.classList && /header/i.test(tr.className)) return;
                    const tds = Array.from(tr.querySelectorAll('td'));
                    if (tds.length === 0) return;
                    const text = tds.map(td => (td.textContent || '').trim()).join(' ').replace(/\s+/g, ' ').trim();
                    if (text) specials.push(text);
                });
                if (specials.length) stats['Ship Specials'] = specials;
            } else if (/defense modifier/.test(headerText)) {
                Array.from(table.querySelectorAll('tr')).forEach(tr => {
                    if (tr.classList && /header/i.test(tr.className)) return;
                    const tds = Array.from(tr.querySelectorAll('td'));
                    if (tds.length < 2) return;
                    const rawLabel = (tds[0].textContent || '').trim().replace(/[:\s]+$/, '');
                    const rawValue = (tds[1].textContent || '').trim();
                    const normalized = rawLabel.replace(/\s+/g, ' ').toLowerCase();
                    if (labelMap[normalized]) stats[labelMap[normalized]] = rawValue;
                });
            }
        } catch (e) {}
    });

    const dtElements = Array.from(doc.querySelectorAll('dt'));
    dtElements.forEach(dt => {
        const dd = dt.nextElementSibling;
        if (!dd || dd.tagName !== 'DD') return;
        const rawLabel = dt.textContent.trim().replace(/[:\s]+$/, '');
        const rawValue = dd.textContent.trim();
        const normalized = rawLabel.replace(/\s+/g, ' ').toLowerCase();
        if (labelMap[normalized]) stats[labelMap[normalized]] = rawValue;
    });

    if (!stats['Ship Specials']) {
        const specials = [];
        const possibleHeaders = Array.from(doc.querySelectorAll('h1,h2,h3,h4,h5,legend,th,div,span'));
        possibleHeaders.forEach(h => {
            try {
                if (!h.textContent) return;
                if (/ship specials?/i.test(h.textContent)) {
                    let node = h.nextElementSibling;
                    let guard = 0;
                    while (node && guard < 30) {
                        const t = (node.textContent || '').trim();
                        if (t) {
                            t.split(/\n+/).map(s => s.trim()).forEach(s => { if (s) specials.push(s); });
                        }
                        if (/^H[1-6]$/i.test(node.tagName)) break;
                        node = node.nextElementSibling;
                        guard++;
                    }
                    const parent = h.parentElement;
                    if (specials.length === 0 && parent) {
                        parent.querySelectorAll && parent.querySelectorAll('p,li,dd').forEach(el => {
                            const t = (el.textContent || '').trim();
                            if (t) specials.push(t);
                        });
                    }
                }
            } catch (e) {}
        });
        if (specials.length) stats['Ship Specials'] = specials;
    }

    return stats;
}

function createShipTooltip() {
    let tooltip = document.getElementById('gcc-ship-tooltip');
    if (tooltip) return tooltip;

    tooltip = document.createElement('div');
    tooltip.id = 'gcc-ship-tooltip';
    tooltip.style.cssText = "position:fixed; z-index:100000; pointer-events:none; display:none; max-width:320px; background:var(--bg-overlay); border:1px solid var(--border); border-radius:12px; box-shadow:var(--shadow-lg); padding:12px 14px; color:var(--text-primary); font-size:13px; line-height:1.5; white-space:normal; font-family: Arial, sans-serif;";
    tooltip.innerHTML = '<style id="gcc-ship-tooltip-style">.gcc-tooltip-header{font-size:13px;font-weight:800;color:var(--accent);margin:12px 0 6px;padding:6px 8px;background:rgba(232,181,99,0.08);border:1px solid rgba(232,181,99,0.18);border-radius:6px;text-transform:uppercase;letter-spacing:0.1em;}.gcc-tooltip-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:4px 0;color:var(--text-primary);border-bottom:1px solid rgba(147,169,222,0.12);}.gcc-tooltip-row:last-child{border-bottom:none;}.gcc-tooltip-label{flex:1;color:var(--text-primary);opacity:0.95;}.gcc-tooltip-value{margin-left:8px;font-weight:700;color:var(--text-primary);white-space:nowrap;}.gcc-tooltip-section{margin-bottom:10px;}.gcc-tooltip-section:first-child{margin-top:4px;}</style><div id="gcc-ship-tooltip-body" class="gcc-ship-tooltip-body"></div>';
    document.body.appendChild(tooltip);
    return tooltip;
}

const shipStatLabels = [
    'Weapon',
    'Energy Damage',
    'Kinetic Damage',
    'Missile Damage',
    'Chemical Damage',
    'Hull',
    'Range',
    'Scanner rating',
    'Power rating',
    'Energy Shield',
    'Absorption Shield',
    'ECM',
    'Ionized Hull'
];

function extractShipStats(container) {
    if (!container) return null;
    const stats = {};
    const getContainer = (el) => {
        if (!el) return null;
        if (el.closest) {
            return el.closest('.gc-builder-card') || el.closest('.ship-row') || el.closest('tr') || el.closest('.fleet-card') || el.closest('table') || el;
        }
        return el;
    };

    container = getContainer(container);
    if (!container) return null;

    const labelMap = createLabelMap();

    const extractFromText = (text) => {
        const cleaned = text.replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();
        for (const label of shipStatLabels) {
            const regex = new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*[:\-]?\\s*([+\d.,%]+)', 'i');
            const match = cleaned.match(regex);
            if (match) {
                stats[label] = match[1].trim();
            }
        }
        const fallbackRegex = /(?:Pwr|Power)\s*[:\-]?\s*([+\d.,%]+)/i;
        const fallbackMatch = cleaned.match(fallbackRegex);
        if (fallbackMatch && !stats['Power rating']) stats['Power rating'] = fallbackMatch[1].trim();
    };

    const gatherElements = (root) => {
        const elements = new Set();
        if (!root) return elements;
        if (root.tagName === 'TR') {
            elements.add(root);
            if (root.previousElementSibling) elements.add(root.previousElementSibling);
            if (root.nextElementSibling) elements.add(root.nextElementSibling);
            if (root.parentElement) elements.add(root.parentElement);
        }
        if (root.tagName === 'TD' || root.tagName === 'TH') {
            const row = root.closest('tr');
            if (row) elements.add(row);
        }
        if (root.tagName === 'TABLE' && root.querySelectorAll) {
            root.querySelectorAll('tr').forEach(r => elements.add(r));
        }
        root.querySelectorAll && root.querySelectorAll('div,span,td,th,li,p,dd,dt').forEach(el => elements.add(el));
        return elements;
    };

    const elements = gatherElements(container);
    elements.forEach(el => {
        const text = (el.textContent || '').trim();
        if (!text) return;
        extractFromText(text);

        const children = Array.from(el.children || []);
        if (children.length === 2) {
            const label = children[0].textContent.trim().replace(/[:\s]+$/,'');
            const value = children[1].textContent.trim();
            if (label && value) {
                const normalized = label.toLowerCase();
                if (labelMap[normalized]) stats[labelMap[normalized]] = value;
            }
        }
    });

    const rows = Array.from(container.querySelectorAll('tr'));
    rows.forEach(row => {
        const cells = Array.from(row.querySelectorAll('td,th'));
        if (cells.length >= 2) {
            const label = cells[0].textContent.trim().replace(/[:\s]+$/,'');
            const value = cells[1].textContent.trim();
            const normalized = label.toLowerCase();
            if (labelMap[normalized]) stats[labelMap[normalized]] = value;
        }
    });

    return stats;
}

function buildShipTooltipHtml(stats) {
    const weaponKeys = ['Weapon', 'Energy Damage', 'Kinetic Damage', 'Missile Damage', 'Chemical Damage'];
    const defenseKeys = ['Energy Shield', 'Absorption Shield', 'ECM', 'Ionized Hull'];
    const otherKeys = ['Hull', 'Range', 'Scanner rating', 'Power rating'];

    const buildSection = (title, keys) => {
        const rows = keys.filter(key => stats[key]).map(key => {
            const val = stats[key];
            let valueHtml = `<span class=\"gcc-tooltip-value\">${val}</span>`;
            if (['Absorption Shield','ECM','Ionized Hull','Energy Shield'].includes(key)) {
                const negative = /-\s*\d/.test(val);
                const positive = /\+\s*\d/.test(val);
                const color = negative ? '#ff6b6b' : (positive ? '#7fe08a' : '#f1eee8');
                valueHtml = `<span class=\"gcc-tooltip-value\" style=\"color:${color}\">${val}</span>`;
            }
            return `<div class="gcc-tooltip-row"><span class="gcc-tooltip-label">${key}</span>${valueHtml}</div>`;
        });
        if (!rows.length) return '';
        return `<div class="gcc-tooltip-section"><div class="gcc-tooltip-header">${title}</div>${rows.join('')}</div>`;
    };

    let html = '';
    html += buildSection('Weapon', weaponKeys);
    html += buildSection('Defense Mods', defenseKeys);
    html += buildSection('Other Stats', otherKeys);

    if (stats['Ship Specials'] && Array.isArray(stats['Ship Specials']) && stats['Ship Specials'].length) {
        const specialsHtml = stats['Ship Specials'].map(s => `<div class="gcc-tooltip-row"><span class="gcc-tooltip-label">${s}</span></div>`).join('');
        html += `<div class="gcc-tooltip-section"><div class="gcc-tooltip-header">Ship Specials</div>${specialsHtml}</div>`;
    }

    if (!html) {
        html = '<div class="gcc-tooltip-row"><span class="gcc-tooltip-label">No stats available</span></div>';
    }

    return html;
}

function positionShipTooltip(event, tooltip) {
    const offset = 16;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const rect = tooltip.getBoundingClientRect();
    let left = event.clientX + offset;
    let top = event.clientY + offset;

    if (left + rect.width + 8 > viewportWidth) left = Math.max(8, event.clientX - rect.width - offset);
    if (top + rect.height + 8 > viewportHeight) top = Math.max(8, event.clientY - rect.height - offset);

    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
}

function ensureDisbandStyles() {
    if (document.getElementById('gcc-disband-buttons-style')) return;
    const s = document.createElement('style');
    s.id = 'gcc-disband-buttons-style';
    s.textContent = `
    .gcc-disband-buttons { display: inline-flex !important; gap: 6px !important; margin-left: 6px !important; align-items: center !important; }
    .gcc-disband-buttons button { background: var(--accent) !important; border: none !important; color: var(--text-inverse) !important; padding: 4px 8px !important; border-radius: 4px !important; cursor: pointer !important; font-size: 12px !important; font-weight: 700 !important; min-width: 34px !important; line-height: 1 !important; }
    .gcc-disband-buttons button:hover { background: var(--accent-hover) !important; }
    `;
    document.head.appendChild(s);
}

function addAssimilateButtons(sid) {
    const table = document.querySelector('table.gc-colony-list-table');
    if (!table) return;

    const headerRow = table.querySelector('thead tr.Header');
    if (headerRow && !headerRow.querySelector('.gcc-assim-header')) {
        const th = document.createElement('td');
        th.className = 'gcc-assim-header';
        th.textContent = 'Assimilate';
        th.style.cssText = 'font-weight:bold; white-space:nowrap;';
        headerRow.appendChild(th);
    }

    const rows = Array.from(table.querySelectorAll('tbody tr'));
    rows.forEach(row => {
        if (row.dataset.gccAssimAdded) return;

        const anchor = row.querySelector('td a[href*="f=com_col&colid="]');
        if (!anchor) return;

        const match = anchor.getAttribute('href').match(/colid=(\d+)/);
        if (!match) return;
        const cid = match[1];

        const td = document.createElement('td');
        td.style.textAlign = 'center';

        const btn = document.createElement('button');
        btn.textContent = '✔';
        btn.style.cssText = 'background:#c0392b; color:white; border:none; padding:4px 10px; border-radius:4px; cursor:pointer; font-size:11px; font-weight:700;';
        btn.addEventListener('mouseenter', () => btn.style.background = '#e74c3c');
        btn.addEventListener('mouseleave', () => btn.style.background = '#c0392b');

        btn.addEventListener('click', () => {
            if (!sid) return alert('SID not found. Click Cmd to sync first.');
            window.location.href = `i.cfm?&${sid}&f=com_change&cid=${cid}&co=1`;
        });

        td.appendChild(btn);
        row.appendChild(td);
        row.dataset.gccAssimAdded = '1';
    });
}

function addInfectButtons(sid) {
    const table = document.querySelector('table.gc-colony-list-table');
    if (!table) return;

    const headerRow = table.querySelector('thead tr.Header');
    if (headerRow && !headerRow.querySelector('.gcc-infect-header')) {
        const th = document.createElement('td');
        th.className = 'gcc-infect-header';
        th.textContent = 'Infect';
        th.style.cssText = 'font-weight:bold; white-space:nowrap;';
        headerRow.appendChild(th);
    }

    const rows = Array.from(table.querySelectorAll('tbody tr'));
    rows.forEach(row => {
        if (row.dataset.gccInfectAdded) return;

        const anchor = row.querySelector('td a[href*="f=com_col&colid="]');
        if (!anchor) return;

        const match = anchor.getAttribute('href').match(/colid=(\d+)/);
        if (!match) return;
        const cid = match[1];

        const td = document.createElement('td');
        td.style.textAlign = 'center';

        const btn = document.createElement('button');
        btn.textContent = '✔';
        btn.style.cssText = 'background:#c0392b; color:white; border:none; padding:4px 10px; border-radius:4px; cursor:pointer; font-size:11px; font-weight:700;';
        btn.addEventListener('mouseenter', () => btn.style.background = '#e74c3c');
        btn.addEventListener('mouseleave', () => btn.style.background = '#c0392b');

        btn.addEventListener('click', () => {
            if (!sid) return alert('SID not found. Click Cmd to sync first.');
            window.location.href = `i.cfm?&${sid}&f=com_change&cid=${cid}&co=1`;
        });

        td.appendChild(btn);
        row.appendChild(td);
        row.dataset.gccInfectAdded = '1';
    });
}