function ensureDisbandStyles() {
    if (document.getElementById('gcc-disband-buttons-style')) return;
    const s = document.createElement('style');
    s.id = 'gcc-disband-buttons-style';
    s.textContent = `
    .gcc-disband-buttons { display: inline-flex !important; gap: 6px !important; margin-left: 6px !important; align-items: center !important; }
    .gcc-disband-buttons button { background: var(--accent) !important; border: none !important; color: var(--text-inverse) !important; padding: 4px 8px !important; border-radius: 4px !important; cursor: pointer !important; font-size: 12px !important; font-weight: 700 !important; min-width: 34px !important; line-height: 1 !important; }
    .gcc-disband-buttons button:hover { background: var(--accent-hover) !important; }
    `;
    document.head.appendChild(s);
}

function addDisbandQuickCells() {
    if (!window.location.href.includes('f=com_disband')) return;
    const tables = Array.from(document.querySelectorAll('table.Default'));
    if (!tables.length) return;
    tables.forEach(table => {
        const header = table.querySelector('tr.Header');
        if (!header) return;

        Array.from(header.querySelectorAll('td')).forEach(td => {
            const t = (td.textContent || '').trim();
            if (t === '10%' || t === '50%' || t === 'All') td.remove();
        });
        const headerTds = Array.from(header.querySelectorAll('td'));
        let disIdx = headerTds.findIndex(td => /disband/i.test(td.textContent || ''));
        if (disIdx === -1) disIdx = 2;
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

        const rows = Array.from(table.querySelectorAll('tr')).filter(r => !/header/i.test(r.className || ''));
        rows.forEach(row => {
            const disInput = row.querySelector('input[name^="dis_"]');
            if (!disInput) return;
            const disTd = disInput.closest('td');
            if (!disTd) return;

            let prev = disTd.previousElementSibling;
            while (prev && ['10%','50%','All'].includes((prev.textContent||'').trim())) {
                const rem = prev;
                prev = prev.previousElementSibling;
                rem.remove();
            }

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
