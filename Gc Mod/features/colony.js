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
