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

    // 6. Add disband quick-action cells
    try {
        addDisbandQuickCells();
        setTimeout(addDisbandQuickCells, 500);
        setTimeout(addDisbandQuickCells, 1000);
    } catch (e) {}
}

function addDisbandQuickCells() {
    const tables = Array.from(document.querySelectorAll('table.Default'));
    if (!tables.length) return;
    tables.forEach(table => {
        // ensure table has a header row
        const header = table.querySelector('tr.Header');
        if (!header) return;

        // Clean previously inserted quick-header cells and insert proper ordered header cells
        Array.from(header.querySelectorAll('td')).forEach(td => {
            const t = (td.textContent || '').trim();
            if (t === '10%' || t === '50%' || t === 'All') td.remove();
        });
        const headerTds = Array.from(header.querySelectorAll('td'));
        let disIdx = headerTds.findIndex(td => /disband/i.test(td.textContent || ''));
        if (disIdx === -1) disIdx = 2; // fallback
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

        // For each row, remove stray quick cells immediately before Disband TD, then insert properly ordered cells
        const rows = Array.from(table.querySelectorAll('tr')).filter(r => !/header/i.test(r.className || ''));
        rows.forEach(row => {
            const disInput = row.querySelector('input[name^="dis_"]');
            if (!disInput) return;
            const disTd = disInput.closest('td');
            if (!disTd) return;

            // Remove any existing quick cells directly to the left of disTd
            let prev = disTd.previousElementSibling;
            while (prev && ['10%','50%','All'].includes((prev.textContent||'').trim())) {
                const rem = prev;
                prev = prev.previousElementSibling;
                rem.remove();
            }

            // Insert fragment of three TDs before disTd
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

    // 4. Disband quick buttons (10% / 50% / All)
    try {
        addDisbandQuickButtons();
        // ensure styles are present and retry a few times in case table loads late
        setTimeout(addDisbandQuickButtons, 500);
        setTimeout(addDisbandQuickButtons, 1000);
        setTimeout(addDisbandQuickButtons, 2000);
        // observe for DOM changes to re-run when table is updated
        const tblObserver = new MutationObserver(() => {
            addDisbandQuickButtons();
        });
        tblObserver.observe(document.body, { childList: true, subtree: true });
    } catch (e) {}
}

// Inject quick-disband buttons into each row's Disband cell
function addDisbandQuickButtons() {
    ensureDisbandStyles();
    const disInputs = Array.from(document.querySelectorAll('input[name^="dis_"]'));
    if (!disInputs.length) return;
    disInputs.forEach(disInput => {
        if (disInput.dataset.gccButtonsAdded) return;
        const tr = disInput.closest('tr');
        if (!tr) return;

        // Prefer the 4th cell (index 3) for In Fleet
        const cells = Array.from(tr.querySelectorAll('td'));
        let inFleetCell = null;
        if (cells.length >= 4) inFleetCell = cells[3];
        else {
            // fallback: find the first right-aligned numeric cell not the disband cell
            inFleetCell = cells.find(td => td !== disInput.parentElement && /\d[\d,]*\d/.test(td.textContent || ''));
        }
        if (!inFleetCell) return;

        const container = document.createElement('div');
        container.style.setProperty('display','inline-flex','important');
        container.style.setProperty('flex-wrap','wrap','important');
        container.style.setProperty('gap','6px','important');
        container.style.setProperty('justify-content','center','important');
        container.style.setProperty('margin-left','6px','important');
        container.style.setProperty('align-items','center','important');

        const options = [ {label:'10%', pct:0.10}, {label:'50%', pct:0.50}, {label:'All', pct:1} ];
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.innerText = opt.label;
            btn.title = `Set to ${opt.label}`;
            btn.style.cssText = 'background:#e8b563;border:none;color:#08203a;padding:4px 8px;border-radius:4px;cursor:pointer;font-size:12px;font-weight:700;';
            btn.style.setProperty('min-width','34px','important');
            btn.style.setProperty('line-height','1','important');
            btn.addEventListener('click', () => {
                const raw = (inFleetCell.textContent || '').replace(/[^0-9,.-]/g,'').replace(/,/g,'').trim();
                let n = parseInt(raw,10);
                if (isNaN(n) || n < 0) n = 0;
                let val = 0;
                if (opt.pct === 1) val = n;
                else val = Math.floor(n * opt.pct);
                disInput.value = val;
                disInput.dispatchEvent(new Event('input', { bubbles: true }));
                disInput.dispatchEvent(new Event('change', { bubbles: true }));
            });
            container.appendChild(btn);
        });

        // append UI to the Disband cell (after the input)
        // ensure parent cell can contain our buttons
        try {
            disInput.parentElement.style.setProperty('display','inline-flex','important');
            disInput.parentElement.style.setProperty('white-space','nowrap','important');
            disInput.parentElement.style.setProperty('align-items','center','important');
        } catch(e){}
        // insert container after the input so it remains visible even in tight cells
        disInput.insertAdjacentElement('afterend', container);
        disInput.dataset.gccButtonsAdded = '1';
    });
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

    // Parse generic rows (keeps previous behavior)
    const rows = Array.from(doc.querySelectorAll('tr'));
    rows.forEach(row => {
        const cells = Array.from(row.querySelectorAll('td,th'));
        if (cells.length < 2) return;
        const rawLabel = cells[0].textContent.trim().replace(/[:\s]+$/, '');
        const rawValue = cells[1].textContent.trim();
        const normalized = rawLabel.replace(/\s+/g, ' ').toLowerCase();
        if (labelMap[normalized]) stats[labelMap[normalized]] = rawValue;
    });

    // Prefer structured tables for Ship Specials and Defense Modifier if present
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

    // If structured aux tables didn't provide Ship Specials, fall back to a broader search.
    if (!stats['Ship Specials']) {
        const specials = [];
        const possibleHeaders = Array.from(doc.querySelectorAll('h1,h2,h3,h4,h5,legend,th,div,span'));
        possibleHeaders.forEach(h => {
            try {
                if (!h.textContent) return;
                if (/ship specials?/i.test(h.textContent)) {
                    // gather following sibling nodes that contain text
                    let node = h.nextElementSibling;
                    let guard = 0;
                    while (node && guard < 30) {
                        const t = (node.textContent || '').trim();
                        if (t) {
                            // split by lines and push
                            t.split(/\n+/).map(s => s.trim()).forEach(s => { if (s) specials.push(s); });
                        }
                        // stop if next header encountered
                        if (/^H[1-6]$/i.test(node.tagName)) break;
                        node = node.nextElementSibling;
                        guard++;
                    }
                    // also check the parent container for <p> items
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
    tooltip.style.cssText = "position:fixed; z-index:100000; pointer-events:none; display:none; max-width:320px; background:rgba(11,29,66,0.98); border:1px solid rgba(148,173,225,0.28); border-radius:12px; box-shadow:0 14px 32px rgba(0,0,0,0.55); padding:12px 14px; color:#f0e6c8; font-size:13px; line-height:1.5; white-space:normal; font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;";
    tooltip.innerHTML = '<style id="gcc-ship-tooltip-style">.gcc-tooltip-header{font-size:13px;font-weight:800;color:#e8b563;margin:12px 0 6px;padding:6px 8px;background:rgba(232,181,99,0.08);border:1px solid rgba(232,181,99,0.18);border-radius:6px;text-transform:uppercase;letter-spacing:0.1em;}.gcc-tooltip-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:4px 0;color:#f1eee8;border-bottom:1px solid rgba(147,169,222,0.12);}.gcc-tooltip-row:last-child{border-bottom:none;}.gcc-tooltip-label{flex:1;color:#f1eee8;opacity:0.95;}.gcc-tooltip-value{margin-left:8px;font-weight:700;color:#f1eee8;white-space:nowrap;}.gcc-tooltip-section{margin-bottom:10px;}.gcc-tooltip-section:first-child{margin-top:4px;}</style><div id="gcc-ship-tooltip-body" class="gcc-ship-tooltip-body"></div>';
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
            // color defense modifiers
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

    // Ship Specials section (array of freeform strings)
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
    .gcc-disband-buttons button { background: #e8b563 !important; border: none !important; color: #08203a !important; padding: 4px 8px !important; border-radius: 4px !important; cursor: pointer !important; font-size: 12px !important; font-weight: 700 !important; min-width: 34px !important; line-height: 1 !important; }
    .gcc-disband-buttons button:hover { filter: brightness(0.95); }
    `;
    document.head.appendChild(s);
}