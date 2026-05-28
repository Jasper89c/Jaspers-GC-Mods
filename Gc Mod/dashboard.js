// dashboard.js - Comprehensive live storage listener with Menu toggles
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get([
        'assimEnabled', 'infectEnabled', 'fedLazy', 'fedFull',
        'clusterCollapsed', 'similareCollapsed', 'viralCollapsed', 'autoContinue', 'autoExplore'
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

        // =================================================================
        // 5. FIXED: Auto Click Automation Switches
        // =================================================================
        const autoContinueCheck = document.getElementById('dash-auto-continue');
        const autoExploreCheck = document.getElementById('dash-auto-explore');

        if (autoContinueCheck) {
            // If autoContinue isn't explicitly false, default it to true (ON)
            autoContinueCheck.checked = (res.autoContinue !== false);

            autoContinueCheck.addEventListener('change', () => {
                // Save exactly what the checkbox says: checked = true, unchecked = false
                chrome.storage.local.set({ autoContinue: autoContinueCheck.checked });
            });
        }

        if (autoExploreCheck) {
            // If autoExplore isn't explicitly false, default it to true (ON)
            autoExploreCheck.checked = (res.autoExplore !== false);

            autoExploreCheck.addEventListener('change', () => {
                // Save exactly what the checkbox says: checked = true, unchecked = false
                chrome.storage.local.set({ autoExplore: autoExploreCheck.checked });
            });
        }
        // =================================================================
        // 6. MIGRATED: Feature & Intel Toggle Controls
        // =================================================================
        const assimCheck = document.getElementById('dash-assim-toggle');
        const infectCheck = document.getElementById('dash-infect-toggle');
        const fedLazyCheck = document.getElementById('dash-fed-lazy');
        const fedFullCheck = document.getElementById('dash-fed-full');

        // Synchronize check states based on saved memory keys
        if (assimCheck) {
            assimCheck.checked = !!res.assimEnabled;
            assimCheck.addEventListener('change', () => {
                chrome.storage.local.set({ assimEnabled: assimCheck.checked });
            });
        }

        if (infectCheck) {
            infectCheck.checked = !!res.infectEnabled;
            infectCheck.addEventListener('change', () => {
                chrome.storage.local.set({ infectEnabled: infectCheck.checked });
            });
        }

        if (fedLazyCheck) {
            fedLazyCheck.checked = !!res.fedLazy;
            fedLazyCheck.addEventListener('change', () => {
                // If turning on Lazy Load, uncheck Full Load to prevent conflict
                if (fedLazyCheck.checked && fedFullCheck) fedFullCheck.checked = false;
                chrome.storage.local.set({
                    fedLazy: fedLazyCheck.checked,
                    fedFull: fedFullCheck ? fedFullCheck.checked : false
                });
            });
        }

        if (fedFullCheck) {
            fedFullCheck.checked = !!res.fedFull;
            fedFullCheck.addEventListener('change', () => {
                // If turning on Full Load, uncheck Lazy Load to prevent conflict
                if (fedFullCheck.checked && fedLazyCheck) fedLazyCheck.checked = false;
                chrome.storage.local.set({
                    fedFull: fedFullCheck.checked,
                    fedLazy: fedLazyCheck ? fedLazyCheck.checked : false
                });
            });
        }
    });
});