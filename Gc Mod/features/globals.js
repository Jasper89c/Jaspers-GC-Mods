let sid = null;

let autoContinueEnabled = true;
let autoExploreEnabled = true;
let simsLinksEnabled = true;
let batchButtonsEnabledState = true;
let chatFeatureEnabledState = true;
let quickBuildEnabledState = true;

chrome.storage.local.get(['autoContinue', 'autoExplore'], (res) => {
    autoContinueEnabled = (res.autoContinue !== false);
    autoExploreEnabled = (res.autoExplore !== false);
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace !== 'local') return;

    if (changes.autoContinue) autoContinueEnabled = changes.autoContinue.newValue;
    if (changes.autoExplore) autoExploreEnabled = changes.autoExplore.newValue;

    if (changes.simsLinksEnabled) {
        simsLinksEnabled = changes.simsLinksEnabled.newValue;
        if (simsLinksEnabled !== false) {
            try { addSimulationsLinks(); } catch(e){}
        } else {
            window.location.reload();
        }
    }

    if (changes.quickBuildEnabled) {
        quickBuildEnabledState = changes.quickBuildEnabled.newValue !== false;
    }

    if (changes.chatFeatureEnabled) {
        chatFeatureEnabledState = changes.chatFeatureEnabled.newValue !== false;
        try { renderEmbeddedBottomChat(); } catch(e) {}
    }

    if (changes.batchButtonsEnabled) {
        if (changes.batchButtonsEnabled.newValue !== false) {
            try { addShipBuilderBatchButtons(); } catch (e) { }
        } else {
            const buttons = document.querySelectorAll('.gcc-builder-batch-button');
            buttons.forEach(btn => btn.remove());
            const processedControls = document.querySelectorAll('[data-gcc-batch-buttons-added]');
            processedControls.forEach(el => delete el.dataset.gccBatchButtonsAdded);
        }
    }
});