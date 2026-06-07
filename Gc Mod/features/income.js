// Income & Upkeep page enhancements (f=com_col income summary).
// - Minerals row: show "<qty> × <price> = $<total>" using a fixed mineral price.
// - Food row: append "Credit Cost: <required> × <food price> = $<total>" to the
//   calc line, where the current food price is fetched live from the market.

const INCOME_MINERAL_PRICE = 1200; // fixed credit value per mineral unit
const INCOME_FOOD_GID = 21;        // market good id for Food
const INCOME_GOODS_GID = 24;       // market good id for Goods

function incomeFmt(n) {
    return Number(n).toLocaleString('en-US');
}

function incomeParseNum(txt) {
    const m = (txt || '').replace(/,/g, '').match(/-?\d+/);
    return m ? parseInt(m[0], 10) : null;
}

function incomeGetSid() {
    if (typeof sid !== 'undefined' && sid) return sid;
    const m = document.documentElement.innerHTML.match(/&(\d+)&/) || window.location.href.match(/&(\d+)&/);
    return m ? m[1] : null;
}

async function fetchMarketPrice(gid) {
    try {
        const s = incomeGetSid();
        const url = s ? `i.cfm?&${s}&f=com_market2&gid=${gid}` : `i.cfm?f=com_market2&gid=${gid}`;
        const res = await fetch(url, { credentials: 'same-origin' });
        if (!res.ok) return null;
        const doc = new DOMParser().parseFromString(await res.text(), 'text/html');

        // Prefer the buy price; goods has no buy side, so fall back to the
        // available-table price and finally the sell price input.
        const price = doc.querySelector('input[name="buyprice"]')?.value
                   || doc.querySelector('.MobileBuyPrice')?.value
                   || doc.querySelector('.gc-market-detail-table--available-modern tr.Market_Click td')?.textContent
                   || doc.querySelector('input[name="price"]')?.value;
        return incomeParseNum(price);
    } catch (e) {
        return null;
    }
}

async function enhanceIncomePage() {
    const page = document.querySelector('.gc-income-page');
    if (!page) return;

    const rows = [...page.querySelectorAll('.gc-income-section--resources .gc-ledger__row')];
    const findRow = (name) => rows.find(r => {
        const lbl = r.querySelector('.gc-ledger__label');
        return lbl && lbl.textContent.trim().toLowerCase() === name;
    });

    // ── Minerals: total × fixed credit price ──
    const mineralRow = findRow('minerals');
    if (mineralRow) {
        const actual = mineralRow.querySelector('.gc-ledger__actual');
        if (actual && !actual.dataset.gccMineralCost) {
            const qty = incomeParseNum(actual.textContent);
            if (qty !== null) {
                actual.dataset.gccMineralCost = '1';
                const total = qty * INCOME_MINERAL_PRICE;
                actual.textContent = `${incomeFmt(qty)} × ${incomeFmt(INCOME_MINERAL_PRICE)} = $${incomeFmt(total)}`;
            }
        }
    }

    // ── Food & Goods: net (produced − consumed/sold) × current price, shown
    //    as a credit gain when in surplus or a loss when in deficit. ──
    await applyNetCreditRow(findRow('food'), INCOME_FOOD_GID);
    await applyNetCreditRow(findRow('goods'), INCOME_GOODS_GID);
}

// Append a "Credit increase/decrease: <amount> × <price> = $<value>" note to a
// resource row's calc line, based on the sign of its net actual value.
async function applyNetCreditRow(row, gid) {
    if (!row) return;
    const calc = row.querySelector('.gc-ledger__calc');
    const actual = row.querySelector('.gc-ledger__actual');
    if (!calc || !actual || calc.dataset.gccCreditCost) return;

    const net = incomeParseNum(actual.textContent);
    if (net === null) return;

    calc.dataset.gccCreditCost = '1';
    const price = await fetchMarketPrice(gid);
    if (price === null) {
        delete calc.dataset.gccCreditCost; // allow a later retry if the fetch failed
        return;
    }

    const amount = Math.abs(net);
    const value = amount * price;
    const up = net > 0;
    const span = document.createElement('span');
    span.className = 'gcc-credit-cost';
    span.style.cssText = 'float:right; margin-left:12px; font-weight:600; color:' +
        (up ? 'var(--accent-good,#7fc592)' : 'var(--accent-hot,#ec6262)') + ';';
    span.textContent = `${up ? 'Credit increase' : 'Credit decrease'}: ` +
        `${incomeFmt(amount)} × ${incomeFmt(price)} = $${incomeFmt(value)}`;
    calc.appendChild(span);
}

// The game re-renders the income subtree after our first pass, so a one-shot
// run gets discarded. Keep a long-lived observer that re-applies on every
// re-render; the per-node guards above make repeat runs cheap and loop-safe.
function initIncomePage() {
    let scheduled = false;
    const schedule = () => {
        if (scheduled) return;
        scheduled = true;
        setTimeout(() => { scheduled = false; enhanceIncomePage(); }, 50);
    };

    schedule();
    new MutationObserver(() => {
        if (document.querySelector('.gc-income-page')) schedule();
    }).observe(document.body, { childList: true, subtree: true });
}
