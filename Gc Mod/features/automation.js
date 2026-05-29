let lastExploreClick = 0;
let lastContinueClick = 0;
const CLICK_COOLDOWN_MS = 2000;

setInterval(function() {
    const now = Date.now();

    if (autoExploreEnabled && (now - lastExploreClick > CLICK_COOLDOWN_MS)) {
        const exploreBtn = document.querySelector('input[type="button"][onclick*="com_explore"]');
        if (exploreBtn) {
            lastExploreClick = now;
            exploreBtn.click();
        }
    }

    if (autoContinueEnabled && (now - lastContinueClick > CLICK_COOLDOWN_MS)) {
        const buttons = document.querySelectorAll('input[type="button"][onclick*="f=com_col"]');
        const btn = Array.from(buttons).find(b => b.value.trim().toLowerCase() === 'continue');
        if (btn) {
            lastContinueClick = now;
            btn.click();
        }
    }
}, 500);
