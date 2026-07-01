function addImportantEventsLink() {
    if (!/[?&]f=com/i.test(window.location.href)) return;

    const navBar = document.querySelector('.icon-bar2');
    if (!navBar) { console.log('[GC Helper] .icon-bar2 not found'); return; }

    if (navBar.querySelector('a[href*="f=com_empire"][href*="cm=4"]')) {
        console.log('[GC Helper] Important Events link already present, skipping');
        return;
    }

    const missionsLink = navBar.querySelector('a[href*="f=com_mission"]');
    console.log('[GC Helper] missions link:', missionsLink ? missionsLink.href : 'not found');

    const eventsLink = document.createElement('a');
    eventsLink.href = sid ? `i.cfm?&${sid}&f=com_empire&cm=4` : `i.cfm?f=com_empire&cm=4`;
    eventsLink.textContent = "Important Events";

    if (missionsLink) {
        navBar.insertBefore(eventsLink, missionsLink);
    } else {
        navBar.prepend(eventsLink);
    }

    console.log('[GC Helper] Important Events link inserted');

    const resourceBarBtn = document.querySelector('a.gc-action--primary[aria-label="Important Events"]');
    if (resourceBarBtn) resourceBarBtn.remove();
}

function addSimulationsLinks() {
    const container = document.querySelector('.icon-bar2');
    if (!container) return;
    if (document.getElementById('gcc-sim-links')) return;

    const wrapper = document.createElement('div');
    wrapper.id = 'gcc-sim-links';
    wrapper.style.display = 'flex';
    wrapper.style.flexWrap = 'wrap';
    wrapper.style.alignItems = 'center';
    wrapper.style.gap = '8px';
    wrapper.style.marginTop = '12px';
    wrapper.style.paddingTop = '10px';
    wrapper.style.borderTop = '1px solid var(--border)';

    const title = document.createElement('span');
    title.textContent = 'Simulations';
    title.style.color = 'var(--accent)';
    title.style.fontFamily = "'IBM Plex Mono', ui-monospace, 'SF Mono', Consolas, monospace";
    title.style.fontWeight = 'bold';
    title.style.lineHeight = '1.2';
    wrapper.appendChild(title);

    const links = [
        { text: 'drlat Sims', href: 'https://augury.drlat.dev' },
        { text: 'Cagito Sims', href: 'https://jsitor.com/profile/cagito2-stack' },
    ];

    links.forEach(linkData => {
        const a = document.createElement('a');
        a.href = linkData.href;
        a.target = '_blank';
        a.rel = 'noreferrer noopener';
        a.textContent = linkData.text;
        a.style.color = 'var(--text-primary)';
        a.style.textDecoration = 'none';
        a.style.fontWeight = 'normal';
        a.style.lineHeight = '1.2';
        a.addEventListener('mouseenter', () => a.style.color = '#f2c57a');
        a.addEventListener('mouseleave', () => a.style.color = 'var(--text-primary)');
        wrapper.appendChild(a);
    });

    container.appendChild(wrapper);
}
