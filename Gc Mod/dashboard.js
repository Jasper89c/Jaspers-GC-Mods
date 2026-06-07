// dashboard.js - Comprehensive live storage listener with Menu toggles

// ─── Collapsible cards ────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const state = JSON.parse(localStorage.getItem('dash_collapsed') || '{}');

    document.querySelectorAll('.card').forEach(card => {
        const key = card.id || card.querySelector('.card-title')?.textContent?.trim();
        if (!key) return;

        const header = card.querySelector('.card-header');
        if (!header) return;

        function setCollapsed(collapsed) {
            card.classList.toggle('collapsed', collapsed);
            // card already has overflow:hidden — clamp to header height to collapse
            card.style.maxHeight = collapsed ? header.offsetHeight + 'px' : '';
        }

        setCollapsed(!!state[key]);

        header.addEventListener('click', () => {
            const nowCollapsed = !card.classList.contains('collapsed');
            setCollapsed(nowCollapsed);
            state[key] = nowCollapsed;
            localStorage.setItem('dash_collapsed', JSON.stringify(state));
        });
    });
});
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get([
        'assimEnabled', 'infectEnabled', 'fedLazy', 'fedFull',
        'clusterCollapsed', 'similareCollapsed', 'viralCollapsed', 'autoContinue',
        'autoExplore', 'simsLinksEnabled', 'importantEventsLinkEnabled', 'chatFeatureEnabled',
        'batchButtonsEnabled', 'quickBuildEnabled', 'battleLogsEnabled', 'marketQuickFillEnabled'
    ], (res) => {

        // 1. Assimilate Status Card Badge
        const assimStatus = document.getElementById('dash-assim-status');
        if (assimStatus) {
            if (res.assimEnabled) {
                assimStatus.textContent = "Active";
                assimStatus.classList.add('active');
            } else {
                assimStatus.textContent = "Disabled";
            }
        }

        // 2. Infect Status Card Badge
        const infectStatus = document.getElementById('dash-infect-status');
        if (infectStatus) {
            if (res.infectEnabled) {
                infectStatus.textContent = "Active";
                infectStatus.classList.add('active');
            } else {
                infectStatus.textContent = "Disabled";
            }
        }

        // 3. Federation Intelligence Mapping Card Badge
        const fedStatus = document.getElementById('dash-fed-status');
        if (fedStatus) {
            if (res.fedFull) {
                fedStatus.textContent = "Active (Full Load)";
                fedStatus.classList.add('active');
            } else if (res.fedLazy) {
                fedStatus.textContent = "Active (Lazy Hover)";
                fedStatus.classList.add('active');
            } else {
                fedStatus.textContent = "Disabled";
            }
        }

        // 4. NEW: Core Helper Section Visibility Switches
        const hideRegularCheck = document.getElementById('dash-hide-regular');
        const hideCollectiveCheck = document.getElementById('dash-hide-collective');
        const hideViralCheck = document.getElementById('dash-hide-viral');

        // Check the boxes if the sections are NOT collapsed (visible)
        if (hideRegularCheck) {
            hideRegularCheck.checked = !res.clusterCollapsed;
            hideRegularCheck.addEventListener('change', () => {
                chrome.storage.local.set({ clusterCollapsed: !hideRegularCheck.checked });
            });
        }

        if (hideCollectiveCheck) {
            hideCollectiveCheck.checked = !res.similareCollapsed;
            hideCollectiveCheck.addEventListener('change', () => {
                chrome.storage.local.set({ similareCollapsed: !hideCollectiveCheck.checked });
            });
        }

        if (hideViralCheck) {
            hideViralCheck.checked = !res.viralCollapsed;
            hideViralCheck.addEventListener('change', () => {
                chrome.storage.local.set({ viralCollapsed: !hideViralCheck.checked });
            });
        }

        // =================================================================
        // 5. FIXED: Auto Click Automation Switches
        // =================================================================
        const autoContinueCheck = document.getElementById('dash-auto-continue');
        const autoExploreCheck = document.getElementById('dash-auto-explore');

        if (autoContinueCheck) {
            // If autoContinue isn't explicitly false, default it to true (ON)
            autoContinueCheck.checked = (res.autoContinue !== false);

            autoContinueCheck.addEventListener('change', () => {
                // Save exactly what the checkbox says: checked = true, unchecked = false
                chrome.storage.local.set({ autoContinue: autoContinueCheck.checked });
            });
        }

        if (autoExploreCheck) {
            // If autoExplore isn't explicitly false, default it to true (ON)
            autoExploreCheck.checked = (res.autoExplore !== false);

            autoExploreCheck.addEventListener('change', () => {
                // Save exactly what the checkbox says: checked = true, unchecked = false
                chrome.storage.local.set({ autoExplore: autoExploreCheck.checked });
            });
        }
        // =================================================================
        // 6. MIGRATED: Feature & Intel Toggle Controls
        // =================================================================
        const assimCheck = document.getElementById('dash-assim-toggle');
        const infectCheck = document.getElementById('dash-infect-toggle');
        const fedLazyCheck = document.getElementById('dash-fed-lazy');
        const fedFullCheck = document.getElementById('dash-fed-full');

        // Synchronize check states based on saved memory keys
        if (assimCheck) {
            assimCheck.checked = !!res.assimEnabled;
            assimCheck.addEventListener('change', () => {
                chrome.storage.local.set({ assimEnabled: assimCheck.checked });
            });
        }

        if (infectCheck) {
            infectCheck.checked = !!res.infectEnabled;
            infectCheck.addEventListener('change', () => {
                chrome.storage.local.set({ infectEnabled: infectCheck.checked });
            });
        }

        if (fedLazyCheck) {
            fedLazyCheck.checked = !!res.fedLazy;
            fedLazyCheck.addEventListener('change', () => {
                // If turning on Lazy Load, uncheck Full Load to prevent conflict
                if (fedLazyCheck.checked && fedFullCheck) fedFullCheck.checked = false;
                chrome.storage.local.set({
                    fedLazy: fedLazyCheck.checked,
                    fedFull: fedFullCheck ? fedFullCheck.checked : false
                });
            });
        }

        if (fedFullCheck) {
            fedFullCheck.checked = !!res.fedFull;
            fedFullCheck.addEventListener('change', () => {
                // If turning on Full Load, uncheck Lazy Load to prevent conflict
                if (fedFullCheck.checked && fedLazyCheck) fedLazyCheck.checked = false;
                chrome.storage.local.set({
                    fedFull: fedFullCheck.checked,
                    fedLazy: fedLazyCheck ? fedLazyCheck.checked : false
                });
            });
        }
        // --- SIMULATIONS LINKS AUTOMATION HANDLE ---
        const eventsLinkCheck = document.getElementById('dash-events-toggle');
        if (eventsLinkCheck) {
            eventsLinkCheck.checked = (res.importantEventsLinkEnabled !== false);
            eventsLinkCheck.addEventListener('change', () => {
                chrome.storage.local.set({ importantEventsLinkEnabled: eventsLinkCheck.checked });
            });
        }

        const simsLinksCheck = document.getElementById('dash-sims-toggle');
        if (simsLinksCheck) {
            simsLinksCheck.checked = (res.simsLinksEnabled !== false);
            simsLinksCheck.addEventListener('change', () => {
                chrome.storage.local.set({ simsLinksEnabled: simsLinksCheck.checked });
            });
        }

        // --- CHAT FEATURE AUTOMATION HANDLE ---
        const chatToggleCheck = document.getElementById('dash-chat-toggle');
        if (chatToggleCheck) {
            // Defaults to true (ON) if it hasn't been set yet
            chatToggleCheck.checked = (res.chatFeatureEnabled !== false);

            chatToggleCheck.addEventListener('change', () => {
                chrome.storage.local.set({ chatFeatureEnabled: chatToggleCheck.checked });
            });
        }

        const batchToggleCheck = document.getElementById('dash-batch-toggle');
        if (batchToggleCheck) {
            batchToggleCheck.checked = (res.batchButtonsEnabled !== false);
            batchToggleCheck.addEventListener('change', () => {
                chrome.storage.local.set({ batchButtonsEnabled: batchToggleCheck.checked });
            });
        }

        const quickBuildCheck = document.getElementById('dash-quick-build');
        if (quickBuildCheck) {
            quickBuildCheck.checked = (res.quickBuildEnabled !== false);
            quickBuildCheck.addEventListener('change', () => {
                chrome.storage.local.set({ quickBuildEnabled: quickBuildCheck.checked });
            });
        }

        const battleLogsCheck = document.getElementById('dash-battle-logs');
        if (battleLogsCheck) {
            battleLogsCheck.checked = (res.battleLogsEnabled !== false);
            battleLogsCheck.addEventListener('change', () => {
                chrome.storage.local.set({ battleLogsEnabled: battleLogsCheck.checked });
            });
        }

        const marketQuickFillCheck = document.getElementById('dash-market-quickfill');
        if (marketQuickFillCheck) {
            marketQuickFillCheck.checked = (res.marketQuickFillEnabled !== false);
            marketQuickFillCheck.addEventListener('change', () => {
                chrome.storage.local.set({ marketQuickFillEnabled: marketQuickFillCheck.checked });
            });
        }
    });
});

// ─── Custom Theme ─────────────────────────────────────────────────────────────

const THEME_PRESETS = [
    {
        name: 'Deep Space',
        vars: {
            '--bg-base':      '#04060f',
            '--bg-surface':   '#0a1428',
            '--bg-elevated':  '#102040',
            '--text-primary': '#dceeff',
            '--text-muted':   '#5a80aa',
            '--accent':       '#00a8ff',
            '--accent-hot':   '#ff4466',
            '--accent-good':  '#00ffaa',
            '--accent-cool':  '#00a8ff',
            '--border':       '#1a3a60',
        },
    },
    {
        name: 'Solar Flare',
        vars: {
            '--bg-base':      '#0d0500',
            '--bg-surface':   '#1c0c00',
            '--bg-elevated':  '#2c1500',
            '--text-primary': '#fff5e0',
            '--text-muted':   '#a07040',
            '--accent':       '#ff8c00',
            '--accent-hot':   '#ff3300',
            '--accent-good':  '#88cc44',
            '--accent-cool':  '#ffcc00',
            '--border':       '#4a2000',
        },
    },
    {
        name: 'Void',
        vars: {
            '--bg-base':      '#050010',
            '--bg-surface':   '#0e0025',
            '--bg-elevated':  '#180038',
            '--text-primary': '#ecdeff',
            '--text-muted':   '#6644aa',
            '--accent':       '#b06aff',
            '--accent-hot':   '#ff4488',
            '--accent-good':  '#44ff99',
            '--accent-cool':  '#7799ff',
            '--border':       '#2a0a5a',
        },
    },
    {
        name: 'Aurora',
        vars: {
            '--bg-base':      '#000f0a',
            '--bg-surface':   '#001f14',
            '--bg-elevated':  '#003020',
            '--text-primary': '#ccffee',
            '--text-muted':   '#3a8866',
            '--accent':       '#00ffcc',
            '--accent-hot':   '#ff5566',
            '--accent-good':  '#00ffcc',
            '--accent-cool':  '#00ccff',
            '--border':       '#005540',
        },
    },
    {
        name: 'Red Giant',
        vars: {
            '--bg-base':      '#100404',
            '--bg-surface':   '#200808',
            '--bg-elevated':  '#301010',
            '--text-primary': '#ffe8e0',
            '--text-muted':   '#885555',
            '--accent':       '#ff5533',
            '--accent-hot':   '#ff1100',
            '--accent-good':  '#55ff88',
            '--accent-cool':  '#ff9966',
            '--border':       '#551515',
        },
    },
    {
        name: 'Pulsar',
        vars: {
            '--bg-base':      '#000a00',
            '--bg-surface':   '#001a00',
            '--bg-elevated':  '#002800',
            '--text-primary': '#e0ffe0',
            '--text-muted':   '#3a8a3a',
            '--accent':       '#00ff44',
            '--accent-hot':   '#ff4400',
            '--accent-good':  '#00ff44',
            '--accent-cool':  '#00ffcc',
            '--border':       '#005500',
        },
    },
    {
        name: 'Ice Planet',
        vars: {
            '--bg-base':      '#050d18',
            '--bg-surface':   '#0a1828',
            '--bg-elevated':  '#102030',
            '--text-primary': '#e8f8ff',
            '--text-muted':   '#6090b0',
            '--accent':       '#88ddff',
            '--accent-hot':   '#ff6644',
            '--accent-good':  '#44ffcc',
            '--accent-cool':  '#88ddff',
            '--border':       '#1a3040',
        },
    },
    {
        name: 'Cosmic Dust',
        vars: {
            '--bg-base':      '#100810',
            '--bg-surface':   '#1e0f20',
            '--bg-elevated':  '#2e1838',
            '--text-primary': '#f0e8ff',
            '--text-muted':   '#806888',
            '--accent':       '#cc88ff',
            '--accent-hot':   '#ff6688',
            '--accent-good':  '#88ffcc',
            '--accent-cool':  '#88aaff',
            '--border':       '#402050',
        },
    },
    {
        name: 'Supernova',
        vars: {
            '--bg-base':      '#0a0800',
            '--bg-surface':   '#1a1400',
            '--bg-elevated':  '#2a2000',
            '--text-primary': '#fffde8',
            '--text-muted':   '#908060',
            '--accent':       '#ffd700',
            '--accent-hot':   '#ff6600',
            '--accent-good':  '#99ff44',
            '--accent-cool':  '#ffe066',
            '--border':       '#4a3a00',
        },
    },
    {
        name: 'Wormhole',
        vars: {
            '--bg-base':      '#00100e',
            '--bg-surface':   '#001e1a',
            '--bg-elevated':  '#003028',
            '--text-primary': '#ccfffa',
            '--text-muted':   '#368878',
            '--accent':       '#00e5cc',
            '--accent-hot':   '#ff4466',
            '--accent-good':  '#00e5cc',
            '--accent-cool':  '#00ccff',
            '--border':       '#005544',
        },
    },
    {
        name: 'Black Hole',
        vars: {
            '--bg-base':      '#000000',
            '--bg-surface':   '#050005',
            '--bg-elevated':  '#0d000d',
            '--text-primary': '#ddd8ff',
            '--text-muted':   '#443355',
            '--accent':       '#9955ff',
            '--accent-hot':   '#ff2255',
            '--accent-good':  '#55ff99',
            '--accent-cool':  '#7755ff',
            '--border':       '#220033',
        },
    },
    {
        name: 'Andromeda',
        vars: {
            '--bg-base':      '#060410',
            '--bg-surface':   '#100820',
            '--bg-elevated':  '#1a1030',
            '--text-primary': '#ffe8f0',
            '--text-muted':   '#806878',
            '--accent':       '#ff99aa',
            '--accent-hot':   '#ff4466',
            '--accent-good':  '#99ffcc',
            '--accent-cool':  '#aaccff',
            '--border':       '#3a1840',
        },
    },
    {
        name: 'Titan',
        vars: {
            '--bg-base':      '#0e0800',
            '--bg-surface':   '#1e1000',
            '--bg-elevated':  '#301800',
            '--text-primary': '#ffe8cc',
            '--text-muted':   '#a07040',
            '--accent':       '#ff9944',
            '--accent-hot':   '#ff5500',
            '--accent-good':  '#88cc44',
            '--accent-cool':  '#ffcc88',
            '--border':       '#4a2800',
        },
    },
    {
        name: 'Cryo',
        vars: {
            '--bg-base':      '#040810',
            '--bg-surface':   '#08101e',
            '--bg-elevated':  '#0e182a',
            '--text-primary': '#d8eeff',
            '--text-muted':   '#4a6880',
            '--accent':       '#66ccff',
            '--accent-hot':   '#ff4455',
            '--accent-good':  '#44ffdd',
            '--accent-cool':  '#66ccff',
            '--border':       '#1a3050',
        },
    },
    {
        name: 'Quasar',
        vars: {
            '--bg-base':      '#000005',
            '--bg-surface':   '#05050f',
            '--bg-elevated':  '#0a0a20',
            '--text-primary': '#eeeeff',
            '--text-muted':   '#6666aa',
            '--accent':       '#66aaff',
            '--accent-hot':   '#ff3366',
            '--accent-good':  '#33ffdd',
            '--accent-cool':  '#99ccff',
            '--border':       '#151530',
        },
    },
    {
        name: 'Mars Colony',
        vars: {
            '--bg-base':      '#120500',
            '--bg-surface':   '#220900',
            '--bg-elevated':  '#331000',
            '--text-primary': '#ffddb8',
            '--text-muted':   '#885540',
            '--accent':       '#dd5522',
            '--accent-hot':   '#ff2200',
            '--accent-good':  '#88dd44',
            '--accent-cool':  '#ee8844',
            '--border':       '#551800',
        },
    },
    {
        name: 'Stellar Nursery',
        vars: {
            '--bg-base':      '#0f0010',
            '--bg-surface':   '#1e0022',
            '--bg-elevated':  '#2d0033',
            '--text-primary': '#ffe0ff',
            '--text-muted':   '#886688',
            '--accent':       '#ff55dd',
            '--accent-hot':   '#ff2266',
            '--accent-good':  '#88ffcc',
            '--accent-cool':  '#bb88ff',
            '--border':       '#550055',
        },
    },
    {
        name: 'Dark Energy',
        vars: {
            '--bg-base':      '#05000a',
            '--bg-surface':   '#0a0015',
            '--bg-elevated':  '#110020',
            '--text-primary': '#e8d8ff',
            '--text-muted':   '#5533aa',
            '--accent':       '#8844ee',
            '--accent-hot':   '#ee3377',
            '--accent-good':  '#44ee99',
            '--accent-cool':  '#6677ff',
            '--border':       '#220044',
        },
    },
    {
        name: 'Gamma Burst',
        vars: {
            '--bg-base':      '#040800',
            '--bg-surface':   '#0a1200',
            '--bg-elevated':  '#121e00',
            '--text-primary': '#f0ffcc',
            '--text-muted':   '#668844',
            '--accent':       '#aaff00',
            '--accent-hot':   '#ff6600',
            '--accent-good':  '#aaff00',
            '--accent-cool':  '#66ff88',
            '--border':       '#2a4400',
        },
    },
    {
        name: 'Ion Drive',
        vars: {
            '--bg-base':      '#000a12',
            '--bg-surface':   '#001424',
            '--bg-elevated':  '#002038',
            '--text-primary': '#d0f0ff',
            '--text-muted':   '#335577',
            '--accent':       '#0088ff',
            '--accent-hot':   '#ff4466',
            '--accent-good':  '#00ffaa',
            '--accent-cool':  '#0088ff',
            '--border':       '#003366',
        },
    },
    {
        name: 'Exoplanet',
        vars: {
            '--bg-base':      '#000818',
            '--bg-surface':   '#001030',
            '--bg-elevated':  '#001848',
            '--text-primary': '#ccffff',
            '--text-muted':   '#336688',
            '--accent':       '#00ffee',
            '--accent-hot':   '#ff6644',
            '--accent-good':  '#00ffee',
            '--accent-cool':  '#0099ff',
            '--border':       '#003366',
        },
    },
    {
        name: 'Derelict',
        vars: {
            '--bg-base':      '#080a08',
            '--bg-surface':   '#0e120e',
            '--bg-elevated':  '#141c14',
            '--text-primary': '#c8d4b8',
            '--text-muted':   '#5a6a4a',
            '--accent':       '#88aa66',
            '--accent-hot':   '#cc4422',
            '--accent-good':  '#88cc66',
            '--accent-cool':  '#6699aa',
            '--border':       '#2a3a20',
        },
    },
    {
        name: 'Binary Star',
        vars: {
            '--bg-base':      '#050510',
            '--bg-surface':   '#0a0a20',
            '--bg-elevated':  '#121230',
            '--text-primary': '#fff5e8',
            '--text-muted':   '#806858',
            '--accent':       '#ffcc44',
            '--accent-hot':   '#ff6600',
            '--accent-good':  '#44ffcc',
            '--accent-cool':  '#44aaff',
            '--border':       '#2a2040',
        },
    },
    {
        name: 'Proto Star',
        vars: {
            '--bg-base':      '#0a0300',
            '--bg-surface':   '#180600',
            '--bg-elevated':  '#260a00',
            '--text-primary': '#ffeedd',
            '--text-muted':   '#996644',
            '--accent':       '#ff6600',
            '--accent-hot':   '#ff2200',
            '--accent-good':  '#66ff44',
            '--accent-cool':  '#ff9933',
            '--border':       '#441800',
        },
    },
    {
        name: 'Magnetar',
        vars: {
            '--bg-base':      '#020510',
            '--bg-surface':   '#050a20',
            '--bg-elevated':  '#080f30',
            '--text-primary': '#eef4ff',
            '--text-muted':   '#5566aa',
            '--accent':       '#aaccff',
            '--accent-hot':   '#ff3355',
            '--accent-good':  '#44ffcc',
            '--accent-cool':  '#aaccff',
            '--border':       '#1a2250',
        },
    },
    {
        name: 'Ceres',
        vars: {
            '--bg-base':      '#0a0a0c',
            '--bg-surface':   '#141416',
            '--bg-elevated':  '#1e1e22',
            '--text-primary': '#e8e4d8',
            '--text-muted':   '#706a58',
            '--accent':       '#ccaa55',
            '--accent-hot':   '#cc4422',
            '--accent-good':  '#88cc66',
            '--accent-cool':  '#8899cc',
            '--border':       '#363028',
        },
    },
    {
        name: 'Nebula Rose',
        vars: {
            '--bg-base':      '#0d0608',
            '--bg-surface':   '#1a0c10',
            '--bg-elevated':  '#271218',
            '--text-primary': '#ffe8ee',
            '--text-muted':   '#886670',
            '--accent':       '#ff88aa',
            '--accent-hot':   '#ff3355',
            '--accent-good':  '#88ffcc',
            '--accent-cool':  '#ffaacc',
            '--border':       '#441828',
        },
    },
    {
        name: 'Grav Wave',
        vars: {
            '--bg-base':      '#060608',
            '--bg-surface':   '#0e0e12',
            '--bg-elevated':  '#16161c',
            '--text-primary': '#e8e8f0',
            '--text-muted':   '#666680',
            '--accent':       '#aaaacc',
            '--accent-hot':   '#ff4455',
            '--accent-good':  '#66ffaa',
            '--accent-cool':  '#8888ff',
            '--border':       '#222236',
        },
    },
    {
        name: 'Hawking',
        vars: {
            '--bg-base':      '#000006',
            '--bg-surface':   '#04040f',
            '--bg-elevated':  '#080818',
            '--text-primary': '#e8eeff',
            '--text-muted':   '#444488',
            '--accent':       '#4488ff',
            '--accent-hot':   '#ff8800',
            '--accent-good':  '#44ffcc',
            '--accent-cool':  '#88aaff',
            '--border':       '#111144',
        },
    },
];

const NEBULA_DEFAULTS = {
    '--bg-base':      '#0c1018',
    '--bg-surface':   '#1f2842',
    '--bg-elevated':  '#2a365a',
    '--text-primary': '#f1eee8',
    '--text-muted':   '#8890a8',
    '--accent':       '#e8b563',
    '--accent-hot':   '#ec6262',
    '--accent-good':  '#7fc592',
    '--accent-cool':  '#7dbff2',
    '--border':       '#334b75',
};

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['customThemeEnabled', 'customThemeVars'], (res) => {
        const enabledCheck = document.getElementById('dash-theme-enabled');
        const vars = res.customThemeVars || { ...NEBULA_DEFAULTS };

        // Render preset buttons
        const presetsRow = document.getElementById('theme-presets-row');
        if (presetsRow) {
            THEME_PRESETS.forEach(preset => {
                const btn = document.createElement('button');
                btn.className = 'theme-preset-btn';

                const swatches = document.createElement('div');
                swatches.className = 'theme-preset-swatches';
                [preset.vars['--bg-surface'], preset.vars['--accent'], preset.vars['--text-primary']].forEach(color => {
                    const s = document.createElement('div');
                    s.className = 'theme-preset-swatch';
                    s.style.background = color;
                    swatches.appendChild(s);
                });

                btn.appendChild(swatches);
                btn.appendChild(document.createTextNode(preset.name));

                btn.addEventListener('click', () => {
                    Object.keys(NEBULA_DEFAULTS).forEach(key => {
                        const input = document.getElementById('tc-' + key);
                        if (input) input.value = preset.vars[key] || NEBULA_DEFAULTS[key];
                    });
                    const enabledCheck = document.getElementById('dash-theme-enabled');
                    if (enabledCheck) enabledCheck.checked = true;
                    chrome.storage.local.set({
                        customThemeVars:    { ...preset.vars },
                        customThemeEnabled: true,
                    });
                });

                presetsRow.appendChild(btn);
            });
        }

        // Populate pickers with saved or default values
        Object.keys(NEBULA_DEFAULTS).forEach(key => {
            const input = document.getElementById('tc-' + key);
            if (input) input.value = vars[key] || NEBULA_DEFAULTS[key];
        });

        if (enabledCheck) {
            enabledCheck.checked = !!res.customThemeEnabled;
            enabledCheck.addEventListener('change', () => {
                chrome.storage.local.set({ customThemeEnabled: enabledCheck.checked });
            });
        }

        function saveVars() {
            const current = {};
            Object.keys(NEBULA_DEFAULTS).forEach(key => {
                const input = document.getElementById('tc-' + key);
                if (input) current[key] = input.value;
            });
            chrome.storage.local.set({ customThemeVars: current });
        }

        Object.keys(NEBULA_DEFAULTS).forEach(key => {
            const input = document.getElementById('tc-' + key);
            if (input) input.addEventListener('input', saveVars);
        });

        const resetBtn = document.getElementById('theme-reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                Object.keys(NEBULA_DEFAULTS).forEach(key => {
                    const input = document.getElementById('tc-' + key);
                    if (input) input.value = NEBULA_DEFAULTS[key];
                });
                chrome.storage.local.set({ customThemeVars: { ...NEBULA_DEFAULTS } });
            });
        }
    });
});

// ─── Session Log ──────────────────────────────────────────────────────────────

function logFormatDuration(ms) {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    if (h > 0) return `${h}h ${m % 60}m`;
    if (m > 0) return `${m}m`;
    return `${s}s`;
}

function logFormatDelta(delta) {
    if (delta === null || delta === undefined || isNaN(delta)) return null;
    const abs = Math.abs(delta);
    let str;
    if (abs >= 1e9)      str = (abs / 1e9).toFixed(2) + 'B';
    else if (abs >= 1e6) str = (abs / 1e6).toFixed(2) + 'M';
    else if (abs >= 1e3) str = (abs / 1e3).toFixed(1) + 'K';
    else                 str = abs.toLocaleString();
    return (delta >= 0 ? '+' : '−') + str;
}

function logSetStat(id, value, isTurns) {
    const el = document.getElementById(id);
    if (!el) return;
    if (!value && value !== 0) { el.textContent = '—'; el.className = 'log-stat__value neutral'; return; }
    el.textContent = isTurns ? value : logFormatDelta(value);
    el.className   = 'log-stat__value ' + (value > 0 ? 'positive' : value < 0 ? 'negative' : 'neutral');
}

function renderSessionLog() {
    chrome.storage.local.get(['sessionStart', 'sessionTotals'], (res) => {
        const playtime = document.getElementById('log-playtime');
        if (playtime) {
            playtime.textContent = res.sessionStart ? logFormatDuration(Date.now() - res.sessionStart) : '—';
        }

        const t = res.sessionTotals || {};
        logSetStat('log-turns',    t.turns,    true);
        logSetStat('log-cash',     t.cash,     false);
        logSetStat('log-food',     t.food,     false);
        logSetStat('log-goods',    t.goods,    false);
        logSetStat('log-minerals', t.minerals, false);
        logSetStat('log-ore',      t.ore,      false);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderSessionLog();
    setInterval(renderSessionLog, 5000);

    document.getElementById('logs-reset-btn')?.addEventListener('click', () => {
        chrome.storage.local.remove(['sessionStart', 'sessionTotals'], renderSessionLog);
    });
});

// ─── Split View ───────────────────────────────────────────────────────────────

const SV_PAGES = [
    { label: '— None —',        value: '' },
    { label: 'Important Events',value: 'com_empire&cm=4' },
    { label: 'Empire Summary',  value: 'com_empire&cm=3' },
    { label: 'Income',          value: 'com_income' },
    { label: 'Missions',        value: 'com_mission' },
    { label: 'Manage Colonies', value: 'com_col' },
    { label: 'Projects',        value: 'com_project' },
    { label: 'Market',          value: 'com_market' },
    { label: 'Explore',         value: 'com_explore' },
    { label: 'Research',        value: 'com_research' },
    { label: 'Artifacts',       value: 'com_market_use' },
    { label: 'Build Ships',     value: 'com_ship' },
    { label: 'Manage Fleet',    value: 'com_disband' },
    { label: 'Intelligence',    value: 'com_intel' },
    { label: 'Attack',          value: 'com_attack' },
    { label: 'Battle Logs',     value: 'com_attack_prev' },
    { label: 'Federation',      value: 'fed' },
    { label: 'Fed Discussion',  value: 'fed_forum' },
    { label: 'Rankings (Top)',   value: 'rank' },
    { label: 'Rankings (Planets)', value: 'rank&ty=1' },
    { label: 'Rankings (Stats)', value: 'rank_s' },
    { label: 'Rankings (Near me)', value: 'rank2' },
    { label: 'Options',         value: 'option' },
    { label: 'Messages',        value: 'pm' },
];

const SV_LAYOUTS = {
    1: [],
    2: [
        { id: 'cols',      label: 'Side by side' },
        { id: 'rows',      label: 'Top / bottom' },
    ],
    3: [
        { id: 'cols',      label: 'Side by side' },
        { id: 'rows',      label: 'Top / bottom' },
        { id: 'main-side', label: 'Main + sidebar' },
    ],
    4: [
        { id: 'cols',      label: 'Side by side' },
        { id: 'rows',      label: 'Top / bottom' },
        { id: 'grid',      label: '2×2 Grid' },
        { id: 'main-side', label: 'Main + sidebar' },
    ],
};

function svLayoutIcon(id, count) {
    const W = 34, H = 22, G = 1.5;
    const rects = [];

    if (id === 'cols') {
        const w = (W - G * (count - 1)) / count;
        for (let i = 0; i < count; i++) rects.push([i * (w + G), 0, w, H]);
    } else if (id === 'rows') {
        const h = (H - G * (count - 1)) / count;
        for (let i = 0; i < count; i++) rects.push([0, i * (h + G), W, h]);
    } else if (id === 'grid') {
        const hw = (W - G) / 2, hh = (H - G) / 2;
        [[0, 0], [hw + G, 0], [0, hh + G], [hw + G, hh + G]].forEach(([x, y]) => rects.push([x, y, hw, hh]));
    } else if (id === 'main-side') {
        const mw = W * 0.62, sw = W - mw - G;
        const sc = Math.max(1, count - 1), sh = (H - G * (sc - 1)) / sc;
        rects.push([0, 0, mw, H]);
        for (let i = 0; i < sc; i++) rects.push([mw + G, i * (sh + G), sw, sh]);
    }

    const rs = rects.map(([x, y, w, h]) =>
        `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="1.5" fill="currentColor" opacity=".55"/>`
    ).join('');
    return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${rs}</svg>`;
}

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(
        ['splitViewCount', 'splitViewLayout', 'splitViewPages'],
        ({ splitViewCount, splitViewLayout, splitViewPages }) => {
            let svCount  = Math.min(4, Math.max(1, parseInt(splitViewCount) || 2));
            let svLayout = splitViewLayout || 'cols';
            let svPages  = Array.isArray(splitViewPages) ? splitViewPages : [];

            const layoutRow = document.getElementById('sv-layout-row');
            const pagesRow  = document.getElementById('sv-pages-row');

            // ── Count buttons ──────────────────────────────────────────────
            const countBtns = document.querySelectorAll('[data-sv-count]');

            function syncCountBtns() {
                countBtns.forEach(b => b.classList.toggle('active', parseInt(b.dataset.svCount) === svCount));
            }
            syncCountBtns();

            countBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    svCount = parseInt(btn.dataset.svCount);
                    syncCountBtns();
                    const layouts = SV_LAYOUTS[svCount];
                    if (layouts.length && !layouts.find(l => l.id === svLayout)) {
                        svLayout = layouts[0].id;
                    }
                    renderLayoutTiles();
                    renderPageSelects();
                    save();
                });
            });

            // ── Layout tiles ───────────────────────────────────────────────
            function renderLayoutTiles() {
                layoutRow.querySelectorAll('.sv-layout-tile, .sv-layout-note').forEach(el => el.remove());
                const layouts = SV_LAYOUTS[svCount];

                if (!layouts || layouts.length === 0) {
                    const note = document.createElement('span');
                    note.className   = 'sv-layout-note';
                    note.textContent = 'Single pane — no layout needed';
                    layoutRow.appendChild(note);
                    return;
                }

                layouts.forEach(({ id, label }) => {
                    const tile = document.createElement('button');
                    tile.className = 'sv-layout-tile' + (svLayout === id ? ' active' : '');
                    tile.innerHTML = svLayoutIcon(id, svCount) + `<span>${label}</span>`;
                    tile.addEventListener('click', () => {
                        svLayout = id;
                        renderLayoutTiles();
                        save();
                    });
                    layoutRow.appendChild(tile);
                });
            }
            renderLayoutTiles();

            // ── Page selects ───────────────────────────────────────────────
            function renderPageSelects() {
                pagesRow.innerHTML = '';
                for (let i = 0; i < svCount; i++) {
                    const group = document.createElement('div');
                    group.className = 'sv-page-group';

                    const lbl = document.createElement('label');
                    lbl.textContent = `Pane ${i + 1}`;
                    group.appendChild(lbl);

                    const sel = document.createElement('select');
                    SV_PAGES.forEach(({ label, value }) => {
                        const opt = document.createElement('option');
                        opt.value       = value;
                        opt.textContent = label;
                        if (value === (svPages[i] || '')) opt.selected = true;
                        sel.appendChild(opt);
                    });
                    sel.addEventListener('change', () => {
                        svPages[i] = sel.value;
                        save();
                    });
                    group.appendChild(sel);
                    pagesRow.appendChild(group);
                }
            }
            renderPageSelects();

            // ── Persist ────────────────────────────────────────────────────
            function save() {
                chrome.storage.local.set({
                    splitViewCount:  svCount,
                    splitViewLayout: svLayout,
                    splitViewPages:  svPages.slice(0, svCount),
                });
            }

            // ── Open button ────────────────────────────────────────────────
            document.getElementById('sv-open-btn').addEventListener('click', () => {
                window.open(chrome.runtime.getURL('splitview.html'), '_blank');
            });
        }
    );
});