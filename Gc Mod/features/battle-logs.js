const battleEventPages = [];
const battleEventNextEvids = [null]; // index i → evid needed to fetch page i
let battleEventsExhausted = false;
const BATTLE_MAX_PAGES = 20;

function attachBattleLogs() {
    const table = document.querySelector('table.gc-battle-prev-table');
    if (!table || table.dataset.gccBattleLogsAttached) return;
    table.dataset.gccBattleLogsAttached = '1';

    const tbody = table.querySelector('tbody');
    if (!tbody) return;

    if (!document.getElementById('gcc-battle-logs-style')) {
        const style = document.createElement('style');
        style.id = 'gcc-battle-logs-style';
        style.textContent = `
            .gcc-bl-row { cursor: pointer; }
            .gcc-bl-row:hover > td { background: rgba(255,152,0,0.06) !important; }
            .gcc-bl-expanded > td { padding: 0 !important; }
            .gcc-bl-panel { padding: 14px 20px; background: #1a2035; border-top: 2px solid #ff9800; }
            .gcc-bl-panel table { font-size: 12px; margin: 0 auto; }
            .gcc-bl-panel table td { padding: 3px 8px; }
            .gcc-bl-panel b { color: #e8b563; }
        `;
        document.head.appendChild(style);
    }

    Array.from(tbody.querySelectorAll('tr')).forEach(row => {
        if (row.classList.contains('Header') || row.querySelectorAll('td').length < 4) return;

        const info = parseBattleLogRow(row);
        if (!info) return;

        row.classList.add('gcc-bl-row');
        row.addEventListener('click', async (e) => {
            if (e.target.closest('a, button, input')) return;

            const next = row.nextElementSibling;
            if (next && next.classList.contains('gcc-bl-expanded')) {
                next.remove();
                return;
            }

            tbody.querySelectorAll('.gcc-bl-expanded').forEach(r => r.remove());

            const expandedRow = document.createElement('tr');
            expandedRow.classList.add('gcc-bl-expanded');

            const td = document.createElement('td');
            td.colSpan = 99;
            td.innerHTML = '<div style="padding:12px;text-align:center;color:#aaa;background:#1a2035;">⏳ Loading battle details...</div>';
            expandedRow.appendChild(td);
            row.insertAdjacentElement('afterend', expandedRow);

            const detail = await findBattleEvent(info.date, info.time, info.attacker, info.defender);

            if (detail) {
                td.innerHTML = '';
                td.style.padding = '0';
                const panel = document.createElement('div');
                panel.className = 'gcc-bl-panel';
                panel.appendChild(detail);
                td.appendChild(panel);
            } else {
                td.innerHTML = '<div style="padding:12px;text-align:center;color:#888;background:#1a2035;">No detailed report found for this battle.</div>';
            }
        });
    });
}

function parseBattleLogRow(row) {
    const cells = row.querySelectorAll('td');
    if (cells.length < 4) return null;

    const smallfont = cells[0].querySelector('.smallfont');
    if (!smallfont) return null;

    const date = Array.from(smallfont.childNodes)
        .find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim())
        ?.textContent?.trim();
    const time = smallfont.querySelector('font')?.textContent?.trim();

    if (!date || !time) return null;

    const attacker = cells[1].querySelector('.smallfont')?.textContent?.trim();
    const defender = cells[2].querySelector('.smallfont')?.textContent?.trim();

    return { date, time, attacker, defender };
}

function normTime(t) {
    // "06:53 AM" → "6:53 AM" to match events page format
    return t.trim().replace(/^0(\d:)/, '$1');
}

async function findBattleEvent(date, time, attacker, defender) {
    const target = normTime(time);

    for (const doc of battleEventPages) {
        const hit = searchEventDoc(doc, date, target, attacker, defender);
        if (hit) return hit;
    }

    while (battleEventPages.length < BATTLE_MAX_PAGES && !battleEventsExhausted) {
        const pageIndex = battleEventPages.length;
        const doc = await fetchEventsPage(battleEventNextEvids[pageIndex]);
        if (!doc) { battleEventsExhausted = true; break; }

        battleEventPages.push(doc);

        const nextEvid = getEventsNextEvid(doc);
        if (nextEvid) {
            battleEventNextEvids.push(nextEvid);
        } else {
            battleEventsExhausted = true;
        }

        const hit = searchEventDoc(doc, date, target, attacker, defender);
        if (hit) return hit;
    }

    return null;
}

async function fetchEventsPage(evid) {
    const base = sid ? `i.cfm?&${sid}&f=com_empire&cm=4` : `i.cfm?f=com_empire&cm=4`;
    const url = evid ? `${base}&evid=${evid}` : base;
    try {
        const res = await fetch(url, { credentials: 'same-origin' });
        if (!res.ok) return null;
        return new DOMParser().parseFromString(await res.text(), 'text/html');
    } catch (e) {
        return null;
    }
}

function getEventsNextEvid(doc) {
    for (const link of doc.querySelectorAll('a[href*="evid="]')) {
        if (/next/i.test(link.textContent.trim())) {
            const m = link.getAttribute('href').match(/evid=(\d+)/);
            if (m) return m[1];
        }
    }
    return null;
}

function extractBattleContent(bodyTd) {
    // bodyTd is a <td> — extract the inner content div so it renders correctly outside a table
    const content = bodyTd.querySelector('.gc-events-table__content') ||
                    bodyTd.querySelector('.gc-events-table__body-inner');
    return (content || bodyTd).cloneNode(true);
}

function searchEventDoc(doc, targetDate, targetTime, attackerName, defenderName) {
    const candidates = [];

    for (const row of doc.querySelectorAll('tr.gc-events-table__row')) {
        const timeEl = row.querySelector('.gc-events-table__time-text');
        const dateEl = row.querySelector('.gc-events-table__date');
        const body   = row.querySelector('.gc-events-table__body--battle');
        if (!timeEl || !dateEl || !body) continue;

        if (dateEl.textContent.trim() === targetDate &&
            normTime(timeEl.textContent) === targetTime) {
            candidates.push(body);
        }
    }

    if (!candidates.length) return null;
    if (candidates.length === 1) return extractBattleContent(candidates[0]);

    // Multiple battles at same minute — narrow by player name
    for (const body of candidates) {
        const text = body.textContent.toLowerCase();
        if ((attackerName && text.includes(attackerName.toLowerCase())) ||
            (defenderName && text.includes(defenderName.toLowerCase()))) {
            return extractBattleContent(body);
        }
    }

    return extractBattleContent(candidates[0]);
}
