const GCC_MARKET_PRESETS = {
    low:    [
        { label: '10K',  value: 10_000 },
        { label: '25K',  value: 25_000 },
        { label: '50K',  value: 50_000 },
        { label: '100K', value: 100_000 },
    ],
    medium: [
        { label: '100K', value: 100_000 },
        { label: '250K', value: 250_000 },
        { label: '500K', value: 500_000 },
        { label: '1M',   value: 1_000_000 },
    ],
    high: [
        { label: '100M', value: 100_000_000 },
        { label: '250M', value: 250_000_000 },
        { label: '500M', value: 500_000_000 },
        { label: '1B',   value: 1_000_000_000 },
    ],
};

const MKT_BTN = 'flex:1;min-width:48px;padding:4px 2px;font-size:11px;font-weight:700;cursor:pointer;border-radius:4px;border:1px solid var(--border,#334b75);background:var(--bg-surface,#1f2842);color:var(--accent,#e8b563);font-family:var(--font-mono,monospace);transition:background 0.12s,border-color 0.12s;';

function addMarketQuickFill() {
    if (!window.location.href.includes('f=com_market2')) return;
    if (document.querySelector('.gcc-market-quickfill')) return;

    chrome.storage.local.get(['marketQuickFillEnabled', 'marketPreset'], (res) => {
        if (res.marketQuickFillEnabled === false) return;

        let activePreset = res.marketPreset || 'high';
        const form = document.querySelector('form.gc-market-detail-modern-form');
        const grid = document.querySelector('.gc-market-detail-modern-grid');

        // All fill button groups — updated when preset changes
        const allBtnGroups = [];

        function updateAllButtons(preset) {
            activePreset = preset;
            const amounts = GCC_MARKET_PRESETS[preset];
            allBtnGroups.forEach(group => {
                group.forEach((btn, i) => {
                    btn.textContent      = amounts[i].label;
                    btn.dataset.mktValue = amounts[i].value;
                });
            });
        }

        // ── Preset selector (shared, above the buy/sell grid) ──
        if (grid) {
            const presetRow = document.createElement('div');
            presetRow.className = 'gcc-market-quickfill';
            presetRow.style.cssText = 'display:flex;align-items:center;gap:8px;padding:0 0 10px;';

            const lbl = document.createElement('span');
            lbl.textContent = 'Preset:';
            lbl.style.cssText = 'font-size:11px;font-weight:700;color:var(--text-muted,#8890a8);font-family:var(--font-mono,monospace);text-transform:uppercase;letter-spacing:0.5px;flex-shrink:0;';
            presetRow.appendChild(lbl);

            const presetBtns = {};
            ['low', 'medium', 'high'].forEach(preset => {
                const btn = document.createElement('button');
                btn.type        = 'button';
                btn.textContent = preset[0].toUpperCase() + preset.slice(1);
                btn.style.cssText = MKT_BTN + 'flex:0 0 auto;padding:4px 14px;';
                presetBtns[preset] = btn;

                btn.addEventListener('click', () => {
                    Object.entries(presetBtns).forEach(([p, b]) => {
                        b.style.borderColor = p === preset ? 'var(--accent,#e8b563)' : 'var(--border,#334b75)';
                        b.style.background  = p === preset ? 'var(--bg-elevated,#2a365a)' : 'var(--bg-surface,#1f2842)';
                    });
                    updateAllButtons(preset);
                    chrome.storage.local.set({ marketPreset: preset });
                });

                presetRow.appendChild(btn);
            });

            // Highlight saved preset
            if (presetBtns[activePreset]) {
                presetBtns[activePreset].style.borderColor = 'var(--accent,#e8b563)';
                presetBtns[activePreset].style.background  = 'var(--bg-elevated,#2a365a)';
            }

            grid.parentNode.insertBefore(presetRow, grid);
        }

        // ── Transaction helper ──
        async function submitTransaction(submitName) {
            if (!form) return;
            const params = new URLSearchParams(new FormData(form));
            params.set(submitName, submitName === 'buyflag' ? 'Buy' : 'Sell');
            try {
                await fetch(form.action, {
                    method: 'POST',
                    body: params,
                    credentials: 'same-origin',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                });
            } catch(e) {}
        }

        // ── Per-panel rows ──
        function makePanel(input, submitName, actionLabel) {
            let autoEnabled = false;
            let txCount = 0;

            // Auto toggle row
            const toggleRow = document.createElement('div');
            toggleRow.className = 'gc-market-field gcc-market-quickfill';

            const toggleLabel = document.createElement('div');
            toggleLabel.className = 'gc-market-field__label';
            toggleLabel.textContent = 'Auto';
            toggleRow.appendChild(toggleLabel);

            const toggleWrap = document.createElement('div');
            toggleWrap.className = 'gc-market-field__control';
            toggleWrap.style.cssText = 'display:flex;align-items:center;gap:8px;';

            const toggleBtn = document.createElement('button');
            toggleBtn.type = 'button';
            toggleBtn.textContent = 'OFF';
            toggleBtn.style.cssText = MKT_BTN + 'flex:0 0 auto;padding:4px 14px;';

            const statusEl = document.createElement('span');
            statusEl.style.cssText = 'font-size:10px;color:var(--accent-good,#7fc592);font-family:var(--font-mono,monospace);font-weight:700;';

            function setToggle(on) {
                autoEnabled = on;
                if (on) {
                    toggleBtn.textContent = 'ON';
                    toggleBtn.style.background  = 'var(--accent-hot,#ec6262)';
                    toggleBtn.style.borderColor = 'var(--accent-hot,#ec6262)';
                    toggleBtn.style.color       = '#fff';
                } else {
                    toggleBtn.textContent = 'OFF';
                    toggleBtn.style.background  = 'var(--bg-surface,#1f2842)';
                    toggleBtn.style.borderColor = 'var(--border,#334b75)';
                    toggleBtn.style.color       = 'var(--accent,#e8b563)';
                    txCount = 0;
                    statusEl.textContent = '';
                }
            }

            toggleBtn.addEventListener('click', () => setToggle(!autoEnabled));
            toggleWrap.appendChild(toggleBtn);
            toggleWrap.appendChild(statusEl);
            toggleRow.appendChild(toggleWrap);

            // Quick fill row
            const fillRow = document.createElement('div');
            fillRow.className = 'gc-market-field gcc-market-quickfill';

            const fillLabel = document.createElement('div');
            fillLabel.className = 'gc-market-field__label';
            fillLabel.textContent = 'Quick Fill';
            fillRow.appendChild(fillLabel);

            const btnWrap = document.createElement('div');
            btnWrap.className = 'gc-market-field__control';
            btnWrap.style.cssText = 'display:flex;gap:5px;flex-wrap:wrap;';

            const amounts = GCC_MARKET_PRESETS[activePreset];
            const panelBtns = amounts.map(({ label: lbl, value }) => {
                const btn = document.createElement('button');
                btn.type           = 'button';
                btn.textContent    = lbl;
                btn.dataset.mktValue = value;
                btn.style.cssText  = MKT_BTN;

                btn.addEventListener('mouseenter', () => { if (!autoEnabled) btn.style.background = 'var(--bg-elevated,#2a365a)'; });
                btn.addEventListener('mouseleave', () => { if (!autoEnabled) btn.style.background = 'var(--bg-surface,#1f2842)'; });

                btn.addEventListener('click', async () => {
                    const val = parseInt(btn.dataset.mktValue);
                    input.value = val;
                    ['input', 'change', 'keyup'].forEach(t =>
                        input.dispatchEvent(new Event(t, { bubbles: true }))
                    );
                    if (!autoEnabled) return;
                    btn.disabled = true;
                    btn.style.opacity = '0.5';
                    await submitTransaction(submitName);
                    txCount++;
                    statusEl.textContent = `${actionLabel} x${txCount}`;
                    btn.disabled = false;
                    btn.style.opacity = '1';
                });

                btnWrap.appendChild(btn);
                return btn;
            });

            allBtnGroups.push(panelBtns);
            fillRow.appendChild(btnWrap);
            return [toggleRow, fillRow];
        }

        const buyInput = document.querySelector('input.Mobile_Market_Buy');
        const buyPanel = document.querySelector('.gc-market-panel--buy');
        if (buyInput && buyPanel) {
            const actions = buyPanel.querySelector('.gc-market-panel__actions');
            if (actions) makePanel(buyInput, 'buyflag', 'Bought').forEach(row => buyPanel.insertBefore(row, actions));
        }

        const sellInput = document.querySelector('input.Mobile_Market_Sell');
        const sellPanel = document.querySelector('.gc-market-panel--sell');
        if (sellInput && sellPanel) {
            const actions = sellPanel.querySelector('.gc-market-panel__actions');
            if (actions) makePanel(sellInput, 'sellflag', 'Sold').forEach(row => sellPanel.insertBefore(row, actions));
        }
    });
}
