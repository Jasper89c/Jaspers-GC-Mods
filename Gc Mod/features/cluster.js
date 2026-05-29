async function performGlobalCluster(tid, sid) {
    const status = document.getElementById('gcc-cluster-status');
    if (!status) return;
    status.innerText = "⏳ Upgrading...";
    status.style.color = "#aaa";

    const url = `i.cfm?&${sid}&f=com_colupgrade&tid=${tid}&con=1`;

    const mineralSelect = document.getElementById('gcc-cluster-mineral');
    const selectedGoodId = mineralSelect ? mineralSelect.value : '2';

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: new URLSearchParams({ 'goodid': selectedGoodId })
        });

        if (response.ok) {
            status.style.color = "#4caf50";
            status.innerText = "✅ Upgrade Success!";
            setTimeout(() => { window.location.reload(); }, 1000);
        } else {
            throw new Error();
        }
    } catch (e) {
        status.style.color = "#f44336";
        status.innerText = "❌ Failed - Check Resources";
    }
}
