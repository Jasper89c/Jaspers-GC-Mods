// dashboard.js - Comprehensive live storage listener with Menu toggles
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get([
        'assimEnabled', 'infectEnabled', 'fedLazy', 'fedFull',
        'clusterCollapsed', 'similareCollapsed', 'viralCollapsed'
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
    });
});