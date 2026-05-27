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
chrome.storage.local.get(['panelPos', 'presets', 'storedSid', 'assimEnabled', 'infectEnabled', 'clusterCollapsed', 'similareCollapsed', 'viralCollapsed', 'fedLazy', 'fedFull', 'clusterMineral'], (res) => {
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

        <div id="gcc-update-banner"></div>

        <div style="padding:8px; border-bottom:1px solid #333;">
            <div style="font-size:10px; color:#ff9800; margin-bottom:5px; font-weight:bold; letter-spacing:0.5px;">SHIP PRESETS</div>
            <div id="gcc-btn-area" style="display:flex; justify-content:space-between; gap:2px;"></div>
        </div>

        <div style="border-bottom:1px solid #333;">
            <div style="padding: 6px 8px 0; display: flex; flex-direction: column; gap: 2px;">
                <label style="font-size: 8px; color: #aaa; font-weight: bold; letter-spacing: 0.5px;">TARGET MINERAL</label>
                <select id="gcc-cluster-mineral" style="background: #1f2842; color: white; border: 1px solid #555; border-radius: 3px; font-size: 10px; padding: 3px; width: 100%; cursor: pointer;">
                    <option value="1">Terran Metal</option>
                    <option value="2" selected>Red Crystal</option>
                    <option value="3">White Crystal</option>
                    <option value="4">Rutile</option>
                    <option value="5">Composite</option>
                    <option value="6">Strafez Organism</option>
                </select>
            </div>
            
            <div id="gcc-reg-wrapper">
                <div id="gcc-cluster-header" style="padding:8px; background:#1f2842; cursor:pointer; display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
                    <div style="font-size:10px; color:#ff9800; font-weight:bold; letter-spacing:0.5px;">Regular Cluster</div>
                    <span id="gcc-cluster-arrow" style="font-size:10px; color:#aaa;">▾</span>
                </div>
                <div id="gcc-cluster-body" style="padding:0 8px 8px; background:#1f2842;">
                    <div style="display:flex; flex-direction:column; gap:4px; padding-top:6px;">
                        <button class="gcc-global-cluster" data-tid="20" style="background:#1f2842; color:white; border:1px solid #444; font-size:10px; padding:6px; cursor:pointer; border-radius:3px; text-align:left;">⏫ Upgrade Lvl 1</button>
                        <button class="gcc-global-cluster" data-tid="21" style="background:#1f2842; color:white; border:1px solid #444; font-size:10px; padding:6px; cursor:pointer; border-radius:3px; text-align:left;">⏫ Upgrade Lvl 2</button>
                        <button class="gcc-global-cluster" data-tid="22" style="background:#1f2842; color:white; border:1px solid #444; font-size:10px; padding:6px; cursor:pointer; border-radius:3px; text-align:left;">⏫ Upgrade Lvl 3</button>
                    </div>
                </div>
            </div>

            <div id="gcc-coll-wrapper">
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
            </div>

            <div id="gcc-viral-wrapper">
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

            <div id="gcc-cluster-status" style="font-size:9px; color:#888; text-align:center; margin-top:4px; height:10px; padding-bottom:4px;"></div>
        </div>

        <div style="border-bottom:1px solid #333;">
            <div id="gcc-features-header" style="padding:8px; background:#1f2842; cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
                <div style="font-size:10px; color:#ff9800; font-weight:bold; letter-spacing:0.5px;">FEATURES</div>
                <span id="gcc-features-arrow" style="font-size:10px; color:#aaa;">▾</span>
            </div>
            <div id="gcc-features-body" style="padding:0 8px 8px; background:#1f2842;">
                <div style="display:flex; flex-direction:column; gap:4px; padding-top:6px;">
                    <label style="display:flex; align-items:center; gap:6px; cursor:pointer; font-size:11px; color:#ddd; margin-bottom:4px;">
                        <input type="checkbox" id="gcc-assim-toggle" style="cursor:pointer;">
                        Assimilate Buttons
                    </label>
                    <label style="display:flex; align-items:center; gap:6px; cursor:pointer; font-size:11px; color:#ddd;">
                        <input type="checkbox" id="gcc-infect-toggle" style="cursor:pointer;">
                        Infect Buttons
                    </label>
                </div>
            </div>
        </div>

        <div style="border-bottom:1px solid #333;">
            <div id="gcc-fed-header" style="padding:8px; background:#1f2842; cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
                <div style="font-size:10px; color:#ff9800; font-weight:bold; letter-spacing:0.5px;">FEDERATION NAMES</div>
                <span id="gcc-fed-arrow" style="font-size:10px; color:#aaa;">▾</span>
            </div>
            <div id="gcc-fed-body" style="padding:0 8px 8px; background:#1f2842;">
                <div style="display:flex; flex-direction:column; gap:4px; padding-top:6px;">
                    <label style="display:flex; align-items:center; gap:6px; cursor:pointer; font-size:11px; color:#ddd; margin-bottom:4px;">
                        <input type="checkbox" id="gcc-fed-lazy" style="cursor:pointer;">
                        Lazy Load (hover)
                    </label>
                    <label style="display:flex; align-items:center; gap:6px; cursor:pointer; font-size:11px; color:#ddd;">
                        <input type="checkbox" id="gcc-fed-full" style="cursor:pointer;">
                        Full Load
                    </label>
                </div>
            </div>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1px; background:#444; border-top:1px solid #444;">
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

// Replace your old performGlobalCluster function with this one:
async function performGlobalCluster(tid, sid) {
    const status = document.getElementById('gcc-cluster-status');
    status.innerText = "⏳ Upgrading...";
    status.style.color = "#aaa";

    const url = `i.cfm?&${sid}&f=com_colupgrade&tid=${tid}&con=1`;

    // Grabs the current chosen value from our newly created element selection model
    const mineralSelect = document.getElementById('gcc-cluster-mineral');
    const selectedGoodId = mineralSelect ? mineralSelect.value : '2'; // Falls back to '2' if not found

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: new URLSearchParams({ 'goodid': selectedGoodId }) // Uses the selected value parameter
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
let counterCache = null;

// Helper to extract session variables out of active frame locations
function getGcSessionId(sid) {
    if (sid && sid.trim().length > 0) return sid;
    const match = window.location.href.match(/i\.cfm\?&?([\w\d\-=\+]+)&/);
    return match ? match[1] : '';
}

// Background silent fetch pointing directly to the f=rank2&ty=3 retal engine
async function fetchActiveCounters(sid) {
    if (counterCache !== null) return counterCache;
    try {
        const cleanSid = getGcSessionId(sid);
        // Direct GET fetch using the precise query location provided
        const url = cleanSid ? `i.cfm?&${cleanSid}&f=rank2&ty=3` : `i.cfm?f=rank2&ty=3`;
        
        console.log(`[GC Helper] Silently scanning retal matrix via: ${url}`);
        const response = await fetch(url, { credentials: 'same-origin' });
        if (!response.ok) { counterCache = []; return []; }
        
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const counterUids = [];
        
        // Find the specific data rows inside the retal document layout
        const rows = doc.querySelectorAll('tr.table_row1, tr.table_row2');
        
        rows.forEach(row => {
            // Find links that explicitly contain player profile (intel) or attack endpoints
            const playerLinks = row.querySelectorAll('a[href*="eid="], a[href*="uid="]');
            
            playerLinks.forEach(link => {
                const hrefStr = link.getAttribute('href') || '';
                
                // Isolates numbers preceded strictly by the player reference tokens
                const match = hrefStr.match(/[=?&](?:uid|eid|amp;uid|amp;eid)=(\d+)(?:&|$)/);
                if (match) {
                    const extractedId = match[1];
                    // Skip matching the session key
                    if (extractedId && extractedId !== cleanSid && !counterUids.includes(extractedId)) {
                        counterUids.push(extractedId);
                    }
                }
            });
        });

        console.log(`[GC Helper] Successfully isolated ${counterUids.length} genuine counter targets.`);
        counterCache = counterUids;
        return counterUids;
    } catch (e) {
        console.error("[GC Helper] Counter parser failure:", e);
        counterCache = [];
        return [];
    }
}

async function fetchWarFederations(sid) {
    if (warFedCache !== null) return warFedCache;
    try {
        const cleanSid = getGcSessionId(sid);
        const url = cleanSid ? `i.cfm?&${cleanSid}&f=fed_war` : `i.cfm?f=fed_war`;
        const response = await fetch(url, { credentials: 'same-origin' });
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

// Applies priorities correctly: Red Counter > Green Fed War > Default styling
function applyWarHighlight(row, fedName, warFeds, activeCounters) {
    const attackLink = row.querySelector('a[href*="f=com_attack"]');
    if (!attackLink) return;

    const uidMatch = attackLink.getAttribute('href').match(/[=?&](?:uid|eid)=(\d+)/);
    const uid = uidMatch ? uidMatch[1] : null;

    // PRIORITY 1: RED COUNTER HIGHLIGHT
    if (uid && activeCounters.includes(uid)) {
        attackLink.style.setProperty('color', '#ff3333', 'important'); 
        attackLink.style.setProperty('font-weight', 'bold', 'important');
        attackLink.title = "⚠️ CRITICAL: Active Counter-Attack Available!";
        return; 
    }

    // PRIORITY 2: GREEN FEDERATION WAR STATE
    if (fedName && fedName !== 'No Federation' && warFeds.length) {
        if (warFeds.includes(fedName.toLowerCase())) {
            attackLink.style.setProperty('color', '#4caf50', 'important');
            attackLink.style.setProperty('font-weight', 'bold', 'important');
            attackLink.title = "⚔️ Federation War Target";
            return;
        }
    }

    // RESET: Clear colors if user doesn't fit either target description
    if (!row.dataset.gccFedLazyBound && !row.dataset.gccFedFullDone) {
        attackLink.style.removeProperty('color');
        attackLink.style.removeProperty('font-weight');
        attackLink.title = "";
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

async function attachFedLazy(sid) {
    if (!window.location.href.includes('f=rank')) return;
    
    const activeCounters = await fetchActiveCounters(sid);

    const tables = document.querySelectorAll('table.rank-results-table, table.rank-page-table');
    if (!tables.length) return;

    const rows = Array.from(tables).flatMap(table =>
        Array.from(table.querySelectorAll('tr')).filter(r => !r.classList.contains('rank-results-header') && !r.classList.contains('Header'))
    );
    
    rows.forEach(row => {
        applyWarHighlight(row, null, [], activeCounters);

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
            try {
                const fedNameTask = typeof fetchFederationName === 'function' ? fetchFederationName(eid, sid) : Promise.resolve(null);
                const [name, warFeds] = await Promise.all([
                    fedNameTask,
                    fetchWarFederations(sid)
                ]);
                
                span.textContent = name || 'No Federation';
                span.dataset.loaded = '1';
                applyWarHighlight(row, name, warFeds, activeCounters);
            } catch(err) {
                span.textContent = 'Error';
            }
        });

        row.dataset.gccFedLazyBound = '1';
    });
}

async function attachFedFull(sid) {
    if (!window.location.href.includes('f=rank')) return;
    
    const activeCounters = await fetchActiveCounters(sid);

    const tables = document.querySelectorAll('table.rank-results-table, table.rank-page-table');
    if (!tables.length) return;

    const rows = Array.from(tables).flatMap(table =>
        Array.from(table.querySelectorAll('tr')).filter(r => !r.classList.contains('rank-results-header') && !r.classList.contains('Header'))
    );

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
        try {
            const fedNameTask = typeof fetchFederationName === 'function' ? fetchFederationName(eid, sid) : Promise.resolve(null);
            const [name, warFeds] = await Promise.all([
                fedNameTask,
                fetchWarFederations(sid)
            ]);
            span.textContent = name || 'No Federation';
            span.dataset.loaded = '1';
            applyWarHighlight(row, name, warFeds, activeCounters);
            row.dataset.gccFedFullDone = '1';
        } catch(err) {
            span.textContent = 'Error';
        }
    });

    await Promise.all(tasks);
}

function removeFedNames() {
    document.querySelectorAll('.gcc-fed-name').forEach(el => el.remove());
    document.querySelectorAll('[data-gcc-fed-lazy-bound]').forEach(el => delete el.dataset.gccFedLazyBound);
    document.querySelectorAll('[data-gcc-fed-full-done]').forEach(el => delete el.dataset.gccFedFullDone);
}

function setupLogic(container, presets, sid, assimEnabled, infectEnabled, clusterCollapsed, similareCollapsed, viralCollapsed, fedLazy, fedFull) {
    document.getElementById('gcc-refresh-btn').onclick = () => window.location.reload();

    // Trigger the update check automatically
    checkForUpdates();

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

    // === 11. Core Helper Section HTML Visibility & Persistent Collapse Controls ===
    
    // 1. Controls total removal from HTML layout via your Dashboard switches
    const applyVisibility = (wrapperId, isHiddenFromDashboard) => {
        const wrapper = document.getElementById(wrapperId);
        if (wrapper) {
            wrapper.style.display = isHiddenFromDashboard ? 'none' : 'block';
        }
    };

    applyVisibility('gcc-reg-wrapper', clusterCollapsed);
    applyVisibility('gcc-coll-wrapper', similareCollapsed);
    applyVisibility('gcc-viral-wrapper', viralCollapsed);

    // 2. Controls internal slide drawers for remaining panels
    const applyCollapse = (bodyId, arrowId, isCollapsed) => {
        const body = document.getElementById(bodyId);
        const arrow = document.getElementById(arrowId);
        if (!body || !arrow) return;
        body.style.display = isCollapsed ? 'none' : 'block';
        arrow.textContent = isCollapsed ? '▸' : '▾';
    };

    // Pull saved collapse memory for ALL sections, defaulting to false (open) if not set yet
    chrome.storage.local.get([
        'regManualCollapsed', 
        'collManualCollapsed', 
        'viralManualCollapsed', 
        'featuresCollapsed', 
        'fedCollapsed'
    ], (result) => {
        let regInner = result.regManualCollapsed || false;
        let collInner = result.collManualCollapsed || false;
        let viralInner = result.viralManualCollapsed || false;
        let featuresCollapsed = result.featuresCollapsed || false;
        let fedCollapsed = result.fedCollapsed || false;

        // Apply saved visibility configurations immediately on load
        applyCollapse('gcc-cluster-body', 'gcc-cluster-arrow', regInner);
        applyCollapse('gcc-similare-body', 'gcc-similare-arrow', collInner);
        applyCollapse('gcc-viral-body', 'gcc-viral-arrow', viralInner);
        applyCollapse('gcc-features-body', 'gcc-features-arrow', featuresCollapsed);
        applyCollapse('gcc-fed-body', 'gcc-fed-arrow', fedCollapsed);

        // Click triggers for Regular Cluster (Saves state)
        document.getElementById('gcc-cluster-header').onclick = () => { 
            regInner = !regInner; 
            applyCollapse('gcc-cluster-body', 'gcc-cluster-arrow', regInner); 
            chrome.storage.local.set({ regManualCollapsed: regInner });
        };

        // Click triggers for Collective Cluster (Saves state)
        document.getElementById('gcc-similare-header').onclick = () => { 
            collInner = !collInner; 
            applyCollapse('gcc-similare-body', 'gcc-similare-arrow', collInner); 
            chrome.storage.local.set({ collManualCollapsed: collInner });
        };

        // Click triggers for Viral Cluster (Saves state)
        document.getElementById('gcc-viral-header').onclick = () => { 
            viralInner = !viralInner; 
            applyCollapse('gcc-viral-body', 'gcc-viral-arrow', viralInner); 
            chrome.storage.local.set({ viralManualCollapsed: viralInner });
        };

        // Click triggers for Features panel (Saves state)
        document.getElementById('gcc-features-header').onclick = () => { 
            featuresCollapsed = !featuresCollapsed; 
            applyCollapse('gcc-features-body', 'gcc-features-arrow', featuresCollapsed); 
            chrome.storage.local.set({ featuresCollapsed });
        };

        // Click triggers for Federation Names panel (Saves state)
        document.getElementById('gcc-fed-header').onclick = () => { 
            fedCollapsed = !fedCollapsed; 
            applyCollapse('gcc-fed-body', 'gcc-fed-arrow', fedCollapsed); 
            chrome.storage.local.set({ fedCollapsed });
        };
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

    const mineralSelect = document.getElementById('gcc-cluster-mineral');
    if (mineralSelect) {
        // If a saved state exists in local storage, initialize it
        chrome.storage.local.get(['clusterMineral'], (stored) => {
            if (stored.clusterMineral) mineralSelect.value = stored.clusterMineral;
        });

        // Save configuration settings dynamically when clicked
        mineralSelect.addEventListener('change', () => {
            chrome.storage.local.set({ clusterMineral: mineralSelect.value });
        });
    }
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

async function checkForUpdates() {
    const banner = document.getElementById('gcc-update-banner');
    if (!banner) return;

    // 1. Define your GitHub target details
    const repoOwner = "Jasper89c"; 
    const repoName = "Jaspers-GC-Mods";
    const githubLink = `https://github.com/${repoOwner}/${repoName}/releases`;

    // 2. Extract current installed version safely from manifest context
    const currentVersion = chrome.runtime.getManifest().version;

    try {
        // Fetch latest version string from GitHub Releases API
        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/releases/latest`);
        if (!response.ok) return;

        const data = await response.json();
        // GitHub tags are usually prefixed with a "v" (e.g., "v1.1" or "1.1")
        const latestVersion = data.tag_name.replace(/v/gi, '').trim();

        // simple check to see if GitHub version is greater than installed version
        if (latestVersion !== currentVersion && currentVersion < latestVersion) {
            banner.innerHTML = `
                <div style="background: #ff9800; color: #000; font-size: 10px; font-weight: bold; text-align: center; padding: 6px; border-bottom: 1px solid #444; animation: pulse 2s infinite;">
                    ⚠️ New Version Available (v${latestVersion})<br>
                    <a href="${githubLink}" target="_blank" style="color: #004d40; text-decoration: underline; display: inline-block; margin-top: 3px;">Click here to download</a>
                </div>
                <style>
                    @keyframes pulse {
                        0% { opacity: 0.9; }
                        50% { opacity: 1; }
                        100% { opacity: 0.9; }
                    }
                </style>
            `;
        }
    } catch (e) {
        console.log("GC Mods Update Check Failed: ", e);
    }
}

// Global memory hook tracking the session string identity
function getGcSessionId() {
    const match = window.location.href.match(/i\.cfm\?&?([\w\d\-=\+]+)&/);
    return match ? match[1] : '';
}

let currentChatTab = 'public';
let isSubmitting = false;

function getGcSessionId() {
    let href = window.location.href;
    if (window.top && window.top.location) {
        href = window.top.location.href;
    }
    const match = href.match(/i\.cfm\?&?([\w\d\-=\+]+)&/);
    return match ? match[1] : '';
}

// Updated Public feed syncing engine to display newest messages at the bottom
async function updatePublicFeed(container) {
    if (!container || isSubmitting) return;
    let targetDoc = document;
    
    const nativeFeed = document.querySelector('.gc-sidechat__feed');
    if (!nativeFeed) {
        try {
            const sid = getGcSessionId();
            const url = sid ? `i.cfm?&${sid}&f=com` : `i.cfm?f=com`;
            const res = await fetch(url, { credentials: 'same-origin' });
            if (res.ok) {
                const html = await res.text();
                targetDoc = new DOMParser().parseFromString(html, 'text/html');
            }
        } catch (e) {
            return;
        }
    }

    const lines = targetDoc.querySelectorAll('.gc-sidechat__entry');
    if (lines.length > 0) {
        container.innerHTML = '';
        
        // Array.from().reverse() forces the oldest messages up top 
        // and pushes the shiny new ones right to the bottom!
        Array.from(lines).reverse().forEach(line => {
            const nameEl = line.querySelector('.gc-sidechat__name');
            const textEl = line.querySelector('.gc-sidechat__text');
            if (nameEl && textEl) {
                const row = document.createElement('div');
                row.className = 'custom-chat-line';
                row.innerHTML = `<span class="custom-chat-username">${nameEl.textContent}</span><span class="custom-chat-body-text">${textEl.textContent}</span>`;
                container.appendChild(row);
            }
        });
        
        // Instantly snap the scroll container downwards so the latest updates are in view
        container.scrollTop = container.scrollHeight;
    }
}
// Fed forum syncing engine
async function refreshFedFeedFromServer(container) {
    if (!container || isSubmitting) return;
    try {
        const sid = getGcSessionId();
        const url = sid ? `i.cfm?&${sid}&f=fed_forum` : `i.cfm?f=fed_forum`;
        const res = await fetch(url, { credentials: 'same-origin' });
        if (!res.ok) return;

        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const rows = doc.querySelectorAll('table.Default tr[valign="top"]');
        container.innerHTML = '';

        if (rows.length === 0) {
            container.innerHTML = '<div style="color:gray;text-align:center;margin-top:20px;">No federation messages found.</div>';
            return;
        }

        Array.from(rows).reverse().forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 2) {
                const username = cells[0].childNodes[0].textContent.trim();
                const fontEl = cells[0].querySelector('font');
                const timestamp = fontEl ? fontEl.innerHTML.replace('<br>', ' ') : '';

                let bodyHtml = cells[1].innerHTML.trim();
                bodyHtml = bodyHtml.replace(/(?:<br\s*\/?>\s*)+Colony Name/gi, '<span class="custom-fed-break-block">Colony Name');
                if (bodyHtml.includes('custom-fed-break-block')) bodyHtml += '</span>';

                const chatLine = document.createElement('div');
                chatLine.className = 'custom-chat-line';
                chatLine.innerHTML = `
                    <div>
                        <span class="custom-chat-username">${username}</span>
                        <span class="custom-chat-timestamp">${timestamp}</span>
                    </div>
                    <div class="custom-chat-body-text" style="margin-top:2px;">${bodyHtml}</div>
                `;
                container.appendChild(chatLine);
            }
        });

        container.scrollTop = container.scrollHeight;
    } catch(e) {
        console.error(e);
    }
}

// Render interface safely
function renderEmbeddedBottomChat() {
    if (document.querySelector('.custom-bottom-chat-panel')) return;
    if (!document.body) return;

    // Soft hide legacy element if present
    const oldBar = document.getElementById('SBar');
    if (oldBar) oldBar.style.display = 'none';

    const chatPanel = document.createElement('div');
    chatPanel.className = 'custom-bottom-chat-panel';

    const tabHeader = document.createElement('div');
    tabHeader.className = 'custom-chat-tabs-header';

    const publicTabBtn = document.createElement('button');
    publicTabBtn.className = `custom-chat-tab-button ${currentChatTab === 'public' ? 'active' : ''}`;
    publicTabBtn.textContent = 'Public Chat';

    const fedTabBtn = document.createElement('button');
    fedTabBtn.className = `custom-chat-tab-button ${currentChatTab === 'fed' ? 'active' : ''}`;
    fedTabBtn.textContent = 'Federation Discussion';

    tabHeader.appendChild(publicTabBtn);
    tabHeader.appendChild(fedTabBtn);

    const publicFeedDisplay = document.createElement('div');
    publicFeedDisplay.className = `custom-chat-feed-container ${currentChatTab === 'public' ? 'active' : ''}`;

    const fedFeedDisplay = document.createElement('div');
    fedFeedDisplay.className = `custom-chat-feed-container ${currentChatTab === 'fed' ? 'active' : ''}`;

    const inputBar = document.createElement('div');
    inputBar.className = 'custom-chat-input-bar';

    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.className = 'custom-chat-text-field';
    textInput.placeholder = currentChatTab === 'public' ? 'Type public message...' : 'Type federation message...';
    textInput.maxLength = currentChatTab === 'public' ? 150 : 5000;

    const sendBtn = document.createElement('button');
    sendBtn.className = 'custom-chat-send-btn';
    sendBtn.textContent = 'Send';

    inputBar.appendChild(textInput);
    inputBar.appendChild(sendBtn);
    chatPanel.appendChild(tabHeader);
    chatPanel.appendChild(publicFeedDisplay);
    chatPanel.appendChild(fedFeedDisplay);
    chatPanel.appendChild(inputBar);
    
    document.body.appendChild(chatPanel);

    async function handlePostSubmission() {
        const messageText = textInput.value.trim();
        if (!messageText || isSubmitting) return;

        isSubmitting = true;
        textInput.disabled = true;
        sendBtn.disabled = true;
        const sid = getGcSessionId();

        try {
            if (currentChatTab === 'public') {
                const url = sid ? `i.cfm?&${sid}&popup=msgsector` : `i.cfm?popup=msgsector`;
                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `chat=${encodeURIComponent(messageText)}&remLen2=${150 - messageText.length}`,
                    credentials: 'same-origin'
                });
                if (res.ok) {
                    textInput.value = '';
                    await updatePublicFeed(publicFeedDisplay);
                }
            } else {
                const url = sid ? `i.cfm?&${sid}&f=fed_forum` : `i.cfm?f=fed_forum`;
                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `forum2=${encodeURIComponent(messageText)}&remLen2=${5000 - messageText.length}&submitflag=Post+Message`,
                    credentials: 'same-origin'
                });
                if (res.ok) {
                    textInput.value = '';
                    await refreshFedFeedFromServer(fedFeedDisplay);
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            isSubmitting = false;
            textInput.disabled = false;
            sendBtn.disabled = false;
            textInput.focus();
        }
    }

    publicTabBtn.addEventListener('click', () => {
        currentChatTab = 'public';
        fedTabBtn.classList.remove('active');
        publicTabBtn.classList.add('active');
        fedFeedDisplay.classList.remove('active');
        publicFeedDisplay.classList.add('active');
        textInput.placeholder = 'Type public message...';
        textInput.maxLength = 150;
        updatePublicFeed(publicFeedDisplay);
    });

    fedTabBtn.addEventListener('click', async () => {
        currentChatTab = 'fed';
        publicTabBtn.classList.remove('active');
        fedTabBtn.classList.add('active');
        publicFeedDisplay.classList.remove('active');
        fedFeedDisplay.classList.add('active');
        textInput.placeholder = 'Type federation message...';
        textInput.maxLength = 5000;
        fedFeedDisplay.innerHTML = '<div style="color:gray;text-align:center;margin-top:20px;">Loading Fed...</div>';
        await refreshFedFeedFromServer(fedFeedDisplay);
    });

    sendBtn.addEventListener('click', handlePostSubmission);
    textInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handlePostSubmission();
    });

    if (currentChatTab === 'public') updatePublicFeed(publicFeedDisplay);
    else refreshFedFeedFromServer(fedFeedDisplay);
}

// 1. Safe, light, non-breaking continuous content loop loader
setInterval(() => {
    // If a page transition completely wiped out our chat panel box, reconstruct it cleanly
    if (!document.querySelector('.custom-bottom-chat-panel')) {
        renderEmbeddedBottomChat();
    }
    
    // Refresh feed data silently inside the containers
    if (currentChatTab === 'public') {
        const publicBox = document.querySelector('.custom-bottom-chat-panel .custom-chat-feed-container.active');
        if (publicBox) updatePublicFeed(publicBox);
    } else {
        const fedBox = document.querySelector('.custom-bottom-chat-panel .custom-chat-feed-container.active');
        if (fedBox) refreshFedFeedFromServer(fedBox);
    }
}, 7000); // Ticks smoothly every 7 seconds without stressing the CPU or server

// Run instantly on first execution injection
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderEmbeddedBottomChat);
} else {
    renderEmbeddedBottomChat();
}