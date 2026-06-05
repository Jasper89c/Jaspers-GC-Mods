const GCC_THEME_ID = 'gcc-custom-theme';

function buildCSS(vars) {
    const all = { ...vars };
    // Auto-derive related vars from the primary ones
    if (vars['--accent']) {
        all['--accent-hover']   = vars['--accent'];
        all['--link']           = vars['--accent'];
        all['--link-visited']   = vars['--accent'];
        all['--link-hover']     = vars['--accent'];
        all['--stat-food']      = vars['--accent'];
    }
    if (vars['--accent-good'])  all['--stat-cash']  = vars['--accent-good'];
    if (vars['--accent-cool'])  all['--stat-power'] = vars['--accent-cool'];
    if (vars['--border'])       all['--border-strong'] = vars['--border'];

    const decls = Object.entries(all).map(([k, v]) => `  ${k}: ${v};`).join('\n');

    // Target all three data-theme selectors so we beat the game's own
    // body[data-theme="nebula"] rules (higher specificity than :root).
    // Our <style> is injected after theme.css so same-specificity wins by source order.
    return [
        ':root',
        'body[data-theme="nebula"]',
        'body[data-theme="classic"]',
        'body[data-theme="daylight"]',
    ].join(',\n') + ` {\n${decls}\n}`;
}

function applyTheme(vars) {
    let el = document.getElementById(GCC_THEME_ID);
    if (!el) {
        el = document.createElement('style');
        el.id = GCC_THEME_ID;
        document.head.appendChild(el);
    }
    el.textContent = buildCSS(vars);
}

function removeTheme() {
    document.getElementById(GCC_THEME_ID)?.remove();
}

chrome.storage.local.get(['customThemeEnabled', 'customThemeVars'], (res) => {
    if (res.customThemeEnabled && res.customThemeVars) {
        applyTheme(res.customThemeVars);
    }
});

chrome.storage.onChanged.addListener((changes, ns) => {
    if (ns !== 'local') return;
    if (!changes.customThemeEnabled && !changes.customThemeVars) return;
    chrome.storage.local.get(['customThemeEnabled', 'customThemeVars'], (res) => {
        if (res.customThemeEnabled && res.customThemeVars) {
            applyTheme(res.customThemeVars);
        } else {
            removeTheme();
        }
    });
});
