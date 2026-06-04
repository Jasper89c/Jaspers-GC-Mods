let currentChatTab = localStorage.getItem('gc_custom_chat_tab') || 'public';
let isSubmitting = false;

function getGcSessionId() {
    let href = window.location.href;
    if (window.top && window.top.location) {
        href = window.top.location.href;
    }
    const match = href.match(/i\.cfm\?&?([^&]+)&/);
    return match ? match[1] : '';
}

function fetchActiveSessionId(callback) {
    try {
        if (chrome && chrome.runtime && chrome.runtime.id) {
            chrome.runtime.sendMessage({ action: "GET_SID" }, function(response) {
                if (chrome.runtime.lastError || !response) {
                    callback(localStorage.getItem('gc_last_known_sid') || '');
                    return;
                }
                if (response.sid) {
                    localStorage.setItem('gc_last_known_sid', response.sid);
                    callback(response.sid);
                } else {
                    callback(localStorage.getItem('gc_last_known_sid') || '');
                }
            });
        } else {
            callback(localStorage.getItem('gc_last_known_sid') || '');
        }
    } catch (e) {
        callback(localStorage.getItem('gc_last_known_sid') || '');
    }
}

function updatePublicFeed(container) {
    if (!container || chatFeatureEnabledState === false) return;

    fetchActiveSessionId(async function(sid) {
        try {
            const url = sid ? `i.cfm?&${sid}&f=com` : `i.cfm?f=com`;
            const res = await fetch(url, { credentials: 'same-origin' });

            if (res.ok) {
                const html = await res.text();

                if (html.includes('Nothing to see here') || !html.includes('gc-sidechat__entry')) return;

                const targetDoc = new DOMParser().parseFromString(html, 'text/html');
                const lines = targetDoc.querySelectorAll('.gc-sidechat__entry');

                if (lines.length > 0) {
                    container.innerHTML = '';

                    Array.from(lines).reverse().forEach(line => {
                        const nameEl = line.querySelector('.gc-sidechat__name');
                        const textEl = line.querySelector('.gc-sidechat__text');

                        if (nameEl && textEl) {
                            const row = document.createElement('div');
                            row.className = 'custom-chat-line';

                            const nameSpan = document.createElement('span');
                            nameSpan.className = 'custom-chat-username';
                            nameSpan.textContent = nameEl.textContent;

                            const textSpan = document.createElement('span');
                            textSpan.className = 'custom-chat-body-text';
                            textSpan.textContent = textEl.textContent;

                            row.appendChild(nameSpan);
                            row.appendChild(textSpan);

                            container.appendChild(row);
                        }
                    });

                    container.scrollTop = container.scrollHeight;
                }
            }
        } catch (e) {
            console.error(e);
        }
    });
}

async function refreshFedFeedFromServer(container) {
    if (!container || chatFeatureEnabledState === false) return;

    fetchActiveSessionId(async function(sid) {
        try {
            const url = sid ? `i.cfm?&${sid}&f=fed_forum` : `i.cfm?f=fed_forum`;
            const res = await fetch(url, { credentials: 'same-origin' });
            if (!res.ok) return;

            const html = await res.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');

            const rows = Array.from(doc.querySelectorAll('table.gc-fed-forum-list tr')).filter(row =>
                row.querySelector('td.gc-fed-forum-list__meta')
            );

            container.innerHTML = '';

            if (rows.length === 0) {
                container.innerHTML = '<div style="color:gray;text-align:center;margin-top:20px;">No federation messages found.</div>';
                return;
            }

            Array.from(rows).reverse().forEach(row => {
                const userCell = row.querySelector('td.gc-fed-forum-list__meta');
                const bodyCell = row.querySelector('td.gc-fed-forum-list__body');
                if (!userCell || !bodyCell) return;

                    let username = "Unknown";
                    const userEl = userCell.querySelector('span.gc-fed-forum-list__user');
                    if (userEl) username = userEl.textContent.trim();

                    let timestamp = "";
                    const fontEl = userCell.querySelector('font[color="gray"]');
                    if (fontEl) {
                        timestamp = fontEl.textContent.replace(/\n+/g, ' ').trim();
                    }

                    let bodyHtml = bodyCell.innerHTML.trim();

                    bodyHtml = bodyHtml.replace(
                        /(?:<br\s*\/?>\s*)+Colony Name/gi,
                        '<span class="custom-fed-break-block">Colony Name'
                    );
                    if (bodyHtml.includes('custom-fed-break-block')) {
                        bodyHtml += '</span>';
                    }

                    const chatLine = document.createElement('div');
                    chatLine.className = 'custom-chat-line';
                    chatLine.innerHTML = `
                        <div>
                            <span class="custom-chat-username">${username}</span>
                            <span class="custom-chat-timestamp">${timestamp}</span>
                        </div>
                        <div class="custom-chat-body-text" style="margin-top:2px;">${bodyHtml}</div>
                    `;
                    container.appendChild(chatLine);
            });

            container.scrollTop = container.scrollHeight;
        } catch(e) {
            console.error("Error refreshing Fed feed:", e);
        }
    });
}

function renderEmbeddedBottomChat() {
    if (window.top !== window.self) return;
    if (chatFeatureEnabledState === false) {
        const existingCustomChat = document.querySelector('.custom-bottom-chat-panel');
        if (existingCustomChat) existingCustomChat.remove();

        const oldBar = document.getElementById('SBar');
        if (oldBar) {
            oldBar.style.setProperty('display', 'block', 'important');
            oldBar.style.visibility = 'visible';
            oldBar.style.opacity = '1';
        }
        return;
    }

    if (document.querySelector('.custom-bottom-chat-panel')) return;
    if (!document.body) return;

    const oldBar = document.getElementById('SBar');
    if (oldBar) oldBar.style.setProperty('display', 'none', 'important');

    currentChatTab = localStorage.getItem('gc_custom_chat_tab') || 'public';

    const chatPanel = document.createElement('div');
    chatPanel.className = 'custom-bottom-chat-panel';

    const tabHeader = document.createElement('div');
    tabHeader.className = 'custom-chat-tabs-header';

    const publicTabBtn = document.createElement('button');
    publicTabBtn.className = `custom-chat-tab-button ${currentChatTab === 'public' ? 'active' : ''}`;
    publicTabBtn.textContent = 'Public Chat';

    const fedTabBtn = document.createElement('button');
    fedTabBtn.className = `custom-chat-tab-button ${currentChatTab === 'fed' ? 'active' : ''}`;
    fedTabBtn.textContent = 'Federation Discussion';

    tabHeader.appendChild(publicTabBtn);
    tabHeader.appendChild(fedTabBtn);

    const publicFeedDisplay = document.createElement('div');
    publicFeedDisplay.className = `custom-chat-feed-container ${currentChatTab === 'public' ? 'active' : ''}`;

    const fedFeedDisplay = document.createElement('div');
    fedFeedDisplay.className = `custom-chat-feed-container ${currentChatTab === 'fed' ? 'active' : ''}`;

    const inputBar = document.createElement('div');
    inputBar.className = 'custom-chat-input-bar';

    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.className = 'custom-chat-text-field';
    textInput.placeholder = currentChatTab === 'public' ? 'Type public message...' : 'Type federation message...';
    textInput.maxLength = currentChatTab === 'public' ? 150 : 5000;

    const sendBtn = document.createElement('button');
    sendBtn.className = 'custom-chat-send-btn';
    sendBtn.textContent = 'Send';

    inputBar.appendChild(textInput);
    inputBar.appendChild(sendBtn);
    chatPanel.appendChild(tabHeader);
    chatPanel.appendChild(publicFeedDisplay);
    chatPanel.appendChild(fedFeedDisplay);
    chatPanel.appendChild(inputBar);

    document.body.appendChild(chatPanel);

    const allMessagesLink = document.createElement('a');
    allMessagesLink.id = 'gcc-all-messages-link';
    allMessagesLink.href = currentChatTab === 'public'
        ? `https://gcc.wrindustries.com/i.cfm?&${sid}&f=com_msgsector`
        : `https://gcc.wrindustries.com/i.cfm?f=fed_forum`;
    allMessagesLink.textContent = currentChatTab === 'public' ? "All Messages" : "Federation Forum";
    allMessagesLink.target = "_blank";
    allMessagesLink.style.cssText = "position: absolute; top: 28px; right: 10px; color: #e8b563; font-size: 11px; text-decoration: none; font-weight: bold; z-index: 10; cursor: pointer;";
    allMessagesLink.title = currentChatTab === 'public' ? "View Full Message History" : "View Federation Discussion";
    chatPanel.appendChild(allMessagesLink);

    function handlePostSubmission() {
        const messageText = textInput.value.trim();
        if (!messageText || isSubmitting) return;

        isSubmitting = true;
        textInput.disabled = true;
        sendBtn.disabled = true;

        fetchActiveSessionId(async function(sid) {
            try {
                if (currentChatTab === 'public') {
                    const url = sid ? `i.cfm?&${sid}&popup=msgsector` : `i.cfm?popup=msgsector`;
                    const res = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: `chat=${encodeURIComponent(messageText)}&remLen2=${150 - messageText.length}`,
                        credentials: 'same-origin'
                    });
                    if (res.ok) {
                        textInput.value = '';
                        updatePublicFeed(publicFeedDisplay, true);
                    }
                } else {
                    const url = sid ? `i.cfm?&${sid}&f=fed_forum` : `i.cfm?f=fed_forum`;
                    const res = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: `forum2=${encodeURIComponent(messageText)}&remLen2=${5000 - messageText.length}&submitflag=Post+Message`,
                        credentials: 'same-origin'
                    });
                    if (res.ok) {
                        textInput.value = '';
                        refreshFedFeedFromServer(fedFeedDisplay);
                    }
                }
            } catch (e) { console.error(e); } finally {
                isSubmitting = false;
                textInput.disabled = false;
                sendBtn.disabled = false;
                textInput.focus();
            }
        });
    }

    publicTabBtn.addEventListener('click', () => {
        currentChatTab = 'public';
        localStorage.setItem('gc_custom_chat_tab', 'public');
        fedTabBtn.classList.remove('active');
        publicTabBtn.classList.add('active');
        fedFeedDisplay.classList.remove('active');
        publicFeedDisplay.classList.add('active');
        textInput.placeholder = 'Type public message...';
        textInput.maxLength = 150;
        allMessagesLink.href = `https://gcc.wrindustries.com/i.cfm?&${sid}&f=com_msgsector`;
        allMessagesLink.textContent = "All Messages";
        allMessagesLink.title = "View Full Message History";
        updatePublicFeed(publicFeedDisplay);
    });

    fedTabBtn.addEventListener('click', () => {
        currentChatTab = 'fed';
        localStorage.setItem('gc_custom_chat_tab', 'fed');
        publicTabBtn.classList.remove('active');
        fedTabBtn.classList.add('active');
        publicFeedDisplay.classList.remove('active');
        fedFeedDisplay.classList.add('active');
        textInput.placeholder = 'Type federation message...';
        textInput.maxLength = 5000;
        allMessagesLink.href = `https://gcc.wrindustries.com/i.cfm?f=fed_forum`;
        allMessagesLink.textContent = "Federation Forum";
        allMessagesLink.title = "View Federation Discussion";

        if (!fedFeedDisplay.innerHTML.trim() || fedFeedDisplay.innerHTML.includes('No federation messages')) {
            fedFeedDisplay.innerHTML = '<div style="color:gray;text-align:center;margin-top:20px;">Loading Fed...</div>';
        }
        refreshFedFeedFromServer(fedFeedDisplay);
    });

    sendBtn.addEventListener('click', handlePostSubmission);
    textInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handlePostSubmission();
    });

    if (currentChatTab === 'public') updatePublicFeed(publicFeedDisplay);
    else refreshFedFeedFromServer(fedFeedDisplay);
}

// 7-second sync interval
setInterval(() => {
    if (chatFeatureEnabledState === false) {
        const existingCustomChat = document.querySelector('.custom-bottom-chat-panel');
        if (existingCustomChat) existingCustomChat.remove();
        return;
    }

    if (!document.querySelector('.custom-bottom-chat-panel')) {
        renderEmbeddedBottomChat();
    }

    currentChatTab = localStorage.getItem('gc_custom_chat_tab') || currentChatTab;

    if (currentChatTab === 'public') {
        const publicBox = document.querySelector('.custom-bottom-chat-panel .custom-chat-feed-container.active');
        if (publicBox) updatePublicFeed(publicBox);
    } else {
        const fedBox = document.querySelector('.custom-bottom-chat-panel .custom-chat-feed-container.active');
        if (fedBox) refreshFedFeedFromServer(fedBox);
    }
}, 7000);

