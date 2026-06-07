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

/* -------------------------------------------------------------------------
   Fed list extra columns: Total Wins, Total Losses, Active Players
   Adds three columns to the federation list (i.cfm?f=fed_join) between the
   Planets and Leader columns. For each federation it fetches the roster
   (fed_join&fid=) to count active members (Last Login = 0) and, for each
   member, fetches com_intel to sum "Battles won" / "Battles lost".
   ------------------------------------------------------------------------- */

const memberBattleCache = {};

function gccParseNum(text) {
    if (text == null) return 0;
    const cleaned = String(text).replace(/[^\d-]/g, '');
    if (cleaned === '' || cleaned === '-') return 0;
    return parseInt(cleaned, 10) || 0;
}

async function runWithConcurrency(items, limit, worker) {
    const queue = items.slice();
    const runners = [];
    const count = Math.min(limit, queue.length);
    for (let i = 0; i < count; i++) {
        runners.push((async () => {
            while (queue.length) {
                await worker(queue.shift());
            }
        })());
    }
    await Promise.all(runners);
}

async function fetchMemberBattleStats(eid) {
    if (memberBattleCache[eid] !== undefined) return memberBattleCache[eid];
    const result = { wins: 0, losses: 0 };
    try {
        const response = await fetch(`i.cfm?f=com_intel&eid=${eid}`, { credentials: 'same-origin' });
        if (!response.ok) { memberBattleCache[eid] = result; return result; }
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        doc.querySelectorAll('tr').forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length < 2) return;
            const label = cells[0].textContent.trim();
            if (label === 'Battles won') result.wins = gccParseNum(cells[1].textContent);
            else if (label === 'Battles lost') result.losses = gccParseNum(cells[1].textContent);
        });
    } catch (e) { /* leave zeros */ }
    memberBattleCache[eid] = result;
    return result;
}

async function fetchFedRoster(fid) {
    const result = { members: [], activeCount: 0 };
    try {
        const response = await fetch(`i.cfm?f=fed_join&fid=${fid}`, { credentials: 'same-origin' });
        if (!response.ok) return result;
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const table = doc.querySelector('table.gc-fed-member-table');
        if (!table) return result;

        // Locate the "Last Login" column by header text (fall back to index 4).
        let lastLoginIdx = 4;
        const header = table.querySelector('tr.Header');
        if (header) {
            const headers = Array.from(header.querySelectorAll('td')).map(td => td.textContent.trim().toLowerCase());
            const idx = headers.indexOf('last login');
            if (idx !== -1) lastLoginIdx = idx;
        }

        table.querySelectorAll('tr').forEach(row => {
            if (row.classList.contains('Header')) return;
            const empireCell = row.querySelector('td.gc-fed-member-table__empire');
            if (!empireCell) return; // skips the Total summary row
            const link = empireCell.querySelector('a[href*="eid="]');
            const m = link && link.getAttribute('href').match(/eid=(\d+)/);
            if (m) result.members.push(m[1]);

            const cells = row.querySelectorAll('td');
            const rawLastLogin = cells[lastLoginIdx]
                ? cells[lastLoginIdx].textContent.replace(/[^\d-]/g, '')
                : '';
            if (rawLastLogin === '0') result.activeCount++;
        });
    } catch (e) { /* leave empty */ }
    return result;
}

async function attachFedJoinStats() {
    if (!window.location.href.includes('f=fed_join')) return;
    const listTable = document.querySelector('table.gc-fed-list');
    if (!listTable || listTable.dataset.gccFedStatsDone) return;
    listTable.dataset.gccFedStatsDone = '1';

    // The theme CSS pins this table to `table-layout: fixed` with widths on
    // nth-child(1)-(5) summing to 100%. Adding columns under fixed layout
    // collapses the extra ones (and pushes Leader off). Switch to auto layout
    // (inline beats the non-!important stylesheet rule) so all columns show.
    listTable.style.tableLayout = 'auto';

    // Toggle to hide federations with 0 active members. Re-applied as each
    // fed's active count fills in (see applyActiveFilter calls below).
    const filterWrap = document.createElement('div');
    filterWrap.className = 'gcc-fed-active-filter';
    filterWrap.style.cssText = 'text-align:center; margin:6px 0; font-size:12px;';
    const filterId = 'gcc-hide-inactive-feds';
    filterWrap.innerHTML = `<label style="cursor:pointer;"><input type="checkbox" id="${filterId}" style="vertical-align:middle; margin-right:5px;">Hide federations with 0 active members</label>`;
    listTable.parentNode.insertBefore(filterWrap, listTable);

    const applyActiveFilter = () => {
        const hide = document.getElementById(filterId)?.checked;
        listTable.querySelectorAll('tr.gc-fed-list__row').forEach(r => {
            const count = r.dataset.gccActiveCount;
            // Leave rows whose count hasn't loaded yet visible.
            r.style.display = (hide && count === '0') ? 'none' : '';
        });
    };
    filterWrap.querySelector('input').addEventListener('change', applyActiveFilter);

    // Insert the three header cells before the Leader header.
    const headerRow = listTable.querySelector('tr.Header');
    if (headerRow) {
        const headerCells = headerRow.querySelectorAll('td');
        const leaderHeader = headerCells[headerCells.length - 1];
        ['Total Wins', 'Total Losses', 'Active'].forEach(text => {
            const td = document.createElement('td');
            td.textContent = text;
            headerRow.insertBefore(td, leaderHeader);
        });
    }

    const makeCell = (label) => {
        const td = document.createElement('td');
        td.setAttribute('data-label', label);
        td.textContent = '…';
        return td;
    };

    const tasks = Array.from(listTable.querySelectorAll('tr.gc-fed-list__row')).map(row => {
        const cells = row.querySelectorAll('td');
        const leaderCell = row.querySelector('td[data-label="Leader"]') || cells[cells.length - 1];
        const winsTd = makeCell('Total Wins');
        const lossesTd = makeCell('Total Losses');
        const activeTd = makeCell('Active');
        row.insertBefore(winsTd, leaderCell);
        row.insertBefore(lossesTd, leaderCell);
        row.insertBefore(activeTd, leaderCell);

        const link = row.querySelector('a[href*="fid="]');
        let fid = link && (link.getAttribute('href').match(/fid=(\d+)/) || [])[1];
        if (!fid) fid = ((row.getAttribute('onclick') || '').match(/fid=(\d+)/) || [])[1];
        return { row, fid, winsTd, lossesTd, activeTd };
    });

    // Outer cap of 2 feds at a time; each fed fetches members 4 at a time.
    await runWithConcurrency(tasks, 2, async (task) => {
        if (!task.fid) {
            task.winsTd.textContent = task.lossesTd.textContent = task.activeTd.textContent = '–';
            return;
        }
        const roster = await fetchFedRoster(task.fid);
        task.activeTd.textContent = roster.activeCount.toLocaleString();
        task.row.dataset.gccActiveCount = String(roster.activeCount);
        applyActiveFilter();

        let wins = 0, losses = 0;
        await runWithConcurrency(roster.members, 4, async (eid) => {
            const s = await fetchMemberBattleStats(eid);
            wins += s.wins;
            losses += s.losses;
        });
        task.winsTd.textContent = wins.toLocaleString();
        task.lossesTd.textContent = losses.toLocaleString();
    });
}
