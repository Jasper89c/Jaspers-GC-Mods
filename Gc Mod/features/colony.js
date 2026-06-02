function addAssimilateButtons(sid) {
    const table = document.querySelector('table.gc-colony-modern-table');
    if (!table) return;

    const headerRow = table.querySelector('thead tr');
    if (headerRow && !headerRow.querySelector('.gcc-assim-header')) {
        const th = document.createElement('th');
        th.className = 'gc-colony-modern-table__metric gcc-assim-header';
        th.textContent = 'Assimilate';
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
        td.className = 'gc-colony-modern-table__metric';

        const btn = document.createElement('input');
        btn.type = 'button';
        btn.value = '✔';
        btn.className = 'gc-colony-detail-modern__action gc-colony-detail-modern__action--submit';
        btn.style.cssText = 'font-family:var(--font-mono);font-size:9.5px;font-weight:700;letter-spacing:0.14em;padding:0 12px;';

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
    const table = document.querySelector('table.gc-colony-modern-table');
    if (!table) return;

    const headerRow = table.querySelector('thead tr');
    if (headerRow && !headerRow.querySelector('.gcc-infect-header')) {
        const th = document.createElement('th');
        th.className = 'gc-colony-modern-table__metric gcc-infect-header';
        th.textContent = 'Infect';
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
        td.className = 'gc-colony-modern-table__metric';

        const btn = document.createElement('input');
        btn.type = 'button';
        btn.value = '✔';
        btn.className = 'gc-colony-detail-modern__action gc-colony-detail-modern__action--submit';
        btn.style.cssText = 'font-family:var(--font-mono);font-size:9.5px;font-weight:700;letter-spacing:0.14em;padding:0 12px;';

        btn.addEventListener('click', () => {
            if (!sid) return alert('SID not found. Click Cmd to sync first.');
            window.location.href = `i.cfm?&${sid}&f=com_change&cid=${cid}&co=1`;
        });

        td.appendChild(btn);
        row.appendChild(td);
        row.dataset.gccInfectAdded = '1';
    });
}
