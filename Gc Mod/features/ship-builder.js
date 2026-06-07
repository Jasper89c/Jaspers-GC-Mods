function addShipBuilderBatchButtons() {
    if (!window.location.href.includes('f=com_ship')) return;
    const controlsList = Array.from(document.querySelectorAll('.gc-builder-card__controls'));
    if (!controlsList.length) return;

    const parseNum = (str) => {
        if (str == null) return NaN;
        return parseFloat(String(str).replace(/[^0-9.\-]/g, ''));
    };

    // Current total power rating for a card. Prefer the displayed PR, fall back
    // to power-per-ship * owned count.
    const getRowPower = (card) => {
        const el = card.querySelector('.gc-builder-rowpower');
        if (el) {
            const n = parseNum(el.textContent);
            if (!Number.isNaN(n)) return n;
        }
        const perShip = parseNum(card.dataset.power);
        const owned = parseNum(card.dataset.currentShips);
        if (!Number.isNaN(perShip) && !Number.isNaN(owned)) return perShip * owned;
        return NaN;
    };

    // All visible cards in *visual* order (the DOM is not in display order,
    // cards are reordered via data-ui-order).
    const getSortedCards = () => {
        return Array.from(document.querySelectorAll('.gc-builder-card'))
            .filter(c => c.offsetParent !== null)
            .sort((a, b) => {
                const ra = a.getBoundingClientRect();
                const rb = b.getBoundingClientRect();
                if (Math.abs(ra.top - rb.top) > 1) return ra.top - rb.top;
                return ra.left - rb.left;
            });
    };

    // The card directly above this one in visual order.
    const findRowAbove = (card) => {
        const all = getSortedCards();
        const idx = all.indexOf(card);
        return idx > 0 ? all[idx - 1] : null;
    };

    // The topmost card in visual order (null if this card is already the top).
    const findTopRow = (card) => {
        const all = getSortedCards();
        const top = all[0];
        return top && top !== card ? top : null;
    };

    const styleButton = (btn, orig, label, ariaLabel, background) => {
        btn.type = 'button';
        btn.textContent = label;
        btn.setAttribute('aria-label', ariaLabel);
        btn.style.marginLeft = '4px';
        btn.style.minWidth = '32px';
        btn.style.padding = '0 8px';
        btn.style.height = orig.offsetHeight ? `${orig.offsetHeight}px` : '28px';
        btn.style.border = '1px solid rgba(255,255,255,0.14)';
        btn.style.borderRadius = '4px';
        btn.style.background = background;
        btn.style.color = '#FFFFFF';
        btn.style.cursor = 'pointer';
        btn.style.font = '11.8px Arial, Helvetica, sans-serif';
        btn.style.fontWeight = '700';
    };

    controlsList.forEach(controls => {
        if (controls.dataset.gccBatchButtonsAdded) return;
        const orig = controls.querySelector('button.gc-builder-adjust.gc-builder-adjust--add');
        if (!orig) return;

        const input = controls.querySelector('input.gc-builder-input, input[type="number"], input[type="text"], input[type="tel"], input:not([type])');
        if (!input) return;

        const fireInput = () => {
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
        };

        const createBatchButton = (label, amount) => {
            const btn = document.createElement('button');
            btn.className = 'gcc-builder-batch-button';
            styleButton(btn, orig, label, `Increase by ${label} turns`, '#145A32');
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
                fireInput();
            });
            return btn;
        };

        // Fills in exactly how many ships are needed for this row to surpass the
        // power rating of a target card (resolved by findTarget at click time).
        const createSurpassButton = (label, ariaLabel, findTarget) => {
            const btn = document.createElement('button');
            btn.className = 'gcc-builder-beat-button';
            styleButton(btn, orig, label, ariaLabel, '#1F618D');
            btn.addEventListener('click', () => {
                const card = controls.closest('.gc-builder-card');
                if (!card) return;
                const target = findTarget(card);
                if (!target) return;
                const prTarget = getRowPower(target);
                const prThis = getRowPower(card);
                const perShip = parseNum(card.dataset.power);
                if (!perShip || perShip <= 0 || Number.isNaN(prTarget) || Number.isNaN(prThis)) return;
                const deficit = prTarget - prThis;
                const needed = deficit > 0 ? Math.ceil(deficit / perShip) : 0;
                input.value = needed;
                fireInput();
            });
            return btn;
        };

        const plus5 = createBatchButton('+5', 5);
        const plus10 = createBatchButton('+10', 10);
        const beat = createSurpassButton('↑', 'Build enough to surpass the row above', findRowAbove);
        const beatTop = createSurpassButton('↑↑', 'Build enough to surpass the top row', findTopRow);
        orig.insertAdjacentElement('afterend', plus5);
        plus5.insertAdjacentElement('afterend', plus10);
        plus10.insertAdjacentElement('afterend', beat);
        beat.insertAdjacentElement('afterend', beatTop);
        controls.dataset.gccBatchButtonsAdded = '1';
    });
}
