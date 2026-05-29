const shipStatCache = {};

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
    let _attachTimer = null;
    const observer = new MutationObserver(() => {
        clearTimeout(_attachTimer);
        _attachTimer = setTimeout(attachAll, 200);
    });
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

const SHIP_LABEL_MAP = createLabelMap();

function extractShipStatsFromDetailDoc(doc) {
    if (!doc || !doc.body) return null;
    const stats = {};
    const labelMap = SHIP_LABEL_MAP;

    const textContent = (doc.body.textContent || '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
    shipStatLabels.forEach(label => {
        const regex = new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*[:\\-]?\\s*([+\\d.,%]+)', 'i');
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

    const labelMap = SHIP_LABEL_MAP;

    const extractFromText = (text) => {
        const cleaned = text.replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
        for (const label of shipStatLabels) {
            const regex = new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*[:\\-]?\\s*([+\\d.,%]+)', 'i');
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
            let valueHtml = `<span class="gcc-tooltip-value">${val}</span>`;
            if (['Absorption Shield','ECM','Ionized Hull','Energy Shield'].includes(key)) {
                const negative = /-\s*\d/.test(val);
                const positive = /\+\s*\d/.test(val);
                const color = negative ? '#ff6b6b' : (positive ? '#7fe08a' : '#f1eee8');
                valueHtml = `<span class="gcc-tooltip-value" style="color:${color}">${val}</span>`;
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
