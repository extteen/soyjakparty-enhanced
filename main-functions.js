// MAIN FUNCTIONS
// EXTTEEN RELEASE (Change this comment if you modded)

const audio = new Audio();
audio.preload = "auto";
audio.crossOrigin = "anonymous";
audio.volume = 0.5;


function getActiveThemeCSS() {
    const themeLink = [...document.querySelectorAll('link[rel="stylesheet"]')]
        .find(link => link.href.includes('/stylesheets/') && !link.href.includes('font-awesome'));
    return themeLink?.href;
}

async function applyActiveTheme(extensionRoot) {
    const { transparencyDisabled } = await browser.storage.sync.get({ transparencyDisabled: false });
    if (!transparencyDisabled) {
        const themeCSS = getActiveThemeCSS();
        if (!themeCSS) return;

        const response = await fetch(themeCSS);
        let cssText = await response.text();

        const boardStyles = getComputedStyle(document.body);
        const baseFont = boardStyles.font;

        const style = document.createElement('style');
        style.textContent = `
        :host {
            all: initial;
            font: ${baseFont} !important;
            color: inherit;
        }
        * {
            font: inherit !important;
            font-family: inherit !important;
            font-size: inherit !important;
            font-weight: inherit !important;
        }
        ${cssText}
    `;
        extensionRoot.shadowRoot.appendChild(style);
    } else {
        updateTransparencyEffects();
    }
}

function createSEClockMenu() {
    const TIMEZONES = [
        { label: 'AMERICA (EAST)',   zone: 'America/New_York',    statusId: 'status-us', clockId: 'clock-us', icon: 'icons/timezonejaks/amerimutt.png' },
        { label: 'EUROPE',      zone: 'Europe/Berlin',       statusId: 'status-eu', clockId: 'clock-eu', icon: 'icons/timezonejaks/euromutt.png' },
        { label: 'LATINX',      zone: 'America/Mexico_City',   statusId: 'status-sa', clockId: 'clock-sa', icon: 'icons/timezonejaks/mexiaryan.png' },
        { label: 'AFRICA',      zone: 'Africa/Lagos',        statusId: 'status-af', clockId: 'clock-af', icon: 'icons/timezonejaks/africanbvll.png' },
        { label: 'INDIA',       zone: 'Asia/Kolkata',        statusId: 'status-ca', clockId: 'clock-ca', icon: 'icons/timezonejaks/canadiansupersoldier.png' },
        { label: 'ASIA (EAST)', zone: 'Asia/Shanghai',       statusId: 'status-as', clockId: 'clock-as', icon: 'icons/timezonejaks/asiaimpish.png' },
        { label: 'AUSTRALIA',   zone: 'Australia/Sydney',    statusId: 'status-au', clockId: 'clock-au', icon: 'icons/timezonejaks/australiaimpish.png' },
    ];

    const extensionHost = document.createElement('div');
    extensionHost.id = 'spe-extension';
    document.body.appendChild(extensionHost);
    extensionHost.attachShadow({ mode: 'open' });

    const getActivityStatus = (hour) => {
        if (hour >= 0  && hour < 6)  return 'Sleeping';
        if (hour >= 6  && hour < 10) return 'Partially Inactive';
        if (hour >= 10 && hour < 18) return 'Mostly Active';
        if (hour >= 18 && hour < 23) return 'Fully Active';
        return 'Winding Down';
    };

    const ICON_PATH = 'icons/spe-32.png';

    const toggleBtn = document.createElement('button');
    toggleBtn.title = 'SPE Menu';
    Object.assign(toggleBtn.style, {
        position: 'fixed', top: '32px', right: '10px', zIndex: '9999',
        padding: '1px 2px', borderRadius: '0px', cursor: 'pointer', border: 'none', outline: '1px solid #fff',
        fontSize: '12px', display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: '6px', backgroundColor: 'rgba(255, 255, 255, 0.5)',
    });

    const toggleIcon = document.createElement('img');
    toggleIcon.src = browser.runtime.getURL(ICON_PATH);
    toggleIcon.alt = '';
    Object.assign(toggleIcon.style, { width: '24px', height: '24px', objectFit: 'contain' });
    toggleBtn.appendChild(toggleIcon);

    const toggleCaret = document.createElement('span');
    toggleCaret.textContent = '▼';
    Object.assign(toggleCaret.style, { fontSize: '10px', opacity: '0.8' });
    toggleBtn.appendChild(toggleCaret);

    document.body.appendChild(toggleBtn);

    const SITE_HOSTS = {
        'soyjak.st':      'spe_site_soyjak',
        'soybooru.com':   'spe_site_soybooru',
        'soyjakwiki.org': 'spe_site_wiki',
    };
    const SITE_DEFAULTS = {
        spe_site_soyjak:   true,
        spe_site_soybooru: true,
        spe_site_wiki:     true,
    };

    async function applySiteVisibility() {
        const prefs = await browser.storage.sync.get(SITE_DEFAULTS);
        const host  = location.hostname.replace(/^www\./, '');
        const key   = SITE_HOSTS[host];
        const enabled = key !== undefined ? prefs[key] : true;
        toggleBtn.style.display = enabled ? 'flex' : 'none';
        if (!enabled) menuBox.style.display = 'none';
    }

    const menuBox = document.createElement('div');
    Object.assign(menuBox.style, {
        position: 'fixed', top: '60px', right: '10px', zIndex: '100000',
        backdropFilter: 'blur(20px)', backgroundColor: 'rgba(255,255,255,0.3)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)', padding: '10px 15px',
        fontSize: '13px', minWidth: '230px', display: 'none',
        maxHeight: '80vh', overflowY: 'auto',
    });

    const soundToggle = document.createElement('button');
    soundToggle.title = 'Toggle notification sounds';
    Object.assign(soundToggle.style, { height: '32px', width: '32px', padding: '4px 8px', border: 'none', cursor: 'pointer', fontSize: '14px' });

    const transparencyToggle = document.createElement('button');
    transparencyToggle.title = 'Toggle transparency effects';
    Object.assign(transparencyToggle.style, { height: '32px', width: '32px', padding: '4px 8px', border: 'none', cursor: 'pointer', fontSize: '16px', marginLeft: '8px' });

    const settingsBtn = document.createElement('button');
    settingsBtn.textContent = '⚙️ Settings';
    settingsBtn.title = 'Open SPE Settings';
    Object.assign(settingsBtn.style, { height: '32px', padding: '5px 8px', border: 'none', cursor: 'pointer', fontSize: '14px', marginLeft: '8px' });
    settingsBtn.addEventListener('click', () => {
        browser.runtime.getURL && window.open(browser.runtime.getURL("settings.html"), "_blank");
    });

    async function syncToggleFaces() {
        const { notifEnabled, transparencyDisabled } = await browser.storage.sync.get({
            notifEnabled: false,
            transparencyDisabled: false,
        });
        soundToggle.textContent       = notifEnabled        ? '🔊' : '🔇';
        transparencyToggle.textContent = transparencyDisabled ? '◼' : '◻';
    }
    syncToggleFaces();

    soundToggle.addEventListener('click', async () => {
        const { notifEnabled } = await browser.storage.sync.get({ notifEnabled: false });
        const next = !notifEnabled;
        await browser.storage.sync.set({ notifEnabled: next });
        soundToggle.textContent = next ? '🔊' : '🔇';
    });

    transparencyToggle.addEventListener('click', async () => {
        const { transparencyDisabled } = await browser.storage.sync.get({ transparencyDisabled: false });
        const next = !transparencyDisabled;
        await browser.storage.sync.set({ transparencyDisabled: next });
        transparencyToggle.textContent = next ? '◼' : '◻';
        updateTransparencyEffects();
    });

    applySiteVisibility();

    browser.storage.onChanged.addListener((changes) => {
        if (changes.notifEnabled !== undefined)
            soundToggle.textContent = changes.notifEnabled.newValue ? '🔊' : '🔇';
        if (changes.transparencyDisabled !== undefined) {
            transparencyToggle.textContent = changes.transparencyDisabled.newValue ? '◼' : '◻';
            updateTransparencyEffects();
        }
        if (Object.values(SITE_HOSTS).some(k => changes[k] !== undefined)) applySiteVisibility();
    });

    const topControls = document.createElement('div');
    Object.assign(topControls.style, {
        display: 'flex', justifyContent: 'flex-end',
        alignItems: 'center', marginBottom: '10px',
    });
    topControls.appendChild(soundToggle);
    topControls.appendChild(transparencyToggle);
    topControls.appendChild(settingsBtn);

    const settingsDivider = document.createElement('hr');
    settingsDivider.style.marginTop = '10px';

    menuBox.appendChild(topControls);
    menuBox.appendChild(settingsDivider);

    const clocksSection = document.createElement('div');
    clocksSection.id = 'clocks-section';

    const clocksHeader = document.createElement('div');
    Object.assign(clocksHeader.style, {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '10px',
    });
    const clocksTitle = document.createElement('div');
    clocksTitle.textContent = 'Timezones';
    clocksTitle.style.fontWeight = 'bold';
    clocksHeader.appendChild(clocksTitle);
    clocksSection.insertBefore(clocksHeader, clocksSection.firstChild);

    TIMEZONES.forEach(({ label, clockId, statusId, icon }) => {
        const row = document.createElement('div');
        Object.assign(row.style, { display: 'flex', alignItems: 'center', marginBottom: '8px' });

        const img = document.createElement('img');
        img.src = browser.runtime.getURL(icon);
        img.alt = '';
        Object.assign(img.style, { width: '25px', height: '25px', marginRight: '6px', objectFit: 'contain', flexShrink: '0' });

        const textContainer = document.createElement('div');
        textContainer.innerHTML = `<strong>${label}:</strong> <span id="${clockId}">--:--:--</span><br><span id="${statusId}" style="font-size:12px;">Checking...</span>`;

        row.appendChild(img);
        row.appendChild(textContainer);
        clocksSection.appendChild(row);
    });

    menuBox.appendChild(clocksSection);
    document.body.appendChild(menuBox);

    let menuVisible = false;
    toggleBtn.addEventListener('click', () => {
        menuVisible = !menuVisible;
        menuBox.style.display = menuVisible ? 'block' : 'none';
    });

    function updateTransparencyEffects() {
        browser.storage.sync.get({ transparencyDisabled: false }).then(({ transparencyDisabled }) => {
            if (transparencyDisabled) {
                menuBox.style.backdropFilter    = 'none';
                menuBox.style.WebkitBackdropFilter = 'none';
                menuBox.style.backgroundColor   = '#ffffff';
                menuBox.style.fontFamily        = 'monospace';
                menuBox.style.color             = '#000000';
                document.querySelectorAll('#spe-extension button').forEach(btn => {
                    btn.style.backdropFilter    = 'none';
                    btn.style.backgroundColor  = '#f0f0f0';
                    btn.style.fontFamily       = 'monospace';
                    btn.style.color            = '#000000';
                });
            } else {
                menuBox.style.backdropFilter    = 'blur(20px)';
                menuBox.style.WebkitBackdropFilter = 'blur(10px)';
                menuBox.style.backgroundColor   = 'rgba(255,255,255,0.3)';
                menuBox.style.fontFamily        = '';
                menuBox.style.color             = '';
                document.querySelectorAll('#spe-extension button').forEach(btn => {
                    btn.style.backdropFilter    = 'blur(20px)';
                    btn.style.backgroundColor  = 'rgba(255,255,255,0.4)';
                    btn.style.fontFamily       = '';
                    btn.style.color            = '';
                });
            }
        });
    }
    function updateClocks() {
        TIMEZONES.forEach(({ zone, clockId, statusId }) => {
            const now  = new Date().toLocaleString('en-US', { timeZone: zone });
            const date = new Date(now);
            const timeStr = date.toTimeString().split(' ')[0];
            const hour    = date.getHours();
            const clockEl  = document.getElementById(clockId);
            const statusEl = document.getElementById(statusId);
            if (clockEl)  clockEl.textContent  = timeStr;
            if (statusEl) statusEl.textContent = getActivityStatus(hour);
        });
    }
    updateClocks();
    setInterval(updateClocks, 1000);

    applyActiveTheme(extensionHost);
    new MutationObserver(() => applyActiveTheme(extensionHost))
        .observe(document.head, { childList: true });
}

createSEClockMenu();
async function renderCustomLinks() {
    const boardList = document.querySelector('.boardlist');
    if (!boardList) return;
    boardList.querySelectorAll('.spe-header-item').forEach(el => el.remove());

    const { customBoardLinks, customHeaderLinks, headerWikiSearch } =
        await browser.storage.sync.get({
            customBoardLinks:  [],
            customHeaderLinks: [],
            headerWikiSearch:  false,
        });
    const allLinks = [
        ...customBoardLinks.map(board => ({
            label: board,
            href:  `https://www.soyjak.st/${board}`,
            title: 'Custom board',
        })),
        ...customHeaderLinks.map(({ label, url }) => ({
            label,
            href:  url,
            title: url,
        })),
    ];

    if (allLinks.length) {
        const customSpan = document.createElement('span');
        customSpan.className = 'sub spe-header-item';
        customSpan.innerHTML = '[ ' + allLinks
            .map(({ label, href, title }) =>
                `<a href="${href}" title="${title}" target="_blank">${label}</a>`)
            .join(' / ') + ' ]';
        boardList.appendChild(customSpan);
    }

    if (headerWikiSearch) {
        const searchwiki = document.createElement('input');
        searchwiki.type = 'text';
        searchwiki.placeholder = 'Soyjak Wiki search...';
        searchwiki.className = 'spe-header-item';
        Object.assign(searchwiki.style, { width: '120px', padding: '2px', fontSize: '10px' });
        boardList.appendChild(searchwiki);

        searchwiki.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                const query = searchwiki.value.trim();
                if (query) window.open('https://soyjakwiki.org/index.php?search=' + encodeURIComponent(query), '_blank');
            }
        });
    }
}

renderCustomLinks();

browser.storage.onChanged.addListener((changes) => {
    if (changes.customBoardLinks || changes.customHeaderLinks || changes.headerWikiSearch)
        renderCustomLinks();
});
const capcodes = document.querySelectorAll('.capcode');
const badgeSources = {
    '## Admin':  'icons/admin-gemjak.png',
    '## Mod':    'icons/janny-badge.png',
    '## Unused': 'icons/approver-oalgo.png',
};

capcodes.forEach(capcode => {
    const text = capcode.innerText.trim();
    if (badgeSources[text]) {
        const badge = document.createElement('img');
        badge.src = browser.runtime.getURL(badgeSources[text]);
        badge.alt = `${text} Badge`;
        badge.classList.add('badge');
        Object.assign(badge.style, { width: '20px', height: '20px', marginLeft: '5px', verticalAlign: 'middle' });
        capcode.appendChild(badge);
    }
});
let lastCount = 0;
let userInteracted = false;
['click', 'keydown', 'scroll'].forEach(evt =>
    window.addEventListener(evt, () => userInteracted = true, { once: true })
);

function getTitleCount() {
    const match = document.title.match(/^\((\d+)\)/);
    return match ? parseInt(match[1], 10) : 0;
}

async function updateAudioSrc() {
    const local = await browser.storage.local.get({ customSound: null });
    const sync  = await browser.storage.sync.get({ selectedSound: 'imrcv.mp3' });
    audio.src = local.customSound
        ? local.customSound
        : browser.runtime.getURL(`audio/${sync.selectedSound}`);
}
updateAudioSrc();

browser.storage.onChanged.addListener((changes) => {
    if (changes.selectedSound || changes.customSound) updateAudioSrc();
});

setInterval(async () => {
    const currentCount = getTitleCount();
    const { notifEnabled } = await browser.storage.sync.get({ notifEnabled: false });
    if (notifEnabled && currentCount > lastCount && userInteracted && document.hidden) {
        audio.play().catch(() => {});
    }
    lastCount = currentCount;
}, 1000);
window.addEventListener('load', async () => {
    const { userBackground } = await browser.storage.local.get({ userBackground: null });
    if (userBackground) {
        Object.assign(document.body.style, {
            backgroundImage:      `url(${userBackground})`,
            backgroundSize:       'cover',
            backgroundPosition:   'center center',
            backgroundAttachment: 'fixed',
        });
    }
});
browser.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.userBackground) {
        const val = changes.userBackground.newValue;
        if (val) {
            Object.assign(document.body.style, {
                backgroundImage:      `url(${val})`,
                backgroundSize:       'cover',
                backgroundPosition:   'center center',
                backgroundAttachment: 'fixed',
            });
        } else {
            Object.assign(document.body.style, {
                backgroundImage: '', backgroundSize: '',
                backgroundPosition: '', backgroundAttachment: '',
            });
        }
    }
});
const enhancedButtons = new WeakSet();

const buttonConfigs = [
    { type: 'default', symbol: '>', color: '#789922', title: 'Quote (>)' },
    { type: 'angle',   symbol: '<', color: '#f6750b', title: 'Quote (<)' },
    { type: 'caret',   symbol: '^', color: '#6f7de4', title: 'Quote (^)' },
    { type: 'unquote', symbol: '×', color: '#ff6b6b', title: 'Remove quotes' },
];

function createSymbolButton(config) {
    const button = document.createElement('a');
    button.className = 'enhanced-quote';
    button.href = 'javascript:void(0);';
    button.title = config.title;
    button.dataset.quoteType = config.type;
    button.textContent = config.symbol;
    Object.assign(button.style, {
        color: config.color, textDecoration: 'none', fontWeight: 'normal',
        padding: '0', margin: '0', background: 'none', border: 'none', cursor: 'pointer',
    });
    return button;
}

function createButtonGroup(originalButton) {
    const group = document.createElement('span');
    group.className = 'enhanced-quote-group';
    Object.assign(group.style, { marginLeft: '4px', letterSpacing: '-0.05em' });
    buttonConfigs.forEach((config, i) => {
        const button = createSymbolButton(config);
        button.addEventListener('click', handleQuoteClick);
        group.appendChild(button);
        if (i < buttonConfigs.length - 1) group.appendChild(document.createTextNode(' '));
    });
    return group;
}

function handleQuoteClick(event) {
    event.preventDefault();
    const button = event.currentTarget;
    if (typeof jQuery !== 'undefined') jQuery(window).trigger('cite', [0, false]);

    const post = button.closest('.post');
    if (!post) return;
    const body = post.querySelector('.body');
    if (!body) return;
    const originalText = body.innerText;
    let text = '';

    switch (button.dataset.quoteType) {
        case 'angle':   text = "<" + originalText.split("\n").join("\n<"); break;
        case 'caret':   text = "^" + originalText.split("\n").join("\n^"); break;
        case 'unquote': text = originalText.replace(/^[><^\s]+/gm, '');    break;
        default:        text = ">" + originalText.split("\n").join("\n>");
    }

    const textareas = document.getElementsByName("body");
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    for (let i = 0; i < textareas.length; i++) {
        textareas[i].value = text;
        if (i + 1 === textareas.length) {
            typeof jQuery !== 'undefined'
                ? jQuery(textareas[i]).trigger('focus')
                : textareas[i].focus();
        }
    }
    window.scrollTo(scrollX, scrollY);
}

function enhanceQuoteButton(originalButton) {
    if (enhancedButtons.has(originalButton)) return;
    try {
        const buttonGroup = createButtonGroup(originalButton);
        originalButton.replaceWith(buttonGroup);
        enhancedButtons.add(originalButton);
    } catch (error) {
        console.error('Error enhancing button:', error);
    }
}

let processing = false;
function handleMutations() {
    if (processing) return;
    processing = true;
    setTimeout(() => {
        document.querySelectorAll('a.post_quote:not(.enhanced-quote)').forEach(enhanceQuoteButton);
        processing = false;
    }, 100);
}

function initExtension() {
    new MutationObserver(handleMutations).observe(document.body, { childList: true, subtree: true });
    handleMutations();
}

if (document.readyState === 'complete') {
    initExtension();
} else {
    document.addEventListener('DOMContentLoaded', initExtension);
}


function initSoybooruSelector() {
    const SOYBOORU_API_BASE = 'https://soybooru.com/api/booru';
    const SEARCH_LIMIT = 20;
    const style = document.createElement('style');
    style.textContent = `
#soybooru-image-modal {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px;
    box-sizing: border-box;
}
#soybooru-image-modal > div {
    border: 1px solid rgba(128,128,128,0.6);
    background-clip: padding-box;
    backdrop-filter: blur(20px);
    background-color: rgba(255,255,255,0.3);
    box-sizing: border-box;
    box-shadow: 0 0 0 1px rgba(128,128,128,0.12) inset;
    width: 90%;
    max-width: 900px;
    height: 85vh;
    padding: 12px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
.soybooru-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    font-weight: 500;
    outline: none;
    border-radius: 0;
    border: 1px solid rgba(0,0,0,0.15);
    background-color: rgba(255,255,255,0.92);
    box-shadow: 2px 2px 0 0 rgba(0,0,0,0.25);
    height: 34px;
    padding: 0 10px;
    font-size: 11px;
    cursor: pointer;
    color: inherit;
    transition: background-color .12s, color .12s;
}
.soybooru-button:hover  { background-color: #0b1220; color: #fff; }
.soybooru-button:active { background-color: #f3f4f6; }
.soybooru-button:disabled { pointer-events: none; opacity: 0.5; }
.soybooru-search-input {
    flex: 1;
    min-width: 0;
    border: 1px solid rgba(0,0,0,0.2);
    padding: 6px 12px;
    height: 34px;
    font-size: 14px;
    background-color: rgba(0,0,0,0.10);
    color: inherit;
    outline: none;
    border-radius: 0;
    box-sizing: border-box;
}
.soybooru-search-input::placeholder { color: rgba(148,163,184,0.9); }
/* Top bar */
.soy-modal-top {
    display: flex;
    gap: 6px;
    margin-bottom: 8px;
    align-items: center;
    flex-wrap: wrap;
}
/* Pagination */
.soy-modal-pagination {
    display: none;
    margin-bottom: 8px;
    text-align: center;
    gap: 8px;
    align-items: center;
    justify-content: center;
}
.soy-modal-pagination.visible { display: flex; }
/* Image grid */
.soy-image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 8px;
    flex: 1;
    overflow-y: auto;
    align-content: start;
    padding-bottom: 4px;
    min-height: 0;
    min-width: 0;
}
@media (max-width: 600px) {
    .soy-image-grid { grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); }
}
/* Tiles */
.image-tile {
    overflow: hidden;
    border: 1px solid rgba(0,0,0,0.08);
    background: #ccc;
    position: relative;
    aspect-ratio: 1;
    cursor: pointer;
    height: 140px;
    width: 140px;
}
.image-tile img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.15s;
    display: block;
}
.image-tile:hover img { transform: scale(1.05); }
/* Hover bar — three stacked text buttons */
.soy-hover-bar {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    gap: 4px;
    padding: 6px;
    background: rgba(0,0,0,0.72);
    opacity: 0;
    transition: opacity .15s;
    z-index: 1;
    box-sizing: border-box;
}
.image-tile:hover .soy-hover-bar,
.image-tile:focus-within .soy-hover-bar { opacity: 1; }
.soy-hover-btn {
    cursor: pointer;
    font-size: 11px;
    font-weight: 600;
    color: #fff;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.2);
    padding: 4px 0;
    text-align: center;
    user-select: none;
    transition: background .1s;
}
.soy-hover-btn:hover { background: rgba(255,255,255,0.28); }
/* Progress bar */
.soy-progress-wrap {
    display: none;
    height: 3px;
    background: rgba(0,0,0,0.12);
    margin-bottom: 6px;
    overflow: hidden;
}
.soy-progress-wrap.visible { display: block; }
.soy-progress-bar {
    height: 100%;
    width: 0%;
    background: #0b1220;
    transition: width 0.2s;
}
`;
    (document.head || document.documentElement).appendChild(style);
    function simulateDrop(blob, filename) {
        const isFirefox = navigator.userAgent.includes('Firefox') 
            || (typeof browser !== 'undefined' && browser.runtime.getURL('').startsWith('moz'));

        const file = new File([blob], filename, { type: blob.type });

        if (!isFirefox) {
            const dt = new DataTransfer();
            dt.items.add(file);
            const dropzone = document.querySelector('.dropzone') || document.querySelector('label[for="file"]');
            if (dropzone) dropzone.dispatchEvent(new DragEvent('drop', { dataTransfer: dt, bubbles: true, cancelable: true }));
            return;
        }

        const reader = new FileReader();
        reader.onload = function () {
            const script = document.createElement('script');
            script.textContent = `
                (function() {
                    const byteString = atob("${reader.result.split(',')[1]}");
                    const ab = new ArrayBuffer(byteString.length);
                    const ia = new Uint8Array(ab);
                    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
                    const file = new File([ab], "${filename}", { type: "${blob.type}" });
                    const dt = new DataTransfer();
                    dt.items.add(file);
                    const dropzone = document.querySelector('.dropzone') || document.querySelector('label[for="file"]');
                    if (dropzone) dropzone.dispatchEvent(new DragEvent('drop', { dataTransfer: dt, bubbles: true, cancelable: true }));
                })();
            `;
            document.documentElement.appendChild(script);
            script.remove();
        };
        reader.readAsDataURL(blob);
    }
    function insertFromApiUrl(postId, modal, progressWrap, progressBar, cancelRef) {
        const fileUrl = `${SOYBOORU_API_BASE}/posts/${postId}/file`;
        progressWrap.classList.add('visible');
        progressBar.style.width = '30%';
        cancelRef.active = true;
 
        fetch(fileUrl)
            .then(res => {
                if (!res.ok) throw new Error('Failed to download file');
                progressBar.style.width = '60%';
                return Promise.all([res, res.blob()]);
            })
            .then(([res, blob]) => {
                if (!cancelRef.active) return;
                progressBar.style.width = '100%';
                const mimeExt = blob.type.split('/')[1] || 'png';
                const filename = `soybooru-${postId}.${mimeExt}`;
                simulateDrop(blob, filename);
                modal.remove();
            })
            .catch(err => {
                if (!cancelRef.active) return;
                console.error(err);
                progressWrap.classList.remove('visible');
                progressBar.style.width = '0%';
                alert('Failed to download image.');
            });
    }
    function insertFromFileUrl(post, modal, progressWrap, progressBar, cancelRef) {
        const postId  = post.id;
        const fileUrl = post.file_url || `${SOYBOORU_API_BASE}/posts/${postId}/file`;
        progressWrap.classList.add('visible');
        progressBar.style.width = '30%';
        cancelRef.active = true;
 
        fetch(fileUrl)
            .then(res => {
                if (!res.ok) throw new Error('Failed to download file');
                progressBar.style.width = '60%';
                return Promise.all([res, res.blob()]);
            })
            .then(([res, blob]) => {
                if (!cancelRef.active) return;
                progressBar.style.width = '100%';
 
                let filename = `soybooru-${postId}`;
                const disposition = res.headers && res.headers.get && res.headers.get('content-disposition');
                if (disposition) {
                    const m = disposition.match(/filename\*=UTF-8''([^;]+)|filename="([^"]+)"|filename=([^;]+)/);
                    const rawName = (m && (m[1] || m[2] || m[3])) || null;
                    if (rawName) {
                        try { filename = decodeURIComponent(rawName.replace(/^UTF-8''/, '')); }
                        catch (e) { filename = rawName; }
                    }
                }
                if (!filename || filename === `soybooru-${postId}`) {
                    if (post.ext) {
                        filename = `soybooru-${postId}.${post.ext.replace(/^\./, '')}`;
                    } else {
                        const mimeExt = blob.type && blob.type.split('/')[1];
                        filename = `soybooru-${postId}.${mimeExt || 'png'}`;
                    }
                }
 
                simulateDrop(blob, filename);
                modal.remove();
            })
            .catch(err => {
                if (!cancelRef.active) return;
                console.error('Error fetching image file:', err);
                progressWrap.classList.remove('visible');
                progressBar.style.width = '0%';
                alert('Failed to download image. Please try again.');
            });
    }
    function loadThumbnail(img, thumbUrl) {
        let blobUrl = null;
        img.onerror = () => {
            img.onerror = null;
            fetch(thumbUrl)
                .then(r => { if (!r.ok) throw new Error('failed'); return r.blob(); })
                .then(blob => {
                    if (blobUrl) URL.revokeObjectURL(blobUrl);
                    blobUrl = URL.createObjectURL(blob);
                    img.src = blobUrl;
                })
                .catch(() => {
                    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
                });
        };
        img.src = thumbUrl;
    }
    function createImageModal() {
        if (document.getElementById('soybooru-image-modal')) return;
 
        const modal = document.createElement('div');
        modal.id = 'soybooru-image-modal';
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
 
        const modalContent = document.createElement('div');
        const title = document.createElement('div');
        title.textContent = 'Insert a file from Soybooru...';
        title.style.cssText = 'font-weight:bold; margin-bottom:6px; font-size:13px;';
        const progressWrap = document.createElement('div');
        progressWrap.className = 'soy-progress-wrap';
        const progressBar = document.createElement('div');
        progressBar.className = 'soy-progress-bar';
        progressWrap.appendChild(progressBar); 
        const cancelRef = { active: false }; 
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'soybooru-button';
        cancelBtn.textContent = 'Cancel download';
        cancelBtn.style.cssText = 'display:none; margin-bottom:6px; font-size:11px;'; 
        const cancelWrap = document.createElement('div');
        cancelWrap.style.cssText = 'display:none; margin-bottom:6px;';
        cancelWrap.appendChild(cancelBtn);
 
        const progressObserver = new MutationObserver(() => {
            const visible = progressWrap.classList.contains('visible');
            cancelWrap.style.display = visible ? 'block' : 'none';
        });
        progressObserver.observe(progressWrap, { attributes: true, attributeFilter: ['class'] });
 
        cancelBtn.onclick = () => {
            cancelRef.active = false;
            progressWrap.classList.remove('visible');
            progressBar.style.width = '0%';
            cancelWrap.style.display = 'none';
        }; 
        const topRow = document.createElement('div');
        topRow.className = 'soy-modal-top';
 
        const closeBtn = document.createElement('button');
        closeBtn.className = 'soybooru-button';
        closeBtn.textContent = 'Close';
        closeBtn.onclick = () => modal.remove();
 
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search by tags (space-separated)...';
        searchInput.className = 'soybooru-search-input';
 
        const searchBtn = document.createElement('button');
        searchBtn.className = 'soybooru-button';
        searchBtn.textContent = 'Search';
 
        topRow.append(closeBtn, searchInput, searchBtn);

        const paginationDiv = document.createElement('div');
        paginationDiv.className = 'soy-modal-pagination';
 
        const prevBtn = document.createElement('button');
        prevBtn.className = 'soybooru-button';
        prevBtn.textContent = '← Prev';
        prevBtn.disabled = true;
 
        const pageInfo = document.createElement('span');
        pageInfo.style.cssText = 'font-size:12px; min-width:60px; text-align:center;';
 
        const nextBtn = document.createElement('button');
        nextBtn.className = 'soybooru-button';
        nextBtn.textContent = 'Next →';
 
        paginationDiv.append(prevBtn, pageInfo, nextBtn);
 
        const imageContainer = document.createElement('div');
        imageContainer.className = 'soy-image-grid';
 
        let currentQuery = '';
        let currentPage  = 1;
 
        function fetchImages(query, page = 1) {
            currentQuery = query;
            currentPage  = page;
            imageContainer.innerHTML = '';
 
            const url = `${SOYBOORU_API_BASE}/posts?q=${encodeURIComponent(query)}&limit=${SEARCH_LIMIT}&page=${page}`;
 
            fetch(url)
                .then(res => { if (!res.ok) throw new Error('Network error'); return res.json(); })
                .then(data => {
                    if (!data.posts || data.posts.length === 0) {
                        const msg = document.createElement('div');
                        msg.textContent = 'No images found for those tags.';
                        msg.style.cssText = 'text-align:center; margin-top:20px; font-size:14px; grid-column:1/-1;';
                        imageContainer.appendChild(msg);
                        paginationDiv.classList.remove('visible');
                        return;
                    }
 
                    data.posts.forEach(post => {
                        const postId   = post.id;
                        const thumbUrl = post.preview_url || post.sample_url || post.thumbnail
                            || `${SOYBOORU_API_BASE}/posts/${postId}/thumbnail`;
 
                        const wrapper = document.createElement('div');
                        wrapper.className = 'image-tile';
 
                        const img = document.createElement('img');
                        img.alt = `Post ${postId}`;
                        loadThumbnail(img, thumbUrl);
                        wrapper.appendChild(img);

                        const hoverBar = document.createElement('div');
                        hoverBar.className = 'soy-hover-bar';
                        hoverBar.addEventListener('click', e => e.stopPropagation());
 
                        const makeBtn = (label) => {
                            const b = document.createElement('div');
                            b.className = 'soy-hover-btn';
                            b.textContent = label;
                            return b;
                        };
 
                        const insertBtn = makeBtn('Insert');
                        const postBtn   = makeBtn('Open Post');
                        const fileBtn   = makeBtn('Open File');
 
                        hoverBar.append(insertBtn, postBtn, fileBtn);
                        wrapper.appendChild(hoverBar);
 
                        wrapper.addEventListener('click', () => {
                            insertFromFileUrl(post, modal, progressWrap, progressBar, cancelRef);
                        });
 
                        insertBtn.onclick = (e) => {
                            e.stopPropagation();
                            insertFromApiUrl(postId, modal, progressWrap, progressBar, cancelRef);
                        };
 
                        postBtn.onclick = (e) => {
                            e.stopPropagation();
                            window.open(`https://soybooru.com/post/view/${postId}`, '_blank');
                        };
 
                        fileBtn.onclick = (e) => {
                            e.stopPropagation();
                            window.open(`${SOYBOORU_API_BASE}/posts/${postId}/file`, '_blank');
                        };
 
                        imageContainer.appendChild(wrapper);
                    });
 
                    paginationDiv.classList.add('visible');
                    pageInfo.textContent = `Page ${currentPage}`;
                    prevBtn.disabled = currentPage === 1;
                    nextBtn.disabled = data.posts.length < SEARCH_LIMIT;
                })
                .catch(err => {
                    console.error('Soybooru fetch error:', err);
                    const msg = document.createElement('div');
                    msg.textContent = 'Error loading images. Please try again.';
                    msg.style.cssText = 'color:red; text-align:center; margin-top:20px; grid-column:1/-1;';
                    imageContainer.appendChild(msg);
                });
        }
 
        searchBtn.onclick = () => { const q = searchInput.value.trim(); if (q) fetchImages(q, 1); };
        searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') searchBtn.onclick(); });
        prevBtn.onclick = () => { if (currentPage > 1) fetchImages(currentQuery, currentPage - 1); };
        nextBtn.onclick = () => fetchImages(currentQuery, currentPage + 1);
 
        modalContent.append(title, progressWrap, cancelWrap, topRow, paginationDiv, imageContainer);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        setTimeout(() => searchInput.focus(), 50);
    }
    function addSoybooruLink() {
        if (document.getElementById('soybooru-link')) return;
        const uploadTd = document.getElementById('upload_selection');
        if (!uploadTd) return;
 
        uploadTd.appendChild(document.createTextNode(' / '));
        const link = document.createElement('a');
        link.id   = 'soybooru-link';
        link.href = 'javascript:void(0)';
        link.textContent = 'Soybooru';
        link.onclick = () => { createImageModal(); return false; };
        uploadTd.appendChild(link);
 
        observer.disconnect();
    }
 
    const observer = new MutationObserver(addSoybooruLink);
    observer.observe(document.body, { childList: true, subtree: true });
    addSoybooruLink();
};

browser.storage.sync.get({ soybooruEnabled: true }).then(({ soybooruEnabled }) => {
    if (soybooruEnabled) initSoybooruSelector();
});