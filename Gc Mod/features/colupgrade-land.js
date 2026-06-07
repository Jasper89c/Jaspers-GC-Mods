// Adds a "Total Land" column to the colony-upgrade minerals table (f=com_colupgrade).
// The land for each colony is matched by colony name from the Manage Colonies
// page (f=com_col), which lists every colony together with its land.

let gccColonyLandMapPromise = null;

function gccNormalizeColonyName(text) {
    return (text || '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
}

// Fetch the Manage Colonies page once and build a { colonyName -> land } map.
async function gccFetchColonyLandMap() {
    const url = sid ? `i.cfm?&${sid}&f=com_col` : 'i.cfm?f=com_col';
    const res = await fetch(url, { credentials: 'same-origin' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
    const table = doc.querySelector('table.gc-colony-modern-table');
    const map = new Map();
    if (!table) return map;

    // Locate the "Max Land" column, falling back to any header containing "land".
    const headerCells = Array.from(table.querySelectorAll('thead th, thead td'));
    let landIdx = headerCells.findIndex(c => /max\s*land/i.test(c.textContent || ''));
    if (landIdx < 0) landIdx = headerCells.findIndex(c => /land/i.test(c.textContent || ''));

    Array.from(table.querySelectorAll('tbody tr')).forEach(row => {
        const cells = Array.from(row.children).filter(c => c.tagName === 'TD' || c.tagName === 'TH');

        // Colony name: prefer the link to the colony, fall back to the name cell.
        const nameAnchor = row.querySelector('a[href*="f=com_col&colid="]');
        const nameCell = row.querySelector('.gc-colony-modern-table__colony');
        const name = gccNormalizeColonyName(
            nameAnchor ? nameAnchor.textContent : (nameCell ? nameCell.textContent : '')
        );
        if (!name) return;

        const landCell = landIdx >= 0 ? cells[landIdx] : null;
        const land = landCell ? gccNormalizeColonyName(landCell.textContent) : '';
        map.set(name, land);
    });

    return map;
}

async function addColonyUpgradeLandColumn() {
    const table = document.querySelector('table.gc-colupgrade-minerals');
    if (!table || table.dataset.gccLandColAdded) return;
    table.dataset.gccLandColAdded = '1';

    // The minerals table has no <thead>: the first row is the header row.
    const thead = table.querySelector('thead');
    let headerRow, dataRows;
    if (thead) {
        headerRow = thead.querySelector('tr');
        dataRows = Array.from(table.querySelectorAll('tbody tr'));
    } else {
        const allRows = Array.from(table.querySelectorAll('tr'));
        headerRow = allRows[0];
        dataRows = allRows.slice(1);
    }
    if (!headerRow || !dataRows.length) return;

    // Header cell — mirror whatever cell type the header row already uses.
    if (headerRow) {
        const usesTh = !!headerRow.querySelector('th');
        const headerCell = document.createElement(usesTh ? 'th' : 'td');
        headerCell.innerHTML = '&nbsp;Total Land&nbsp;';
        headerRow.appendChild(headerCell);
    }

    // Add a placeholder cell to each data row and remember it by colony name.
    // Colony name is the row's last cell before we append the new one.
    const colCountBefore = (() => {
        const first = dataRows[0];
        return Array.from(first.children).filter(c => c.tagName === 'TD' || c.tagName === 'TH').length;
    })();
    const cellsByName = new Map();
    dataRows.forEach(row => {
        const existing = Array.from(row.children).filter(c => c.tagName === 'TD' || c.tagName === 'TH');
        const nameCell = existing[existing.length - 1];
        const name = gccNormalizeColonyName(nameCell ? nameCell.textContent : '');

        const td = document.createElement('td');
        td.align = 'center';
        td.innerHTML = '&nbsp;…&nbsp;';
        row.appendChild(td);
        if (name) cellsByName.set(name, td);
    });

    // Footer row holding the grand total of all land values.
    const totalRow = document.createElement('tr');
    totalRow.align = 'center';
    const labelCell = document.createElement('td');
    labelCell.colSpan = colCountBefore;
    labelCell.style.textAlign = 'right';
    labelCell.style.fontWeight = '700';
    labelCell.innerHTML = 'Total&nbsp;';
    const totalCell = document.createElement('td');
    totalCell.align = 'center';
    totalCell.style.fontWeight = '700';
    totalCell.innerHTML = '&nbsp;…&nbsp;';
    totalRow.appendChild(labelCell);
    totalRow.appendChild(totalCell);
    dataRows[dataRows.length - 1].insertAdjacentElement('afterend', totalRow);

    try {
        if (!gccColonyLandMapPromise) gccColonyLandMapPromise = gccFetchColonyLandMap();
        const landMap = await gccColonyLandMapPromise;

        let sum = 0;
        let anyMatched = false;
        cellsByName.forEach((td, name) => {
            const land = landMap.get(name);
            td.innerHTML = `&nbsp;${land != null && land !== '' ? land : '—'}&nbsp;`;
            const n = parseInt(String(land).replace(/[^\d-]/g, ''), 10);
            if (!isNaN(n)) { sum += n; anyMatched = true; }
        });
        totalCell.innerHTML = anyMatched ? `&nbsp;${sum.toLocaleString()}&nbsp;` : '&nbsp;—&nbsp;';
    } catch (e) {
        cellsByName.forEach(td => { td.innerHTML = '&nbsp;—&nbsp;'; });
        totalCell.innerHTML = '&nbsp;—&nbsp;';
    }
}
