(function () {
    if (window.top !== window.self) return;
    if (!window.chrome?.storage?.local) return;

    const storageKey = 'artifactTrackerEntries';
    const processedKeys = new Set();

    function getCurrentDate() {
        return new Date().toISOString().slice(0, 10);
    }

    function formatTimeLabel(date) {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    }

    // The game's dig groups run on a fixed server-time (America/New_York) schedule:
    // a group starts every 6 hours (00:00/06:00/12:00/18:00 ET) and runs for 4 hours,
    // split into two waves with rarity sub-phases. Breakpoints below are minutes
    // elapsed since the group's start; each pair of consecutive values is one phase.
    const DIG_CYCLE_MINUTES = 6 * 60;
    const DIG_PHASE_BREAKPOINTS = [0, 30, 45, 90, 95, 150, 165, 170, 180, 200, 240, 360];

    function getEasternMinutesOfDay(date) {
        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/New_York',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        }).formatToParts(date);
        const get = (type) => Number(parts.find((part) => part.type === type)?.value || 0);
        return get('hour') * 60 + get('minute') + get('second') / 60;
    }

    // Returns the current scheduled dig phase's start/end, expressed in the
    // viewer's own local time zone (whatever the browser reports), regardless
    // of what time strings happen to be visible on the page.
    function getScheduledDigWindow(now) {
        const etMinutes = getEasternMinutesOfDay(now);
        const cycleStart = Math.floor(etMinutes / DIG_CYCLE_MINUTES) * DIG_CYCLE_MINUTES;
        const offset = etMinutes - cycleStart;

        let segStart = DIG_PHASE_BREAKPOINTS[0];
        let segEnd = DIG_PHASE_BREAKPOINTS[DIG_PHASE_BREAKPOINTS.length - 1];
        for (let i = 0; i < DIG_PHASE_BREAKPOINTS.length - 1; i++) {
            if (offset >= DIG_PHASE_BREAKPOINTS[i] && offset < DIG_PHASE_BREAKPOINTS[i + 1]) {
                segStart = DIG_PHASE_BREAKPOINTS[i];
                segEnd = DIG_PHASE_BREAKPOINTS[i + 1];
                break;
            }
        }

        const startInstant = new Date(now.getTime() + (segStart - offset) * 60000);
        const endInstant = new Date(now.getTime() + (segEnd - offset) * 60000);

        return {
            startTime: formatTimeLabel(startInstant),
            endTime: formatTimeLabel(endInstant),
        };
    }

    function normalizeArtifactName(name) {
        return (name || '')
            .replace(/\b(artifact|artifacts)\b/gi, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function parseArtifactEvents(text) {
        const source = (text || '');
        if (!source) return [];

        const lowerText = source.toLowerCase();
        if (!lowerText.includes('found') && !lowerText.includes('excavation dig site')) return [];
        if (lowerText.includes('not found') || lowerText.includes('no artifact')) return [];

        const { startTime, endTime } = getScheduledDigWindow(new Date());

        const artifactRegex = /Found\s+(?:(\d+)\s+)?([^\n<]+?)\s+\((Common|UnCommon|Rare|Legendary)\)/gi;
        const matches = [...source.matchAll(artifactRegex)];

        return matches
            .map((match) => {
                const count = parseInt(match[1], 10) || 1;
                const artifactName = normalizeArtifactName(match[2]);
                const rarity = match[3] || 'UnCommon';

                if (!artifactName) return null;

                return {
                    date: getCurrentDate(),
                    startTime,
                    endTime,
                    rarity,
                    artifactName,
                    count,
                };
            })
            .filter(Boolean);
    }

    let writeQueue = Promise.resolve();

    function addTrackerEntries(parsedList) {
        const newParsed = parsedList.filter((parsed) => {
            const key = `${parsed.date}-${parsed.startTime}-${parsed.endTime}-${parsed.rarity}-${parsed.artifactName}-${parsed.count}`;
            if (processedKeys.has(key)) return false;
            processedKeys.add(key);
            return true;
        });
        if (!newParsed.length) return;

        writeQueue = writeQueue.then(() => new Promise((resolve) => {
            chrome.storage.local.get([storageKey], (res) => {
                const entries = Array.isArray(res[storageKey]) ? res[storageKey] : [];

                newParsed.forEach((parsed) => {
                    let dayEntry = entries.find((item) => item.date === parsed.date);
                    if (!dayEntry) {
                        dayEntry = { date: parsed.date, blocks: [] };
                        entries.push(dayEntry);
                    }

                    let block = (dayEntry.blocks || []).find((item) =>
                        item.startTime === parsed.startTime &&
                        item.endTime === parsed.endTime &&
                        item.rarity === parsed.rarity
                    );
                    if (!block) {
                        block = { startTime: parsed.startTime, endTime: parsed.endTime, rarity: parsed.rarity, artifacts: [] };
                        dayEntry.blocks.push(block);
                    }

                    let artifact = (block.artifacts || []).find((item) => item.name.toLowerCase() === parsed.artifactName.toLowerCase());
                    if (!artifact) {
                        artifact = { name: parsed.artifactName, count: 0 };
                        block.artifacts.push(artifact);
                    }

                    artifact.count += parsed.count;
                    block.artifacts.sort((a, b) => a.name.localeCompare(b.name));
                    dayEntry.blocks.sort((a, b) => a.startTime.localeCompare(b.startTime));
                });

                entries.sort((a, b) => b.date.localeCompare(a.date));
                chrome.storage.local.set({ [storageKey]: entries }, resolve);
            });
        }));
    }

    function watchPage() {
        const observer = new MutationObserver(() => {
            const text = document.body?.textContent || '';
            const parsedEntries = parseArtifactEvents(text);
            addTrackerEntries(parsedEntries);
        });

        observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', watchPage, { once: true });
    } else {
        watchPage();
    }
})();
