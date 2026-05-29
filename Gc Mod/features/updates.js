function isNewerVersion(latest, current) {
    const l = latest.split('.').map(Number);
    const c = current.split('.').map(Number);
    for (let i = 0; i < Math.max(l.length, c.length); i++) {
        const lv = l[i] || 0, cv = c[i] || 0;
        if (lv > cv) return true;
        if (lv < cv) return false;
    }
    return false;
}

async function checkForUpdates() {
    const banner = document.getElementById('gcc-update-banner');
    if (!banner) return;

    const repoOwner = "Jasper89c";
    const repoName = "Jaspers-GC-Mods";
    const githubLink = `https://github.com/${repoOwner}/${repoName}/releases`;

    const currentVersion = chrome.runtime.getManifest().version;

    try {
        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/releases/latest`);
        if (!response.ok) return;

        const data = await response.json();
        const latestVersion = data.tag_name.replace(/v/gi, '').trim();

        if (isNewerVersion(latestVersion, currentVersion)) {
            banner.innerHTML = `
                <div style="background: #ff9800; color: #000; font-size: 10px; font-weight: bold; text-align: center; padding: 6px; border-bottom: 1px solid #444; animation: pulse 2s infinite;">
                    ⚠️ New Version Available (v${latestVersion})<br>
                    <a href="${githubLink}" target="_blank" style="color: #004d40; text-decoration: underline; display: inline-block; margin-top: 3px;">Click here to download</a>
                </div>
                <style>
                    @keyframes pulse {
                        0% { opacity: 0.9; }
                        50% { opacity: 1; }
                        100% { opacity: 0.9; }
                    }
                </style>
            `;
        }
    } catch (e) {
        console.log("GC Mods Update Check Failed: ", e);
    }
}
