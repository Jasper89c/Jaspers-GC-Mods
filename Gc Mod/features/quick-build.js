function attachQuickBuild() {
    const table = document.querySelector('table.gc-colony-list-table');
    if (!table || table.dataset.gccQuickBuildAttached) return;
    table.dataset.gccQuickBuildAttached = '1';

    const tbody = table.querySelector('tbody');
    if (!tbody) return;

    if (!document.getElementById('gcc-quick-build-style')) {
        const style = document.createElement('style');
        style.id = 'gcc-quick-build-style';
        style.textContent = `
            .gcc-qb-row { cursor: pointer; }
            .gcc-qb-row:hover > td { background: rgba(255,152,0,0.06) !important; }
            .gcc-qb-expanded > td { padding: 0 !important; }
            .gcc-qb-panel { display:flex; gap:16px; padding:12px; background:#1a2035; border-top:2px solid #ff9800; flex-wrap:wrap; }
            .gcc-qb-panel table { font-size:12px; width:100%; }
            .gcc-qb-panel table td { padding: 3px 6px; }
            .gcc-qb-panel input[type="text"] { background:#2a365a; color:white; border:1px solid #555; border-radius:3px; padding:2px 4px; }
            .gcc-qb-panel input[type="button"], .gcc-qb-panel input[type="submit"] { background:#1f2842; color:white; border:1px solid #555; border-radius:4px; padding:4px 10px; cursor:pointer; font-size:11px; margin:2px; }
            .gcc-qb-panel input[type="submit"]:hover { background:rgba(255,152,0,0.2); border-color:#ff9800; }
            .gcc-qb-status { font-size:11px; padding:6px 8px; width:100%; display:none; }
        `;
        document.head.appendChild(style);
    }

    Array.from(tbody.querySelectorAll('tr')).forEach(row => {
        const anchor = row.querySelector('a[href*="f=com_col&colid="]');
        if (!anchor) return;
        const match = anchor.getAttribute('href').match(/colid=(\d+)/);
        if (!match) return;
        const colid = match[1];

        row.classList.add('gcc-qb-row');
        row.addEventListener('click', async (e) => {
            if (e.target.closest('a, button, input')) return;

            const next = row.nextElementSibling;
            if (next && next.dataset.gccQuickBuildRow === colid) {
                next.remove();
                return;
            }

            tbody.querySelectorAll('[data-gcc-quick-build-row]').forEach(r => r.remove());

            const expandedRow = document.createElement('tr');
            expandedRow.dataset.gccQuickBuildRow = colid;
            expandedRow.classList.add('gcc-qb-expanded');

            const td = document.createElement('td');
            td.colSpan = 99;
            td.innerHTML = '<div style="padding:12px;text-align:center;color:#aaa;background:#1a2035;">⏳ Loading...</div>';
            expandedRow.appendChild(td);
            row.insertAdjacentElement('afterend', expandedRow);

            await loadColonyQuickBuild(colid, td);
        });
    });
}

async function loadColonyQuickBuild(colid, td) {
    const fetchUrl   = sid ? `i.cfm?&${sid}&f=com_col&colid=${colid}`         : `i.cfm?f=com_col&colid=${colid}`;
    const plunderUrl = sid ? `i.cfm?&${sid}&f=com_col_plunder&cid=${colid}`   : `i.cfm?f=com_col_plunder&cid=${colid}`;

    try {
        const [res, plunderRes] = await Promise.all([
            fetch(fetchUrl,   { credentials: 'same-origin' }),
            fetch(plunderUrl, { credentials: 'same-origin' })
        ]);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
        const constructionTable = doc.querySelector('table.gc-colony-detail-table--form');
        const actionsTable      = doc.querySelector('table.gc-colony-detail-table--actions');
        const kvTables          = Array.from(doc.querySelectorAll('table.gc-colony-detail-table--kv'));

        if (!constructionTable && !kvTables.length) {
            td.innerHTML = '<div style="color:#f44336;padding:12px;">Could not load colony data.</div>';
            return;
        }

        // Parse plunder page
        let plunderP = null, plunderBtn = null;
        if (plunderRes.ok) {
            const plunderDoc = new DOMParser().parseFromString(await plunderRes.text(), 'text/html');
            plunderP   = plunderDoc.querySelector('p.smallfont');
            plunderBtn = plunderDoc.querySelector('input[type="button"][value*="Plunder"]');
        }

        const panel = document.createElement('div');
        panel.className = 'gcc-qb-panel';

        // ── Left column: construction form → actions → plunder ──
        const leftCol = document.createElement('div');
        leftCol.style.cssText = 'flex:1 1 300px;min-width:280px;display:flex;flex-direction:column;gap:10px;';

        const statusDiv = document.createElement('div');
        statusDiv.className = 'gcc-qb-status';

        if (constructionTable) {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = fetchUrl;
            form.appendChild(constructionTable.cloneNode(true));

            form.querySelectorAll('input[type="button"]').forEach(btn => {
                if (/done/i.test(btn.value)) {
                    btn.removeAttribute('onclick');
                    btn.addEventListener('click', () => {
                        window.location.href = sid ? `i.cfm?&${sid}&f=com_col` : `i.cfm?f=com_col`;
                    });
                }
            });

            let clickedBtn = null;
            form.querySelectorAll('input[type="submit"]').forEach(btn => {
                btn.addEventListener('mousedown', () => { clickedBtn = { name: btn.name, value: btn.value }; });
            });

            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const params = new URLSearchParams();
                new FormData(form).forEach((v, k) => params.set(k, v));
                if (clickedBtn) params.set(clickedBtn.name, clickedBtn.value);
                clickedBtn = null;

                statusDiv.style.display = 'block';
                statusDiv.style.color = '#ff9800';
                statusDiv.textContent = '⏳ Processing...';

                try {
                    const postRes = await fetch(fetchUrl, {
                        method: 'POST',
                        body: params,
                        credentials: 'same-origin',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    });
                    if (postRes.ok) {
                        statusDiv.textContent = '✅ Done — refreshing...';
                        await loadColonyQuickBuild(colid, td);
                    } else {
                        statusDiv.style.color = '#f44336';
                        statusDiv.textContent = `❌ Server error (${postRes.status})`;
                    }
                } catch (err) {
                    statusDiv.style.color = '#f44336';
                    statusDiv.textContent = `❌ ${err.message}`;
                }
            });

            leftCol.appendChild(form);
        }

        if (actionsTable) {
            leftCol.appendChild(actionsTable.cloneNode(true));
        }

        if (plunderP || plunderBtn) {
            const plunderDiv = document.createElement('div');
            plunderDiv.style.cssText = 'background:#192035;border:1px solid #3a4d75;border-radius:6px;padding:10px;text-align:center;';

            if (plunderP) plunderDiv.appendChild(plunderP.cloneNode(true));

            if (plunderBtn) {
                const btn = plunderBtn.cloneNode(true);
                btn.removeAttribute('onclick');
                btn.addEventListener('click', () => {
                    if (confirm('Confirm plunder this colony?')) {
                        window.location.href = sid
                            ? `i.cfm?&${sid}&f=com_col_plunder&cid=${colid}&co=1`
                            : `i.cfm?f=com_col_plunder&cid=${colid}&co=1`;
                    }
                });
                plunderDiv.appendChild(btn);
            }

            leftCol.appendChild(plunderDiv);
        }

        leftCol.appendChild(statusDiv);
        panel.appendChild(leftCol);

        // ── Right column: kv tables (population, empire info) ──
        if (kvTables.length) {
            const kvDiv = document.createElement('div');
            kvDiv.style.cssText = 'flex:0 1 220px;min-width:200px;display:flex;flex-direction:column;gap:8px;';
            kvTables.forEach(t => kvDiv.appendChild(t.cloneNode(true)));
            panel.appendChild(kvDiv);
        }

        td.innerHTML = '';
        td.style.padding = '0';
        td.appendChild(panel);
    } catch (err) {
        td.innerHTML = `<div style="color:#f44336;padding:12px;">Error: ${err.message}</div>`;
    }
}
