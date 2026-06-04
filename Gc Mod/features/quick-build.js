function attachQuickBuild() {
    const table = document.querySelector('table.gc-colony-modern-table');
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
    const fetchUrl = sid ? `i.cfm?&${sid}&f=com_col&colid=${colid}` : `i.cfm?f=com_col&colid=${colid}`;

    try {
        const res = await fetch(fetchUrl, { credentials: 'same-origin' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
        const buildSection     = doc.querySelector('section.gc-colony-detail-modern__panel--build');
        const constructionForm = buildSection
            ? buildSection.querySelector('form.gc-colony-detail-modern__form')
            : doc.querySelector('form.gc-colony-detail-modern__form');
        const buildPanelHead   = buildSection
            ? buildSection.querySelector('.gc-colony-detail-modern__panel-head')
            : null;
        const directivesPanel  = doc.querySelector('.gc-colony-detail-modern__panel--orders');
        const statusPanel      = doc.querySelector('section.gc-colony-detail-modern__panel--status');
        const empirePanel      = doc.querySelector('section.gc-colony-detail-modern__panel--empire');

        if (!constructionForm && !statusPanel && !empirePanel) {
            td.innerHTML = '<div style="color:#f44336;padding:12px;">Could not load colony data.</div>';
            return;
        }

        const panel = document.createElement('div');
        panel.className = 'gcc-qb-panel';

        // ── Left column: construction form → directives ──
        const leftCol = document.createElement('div');
        leftCol.style.cssText = 'flex:1 1 300px;min-width:280px;display:flex;flex-direction:column;gap:10px;';

        const statusDiv = document.createElement('div');
        statusDiv.className = 'gcc-qb-status';

        if (buildPanelHead) {
            leftCol.appendChild(buildPanelHead.cloneNode(true));
        }

        if (constructionForm) {
            const form = constructionForm.cloneNode(true);
            form.action = fetchUrl;

            // Wire Max buttons — set input to available free land
            const freeLand = parseInt(form.dataset.freeLand || '0');
            form.querySelectorAll('button.gc-colony-detail-modern__max-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const input = form.querySelector(`input[name="${btn.dataset.target}"]`);
                    if (input) input.value = freeLand;
                });
            });

            // Fix Done link to navigate back to colony list
            form.querySelectorAll('a.gc-colony-detail-modern__action--done').forEach(a => {
                a.href = 'javascript:void(0)';
                a.addEventListener('click', () => {
                    window.location.href = sid ? `i.cfm?&${sid}&f=com_col` : `i.cfm?f=com_col`;
                });
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

        if (directivesPanel) {
            leftCol.appendChild(directivesPanel.cloneNode(true));
        }

        leftCol.appendChild(statusDiv);
        panel.appendChild(leftCol);

        // ── Right column: planet profile + treasury ──
        if (statusPanel || empirePanel) {
            const kvDiv = document.createElement('div');
            kvDiv.style.cssText = 'flex:0 1 260px;min-width:220px;display:flex;flex-direction:column;gap:8px;';
            if (statusPanel) kvDiv.appendChild(statusPanel.cloneNode(true));
            if (empirePanel) kvDiv.appendChild(empirePanel.cloneNode(true));
            panel.appendChild(kvDiv);
        }

        td.innerHTML = '';
        td.style.padding = '0';
        td.appendChild(panel);
    } catch (err) {
        td.innerHTML = `<div style="color:#f44336;padding:12px;">Error: ${err.message}</div>`;
    }
}
