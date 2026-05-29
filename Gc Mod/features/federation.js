const fedCache = {};

async function fetchFederationName(eid) {
    if (fedCache[eid] !== undefined) return fedCache[eid];
    try {
        const url = `i.cfm?f=com_intel&eid=${eid}`;
        const response = await fetch(url, { credentials: 'same-origin' });
        if (!response.ok) { fedCache[eid] = ''; return ''; }
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const rows = Array.from(doc.querySelectorAll('tr'));
        let fedName = '';
        for (const row of rows) {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 2 && cells[0].textContent.trim() === 'Federation') {
                const clone = cells[1].cloneNode(true);
                const link = clone.querySelector('a');
                if (link) link.remove();
                fedName = clone.textContent.replace(/ /g, ' ').trim();
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

async function fetchActiveCounters() {
    if (counterCache !== null) return counterCache;
    try {
        const url = `i.cfm?f=rank2&ty=3`;
        const response = await fetch(url, { credentials: 'same-origin' });
        if (!response.ok) { counterCache = []; return []; }

        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const counterUids = [];

        const rows = doc.querySelectorAll('table tr');
        rows.forEach(row => {
            const playerLinks = row.querySelectorAll('a[href*="eid="], a[href*="uid="]');
            playerLinks.forEach(link => {
                const hrefStr = link.getAttribute('href') || '';
                const match = hrefStr.match(/[=?&](?:uid|eid|amp;uid|amp;eid)=(\d+)(?:&|$)/);
                if (match) {
                    const extractedId = match[1];
                    if (extractedId && !counterUids.includes(extractedId)) {
                        counterUids.push(extractedId);
                    }
                }
            });
        });

        counterCache = counterUids;
        return counterUids;
    } catch (e) {
        console.error("[GC Helper] Counter parser failure:", e);
        counterCache = [];
        return [];
    }
}

async function fetchWarFederations() {
    if (warFedCache !== null) return warFedCache;
    try {
        const url = `i.cfm?f=fed_war`;
        const response = await fetch(url, { credentials: 'same-origin' });
        if (!response.ok) { warFedCache = []; return []; }
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const warFeds = [];
        const table = doc.querySelector('table.gc-fed-war-table') || doc.querySelector('table');
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

function applyWarHighlight(row, fedName, warFeds, activeCounters) {
    const attackLink = row.querySelector('a[href*="f=com_attack"]');
    if (!attackLink) return;

    const uidMatch = attackLink.getAttribute('href').match(/[=?&](?:uid|eid)=(\d+)/);
    const uid = uidMatch ? uidMatch[1] : null;

    if (uid && activeCounters.includes(uid)) {
        attackLink.style.setProperty('color', '#ff3333', 'important');
        attackLink.style.setProperty('font-weight', 'bold', 'important');
        attackLink.title = "⚠️ CRITICAL: Active Counter-Attack Available!";
        return;
    }

    if (fedName && fedName !== 'No Federation' && warFeds.length) {
        if (warFeds.includes(fedName.toLowerCase())) {
            attackLink.style.setProperty('color', '#4caf50', 'important');
            attackLink.style.setProperty('font-weight', 'bold', 'important');
            attackLink.title = "⚔️ Federation War Target";
            return;
        }
    }

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

async function attachFedLazy() {
    if (!window.location.href.includes('rank')) return;

    const activeCounters = await fetchActiveCounters();

    let tables = document.querySelectorAll('table.rank-results-table, table.rank-page-table');
    if (!tables.length) {
        tables = document.querySelectorAll('table');
    }
    if (!tables.length) return;

    const rows = Array.from(tables).flatMap(table =>
        Array.from(table.querySelectorAll('tr')).filter(r => !r.classList.contains('rank-results-header') && !r.classList.contains('Header') && !r.textContent.includes('Score'))
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
                const name = await fetchFederationName(eid);
                const warFeds = await fetchWarFederations();

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

async function attachFedFull() {
    if (!window.location.href.includes('rank')) return;

    const activeCounters = await fetchActiveCounters();

    let tables = document.querySelectorAll('table.rank-results-table, table.rank-page-table');
    if (!tables.length) {
        tables = document.querySelectorAll('table');
    }
    if (!tables.length) return;

    const rows = Array.from(tables).flatMap(table =>
        Array.from(table.querySelectorAll('tr')).filter(r => !r.classList.contains('rank-results-header') && !r.classList.contains('Header') && !r.textContent.includes('Score'))
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
            const name = await fetchFederationName(eid);
            const warFeds = await fetchWarFederations();
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
