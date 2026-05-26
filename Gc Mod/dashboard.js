// dashboard.js - Comprehensive live storage listener
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['assimEnabled', 'infectEnabled', 'fedLazy', 'fedFull'], (res) => {
        
        // 1. Assimilate Status Card
        const assimStatus = document.getElementById('dash-assim-status');
        if (assimStatus) {
            if (res.assimEnabled) {
                assimStatus.textContent = "Active";
                assimStatus.classList.add('active');
            } else {
                assimStatus.textContent = "Disabled";
            }
        }

        // 2. Infect Status Card
        const infectStatus = document.getElementById('dash-infect-status');
        if (infectStatus) {
            if (res.infectEnabled) {
                infectStatus.textContent = "Active";
                infectStatus.classList.add('active');
            } else {
                infectStatus.textContent = "Disabled";
            }
        }

        // 3. Federation Intelligence Mapping Card
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
    });
});