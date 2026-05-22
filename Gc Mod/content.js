/** * GC Helper Tool - Final Polished Version with Auto-Explore & Global Clustering
 */

// === 1. AUTO-EXPLORE FEATURE ===
// Instantly runs as soon as the script injects to catch the button immediately
(function autoExplore() {
    // Looks for the button via its onclick attribute containing 'com_explore'
    const exploreBtn = document.querySelector('input[type="button"][onclick*="com_explore"]');
    if (exploreBtn) {
        exploreBtn.click();
    }
})();

// === 2. MAIN EXTENSION PANEL LOGIC ===
chrome.storage.local.get(['panelPos', 'presets', 'storedSid'], (res) => {
    const pos = res.panelPos || { top: '20px', left: 'auto', right: '20px' };
    const savedPresets = res.presets || {};
    
    const sidMatch = document.documentElement.innerHTML.match(/&(\d+)&/) || window.location.href.match(/&(\d+)&/);
    const sid = sidMatch ? sidMatch[1] : res.storedSid;
    if (sid) chrome.storage.local.set({ storedSid: sid });

    const container = document.createElement('div');
    container.id = 'gcc-preset-panel';
    container.style.cssText = `position:fixed; top:${pos.top}; left:${pos.left}; right:${pos.right}; width:190px; background:#1a1a1a; border:2px solid #444; z-index:99999; border-radius:8px; overflow:hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); font-family: sans-serif; color: white;`;
    
    container.innerHTML = `
        <div id="gcc-handle" style="background:#333; padding:8px; cursor:move; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #444; user-select:none;">
            <span style="font-size:11px; font-weight:bold; margin-left:5px; color:#ddd;">⠿ HELPER</span>
            <button id="gcc-refresh-btn" title="Refresh Page" style="background:#444; border:1px solid #555; color:white; cursor:pointer; border-radius:3px; padding:2px 6px; font-size:12px; line-height:1;">↻</button>
        </div>
        
        <div style="padding:8px; border-bottom:1px solid #333;">
            <div style="font-size:10px; color:#aaa; margin-bottom:5px; font-weight:bold; letter-spacing:0.5px;">SHIP PRESETS</div>
            <div id="gcc-btn-area" style="display:flex; justify-content:space-between; gap:2px;"></div>
        </div>

        <div style="padding:8px; background:#222; border-bottom:1px solid #333;">
            <div style="font-size:10px; color:#ff9800; margin-bottom:5px; font-weight:bold; letter-spacing:0.5px;">COLONY CLUSTER</div>
            <div style="display:flex; flex-direction:column; gap:4px;">
                <button class="gcc-global-cluster" data-tid="20" style="background:#444; color:white; border:none; font-size:10px; padding:6px; cursor:pointer; border-radius:3px; text-align:left;">⏫ Upgrade Lvl 1</button>
                <button class="gcc-global-cluster" data-tid="21" style="background:#444; color:white; border:none; font-size:10px; padding:6px; cursor:pointer; border-radius:3px; text-align:left;">⏫ Upgrade Lvl 2</button>
                <button class="gcc-global-cluster" data-tid="22" style="background:#444; color:white; border:none; font-size:10px; padding:6px; cursor:pointer; border-radius:3px; text-align:left;">⏫ Upgrade Lvl 3</button>
            </div>
            <div id="gcc-cluster-status" style="font-size:9px; color:#888; text-align:center; margin-top:4px; height:10px;"></div>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1px; background:#444; border-top:1px solid #444;">
            <a href="i.cfm?f=com_empire&cm=3" id="lnk-cmd" class="gcc-footer-link">Cmd</a>
            <a href="i.cfm?f=com_ship" id="lnk-build" class="gcc-footer-link">Build</a>
            <a href="i.cfm?f=com_disband" id="lnk-manage" class="gcc-footer-link">Fleet</a>
            <a href="i.cfm?f=rank" id="lnk-rank" class="gcc-footer-link">Rank</a>
        </div>

        <style>
            .gcc-footer-link { background: #111; color: #9edcfe; font-size: 10px; text-decoration: none; padding: 8px 0; text-align: center; font-weight: bold; transition: background 0.2s; }
            .gcc-footer-link:hover { background: #222; color: #fff; }
        </style>
    `;
    document.body.appendChild(container);
    setupLogic(container, savedPresets, sid);
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

function setupLogic(container, presets, sid) {
    document.getElementById('gcc-refresh-btn').onclick = () => window.location.reload();

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
        btn.style.cssText = `flex:1; padding:6px 0; cursor:pointer; border-radius:4px; border:1px solid #444; font-size:10px; background:${presets[i] ? "#2e7d32" : "#333"}; color:white; font-weight:bold;`;
        
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
            tooltip.innerHTML = content;
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

    const dtElements = Array.from(doc.querySelectorAll('dt'));
    dtElements.forEach(dt => {
        const dd = dt.nextElementSibling;
        if (!dd || dd.tagName !== 'DD') return;
        const rawLabel = dt.textContent.trim().replace(/[:\s]+$/, '');
        const rawValue = dd.textContent.trim();
        const normalized = rawLabel.replace(/\s+/g, ' ').toLowerCase();
        if (labelMap[normalized]) stats[labelMap[normalized]] = rawValue;
    });

    return stats;
}

function createShipTooltip() {
    let tooltip = document.getElementById('gcc-ship-tooltip');
    if (tooltip) return tooltip;

    tooltip = document.createElement('div');
    tooltip.id = 'gcc-ship-tooltip';
    tooltip.style.cssText = 'position:fixed; z-index:100000; pointer-events:none; display:none; max-width:320px; background:rgba(18,18,18,0.95); border:1px solid #555; border-radius:10px; box-shadow:0 14px 32px rgba(0,0,0,0.45); padding:12px 14px; color:#f5f5f5; font-size:12px; line-height:1.4; white-space:pre-wrap;';
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
    const defenseKeys = ['Absorption Shield', 'ECM', 'Ionized Hull'];
    const lines = [];

    ['Weapon', 'Energy Damage', 'Kinetic Damage', 'Missile Damage', 'Chemical Damage', 'Hull', 'Range', 'Scanner rating', 'Power rating'].forEach(key => {
        if (stats[key]) lines.push(`${key}\t${stats[key]}`);
    });

    const defenseLines = defenseKeys.filter(key => stats[key]).map(key => `${key}\t${stats[key]}`);
    if (defenseLines.length > 0) {
        lines.push('Defense Modifier');
        defenseLines.forEach(line => lines.push(line));
    }

    return lines.join('\n');
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