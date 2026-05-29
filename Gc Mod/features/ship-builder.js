function addShipBuilderBatchButtons() {
    if (!window.location.href.includes('f=com_ship')) return;
    const controlsList = Array.from(document.querySelectorAll('.gc-builder-card__controls'));
    if (!controlsList.length) return;

    controlsList.forEach(controls => {
        if (controls.dataset.gccBatchButtonsAdded) return;
        const orig = controls.querySelector('button.gc-builder-adjust.gc-builder-adjust--add');
        if (!orig) return;

        const input = controls.querySelector('input.gc-builder-input, input[type="number"], input[type="text"], input[type="tel"], input:not([type])');
        if (!input) return;

        const createBatchButton = (label, amount) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'gcc-builder-batch-button';
            btn.textContent = label;
            btn.setAttribute('aria-label', `Increase by ${label} turns`);
            btn.style.marginLeft = '4px';
            btn.style.minWidth = '32px';
            btn.style.padding = '0 8px';
            btn.style.height = orig.offsetHeight ? `${orig.offsetHeight}px` : '28px';
            btn.style.border = '1px solid rgba(255,255,255,0.14)';
            btn.style.borderRadius = '4px';
            btn.style.background = '#145A32';
            btn.style.color = '#FFFFFF';
            btn.style.cursor = 'pointer';
            btn.style.font = '11.8px Arial, Helvetica, sans-serif';
            btn.style.fontWeight = '700';
            btn.addEventListener('click', () => {
                const current = parseInt(input.value, 10);
                const value = Number.isNaN(current) ? 0 : current;
                const card = controls.closest('.gc-builder-card');
                let rate = 1;
                if (card && card.dataset.turnStep) {
                    const parsed = parseInt(card.dataset.turnStep, 10);
                    if (!Number.isNaN(parsed) && parsed > 0) rate = parsed;
                }
                input.value = value + amount * rate;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
            });
            return btn;
        };

        const plus5 = createBatchButton('+5', 5);
        const plus10 = createBatchButton('+10', 10);
        orig.insertAdjacentElement('afterend', plus5);
        plus5.insertAdjacentElement('afterend', plus10);
        controls.dataset.gccBatchButtonsAdded = '1';
    });
}
