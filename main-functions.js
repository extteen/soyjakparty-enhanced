// MAIN FUNCTIONS O ALGO
// EXTTEEN RELEASE (CHANGE THIS COMMENT IF YOU MODDED)
//spaghetti code

const audio = new Audio();
audio.preload = "auto";
audio.crossOrigin = "anonymous";
audio.volume = 0.5;

//theme handling test

function getActiveThemeCSS() {
    const themeLink = [...document.querySelectorAll('link[rel="stylesheet"]')]
        .find(link => link.href.includes('/stylesheets/') && !link.href.includes('font-awesome'));
    return themeLink?.href;
}

async function applyActiveTheme(extensionRoot) {
    const isTransparent = localStorage.getItem('transparencyDisabled') !== 'true';
    if (!isTransparent) {
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
        {
            label: 'AMERIMUTTS',
            zone: 'America/New_York',
            statusId: 'status-us',
            clockId: 'clock-us',
            icon: 'icons/timezonejaks/amerimutt.png',
        },
        {
            label: 'LATINXGODS',
            zone: 'America/Sao_Paulo',
            statusId: 'status-sa',
            clockId: 'clock-sa',
            icon: 'icons/timezonejaks/mexiaryan.png',
        },
        {
            label: 'AFRICABVLLS',
            zone: 'Africa/Lagos',
            statusId: 'status-af',
            clockId: 'clock-af',
            icon: 'icons/timezonejaks/africanbvll.png',
        },
        {
            label: 'EUROMUTTS',
            zone: 'Europe/Berlin',
            statusId: 'status-eu',
            clockId: 'clock-eu',
            icon: 'icons/timezonejaks/euromutt.png',
        },
        {
            label: 'PAJEETS', 
            zone: 'Asia/Kolkata',
            statusId: 'status-ca',
            clockId: 'clock-ca',
            icon: 'icons/timezonejaks/canadiansupersoldier.png',
        },
        {
            label: 'ASIANS',
            zone: 'Asia/Shanghai',
            statusId: 'status-as',
            clockId: 'clock-as',
            icon: 'icons/timezonejaks/asiaimpish.png',
        },
        {
            label: 'AUSTRALIARYANS',
            zone: 'Australia/Sydney',
            statusId: 'status-au',
            clockId: 'clock-au',
            icon: 'icons/timezonejaks/australiaimpish.png',
        },
    ];

    const extensionHost = document.createElement('div');
    extensionHost.id = 'spe-extension';
    document.body.appendChild(extensionHost);

    const shadowRoot = extensionHost.attachShadow({ mode: 'open' });



    const getActivityStatus = (hour) => {
        if (hour >= 0 && hour < 6) return 'Sleeping';
        if (hour >= 6 && hour < 10) return 'Partially Inactive';
        if (hour >= 10 && hour < 18) return 'Mostly Active';
        if (hour >= 18 && hour < 23) return 'Fully Active';
        return 'Winding Down';
    };

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = '▼ SPE Menu';
    toggleBtn.style.position = 'fixed';
    toggleBtn.style.top = '25px';
    toggleBtn.style.right = '10px';
    toggleBtn.style.zIndex = '9999';
    toggleBtn.style.padding = '6px 8px';

    toggleBtn.style.borderRadius = '5px';
    toggleBtn.style.cursor = 'pointer';
    toggleBtn.style.fontSize = '12px';
   

    document.body.appendChild(toggleBtn);

    const menuBox = document.createElement('div');
    menuBox.style.position = 'fixed';
    menuBox.style.top = '60px';
    menuBox.style.right = '10px'; 
    menuBox.style.zIndex = '100000';
    menuBox.style.backdropFilter = 'blur(20px)';
    menuBox.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
    menuBox.style.WebkitBackdropFilter = 'blur(10px)'
    menuBox.style.borderRadius = '6px';
    menuBox.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
    menuBox.style.padding = '10px 15px';

    menuBox.style.fontSize = '13px';
    menuBox.style.zIndex = '9999';
    menuBox.style.minWidth = '230px';
    menuBox.style.display = 'none';
    menuBox.style.maxHeight = '80vh';
    menuBox.style.overflowY = 'auto';


    const clocksSection = document.createElement('div');
    clocksSection.id = 'clocks-section';


    const clocksHeader = document.createElement('div');
    clocksHeader.style.display = 'flex';
    clocksHeader.style.justifyContent = 'space-between';
    clocksHeader.style.alignItems = 'center';
    clocksHeader.style.marginBottom = '10px';

    // Timezone title o algo
    const clocksTitle = document.createElement('div');
    clocksTitle.textContent = 'Timezones';
    clocksTitle.style.fontWeight = 'bold';

    // Top contols toggles
    const soundToggle = document.createElement('button');
    soundToggle.textContent = localStorage.getItem('notifEnabled') === 'true' ? '🔊' : '🔇';
    soundToggle.title = 'Toggle notification sounds';
    soundToggle.style.padding = '4px 8px';
    soundToggle.style.borderRadius = '4px';
    soundToggle.style.cursor = 'pointer';
    soundToggle.style.fontSize = '14px';

    const gcpToggle = document.createElement('button');
    gcpToggle.textContent = localStorage.getItem('GCPEnabled') === 'true' ? '🟢' : '🔴';
    gcpToggle.title = 'Toggle GCP dot';
    gcpToggle.style.padding = '4px 8px';
    gcpToggle.style.borderRadius = '4px';
    gcpToggle.style.cursor = 'pointer';
    gcpToggle.style.fontSize = '14px';
    gcpToggle.style.marginLeft = '8px'; 

    const transparencyToggle = document.createElement('button');
    transparencyToggle.textContent = localStorage.getItem('transparencyDisabled') === 'true' ? '◼' : '◻';
    transparencyToggle.title = 'Toggle transparency effects';
    transparencyToggle.style.padding = '4px 8px';
    transparencyToggle.style.borderRadius = '4px';
    transparencyToggle.style.cursor = 'pointer';
    transparencyToggle.style.fontSize = '14px';
    transparencyToggle.style.marginLeft = '8px';

    const searchmodeToggle = document.createElement('button');
    searchmodeToggle.textContent = localStorage.getItem('soybooruDirectSearch') === 'true' ? '🌐' : '🔍';
    searchmodeToggle.title = 'Toggle Soybooru Search mode';
    searchmodeToggle.style.padding = '4px 8px';
    searchmodeToggle.style.borderRadius = '4px';
    searchmodeToggle.style.cursor = 'pointer';
    searchmodeToggle.style.fontSize = '14px';
    searchmodeToggle.style.marginLeft = '8px';


    clocksHeader.appendChild(clocksTitle);
    
    clocksSection.insertBefore(clocksHeader, clocksSection.firstChild);

    const settingsContainer = document.createElement('div');
    settingsContainer.id = 'settings-container';
    settingsContainer.style.display = 'none';


    const expandBtn = document.createElement('button');
    expandBtn.textContent = '▼ Expand Settings ⚙';
    expandBtn.style.width = '100%';
    expandBtn.style.marginTop = '10px';
    expandBtn.style.padding = '4px 0';
    expandBtn.style.background = 'none';
    expandBtn.style.border = 'none';

    expandBtn.style.cursor = 'pointer';
    expandBtn.style.textAlign = 'right';
    expandBtn.style.fontSize = '12px';
    

    TIMEZONES.forEach(({ label, clockId, statusId, icon }) => {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.marginBottom = '8px';

        const img = document.createElement('img');
        img.src = browser.runtime.getURL(icon);
        img.alt = '';
        img.style.width = '25px';
        img.style.height = '25px';
        img.style.marginRight = '6px';
        img.style.objectFit = 'contain';
        img.style.flexShrink = '0';

        const textContainer = document.createElement('div');
        textContainer.innerHTML = `
            <strong>${label}:</strong> <span id="${clockId}">--:--:--</span><br>
            <span id="${statusId}" style="font-size: 12px;">Checking...</span>
        `;

        row.appendChild(img);
        row.appendChild(textContainer);
        clocksSection.appendChild(row);
    });

    const topControls = document.createElement('div');
    topControls.style.display = 'flex';
    topControls.style.justifyContent = 'flex-end';
    topControls.style.alignItems = 'center';
    topControls.style.marginBottom = '10px';

    topControls.appendChild(soundToggle);
    topControls.appendChild(gcpToggle);
    topControls.appendChild(transparencyToggle);
    topControls.appendChild(searchmodeToggle);


    const settingsDivider = document.createElement('hr');
    settingsDivider.style.marginTop = '10px';

    menuBox.appendChild(topControls);
    menuBox.appendChild(settingsDivider);

    const settingsHeader = document.createElement('div');
    settingsHeader.style.display = 'flex';
    settingsHeader.style.alignItems = 'center';
    settingsHeader.style.gap = '250px';


    const updateBtn = document.createElement('button');
    updateBtn.textContent = 'Updates/About SPE';
    updateBtn.title = 'Check for new versions';
    updateBtn.style.padding = '4px 8px';
    updateBtn.style.cursor = 'pointer';
    updateBtn.style.borderRadius = '4px';
    updateBtn.style.fontSize = '10px';
    updateBtn.style.marginTop = '3px';
    updateBtn.style.fontWeight = 'bold';
    updateBtn.style.whiteSpace = 'nowrap';


    updateBtn.addEventListener('click', () => {
        updatePopup.style.display = 'block';
    });


    const settingsTitle = document.createElement('div');
    settingsTitle.textContent = 'Settings';
    settingsTitle.style.fontWeight = 'bold';

    const notifLabel = document.createElement('label');
    notifLabel.textContent = ' Enable Notifications';
    notifLabel.style.display = 'block';
    notifLabel.style.marginTop = '10px';

    const notifCheckbox = document.createElement('input');
    notifCheckbox.type = 'checkbox';
    notifCheckbox.id = 'notif-toggle';

    settingsHeader.appendChild(settingsTitle);
    settingsHeader.appendChild(updateBtn);

    settingsContainer.appendChild(settingsHeader);
    notifLabel.prepend(notifCheckbox);
    settingsContainer.appendChild(notifLabel);

    notifCheckbox.checked = localStorage.getItem('notifEnabled') === 'true';

    notifCheckbox.addEventListener('change', () => {
        localStorage.setItem('notifEnabled', notifCheckbox.checked);
        
        soundToggle.textContent = notifCheckbox.checked ? '🔊' : '🔇';

    });
    soundToggle.addEventListener('click', () => {
        notifCheckbox.checked = !notifCheckbox.checked;
        localStorage.setItem('notifEnabled', notifCheckbox.checked);
        soundToggle.textContent = notifCheckbox.checked ? '🔊' : '🔇';

        notifCheckbox.dispatchEvent(new Event('change'));
    });
    transparencyToggle.addEventListener('click', () => {
        transparencyCheckbox.checked = !transparencyCheckbox.checked;
        localStorage.setItem('transparencyDisabled', transparencyCheckbox.checked);
        transparencyToggle.textContent = transparencyCheckbox.checked ? '◼' : '◻';
        transparencyCheckbox.dispatchEvent(new Event('change'));
    });



    const soundSelectLabel = document.createElement('label');
    soundSelectLabel.textContent = 'Select Sound:';
    soundSelectLabel.style.display = 'block';
    soundSelectLabel.style.marginTop = '10px';
    settingsContainer.appendChild(soundSelectLabel);

    //SOUND SELECT IN MENU

    const soundSelect = document.createElement('select');
    soundSelect.id = 'notif-sound-select';
    ['imrcv.mp3','cobgang.mp3', 'doit.mp3',"'cord.mp3",'yougotmail.mp3'].forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        soundSelect.appendChild(opt);
    });
    settingsContainer.appendChild(soundSelect);

    const customSoundWrapper = document.createElement('div');
    customSoundWrapper.style.display = 'flex';
    customSoundWrapper.style.alignItems = 'center';
    customSoundWrapper.style.gap = '6px';
    customSoundWrapper.style.marginTop = '10px';

    const customSoundLabel = document.createElement('label');
    customSoundLabel.textContent = 'Upload custom sound:';
    customSoundLabel.style.flex = '1';

    const customSoundInput = document.createElement('input');
    customSoundInput.type = 'file';
    customSoundInput.accept = 'audio/*';
    customSoundInput.style.flex = '2';


    const clearSoundBtn = document.createElement('button');
    clearSoundBtn.textContent = '🗑️';
    clearSoundBtn.title = 'Remove custom sound';
    clearSoundBtn.style.padding = '4px 8px';
    clearSoundBtn.style.cursor = 'pointer';

    clearSoundBtn.style.borderRadius = '4px';

    customSoundWrapper.appendChild(customSoundLabel);
    customSoundWrapper.appendChild(customSoundInput);
    customSoundWrapper.appendChild(clearSoundBtn);
    settingsContainer.appendChild(customSoundWrapper);

    //GCP IN MENU

    const settingsDivider2 = document.createElement('hr');
    settingsContainer.appendChild(settingsDivider2);

    const GCPLabel = document.createElement('label');
    GCPLabel.textContent = ' Enable GCP dot*';
    GCPLabel.style.display = 'block';
    GCPLabel.style.marginTop = '10px';

    const GCPCheckbox = document.createElement('input');
    GCPCheckbox.type = 'checkbox';
    GCPCheckbox.id = 'GCP-toggle';

    GCPLabel.prepend(GCPCheckbox);
    settingsContainer.appendChild(GCPLabel);

    GCPCheckbox.checked = localStorage.getItem('GCPEnabled') === 'true';

    GCPCheckbox.addEventListener('change', () => {
        localStorage.setItem('GCPEnabled', GCPCheckbox.checked);
        
        gcpToggle.textContent = GCPCheckbox.checked ? '🟢' : '🔴';
        
    });
    gcpToggle.addEventListener('click', () => {
        GCPCheckbox.checked = !GCPCheckbox.checked;
        localStorage.setItem('GCPEnabled', GCPCheckbox.checked);
        gcpToggle.textContent = GCPCheckbox.checked ? '🟢' : '🔴';
       
        GCPCheckbox.dispatchEvent(new Event('change'));
    });

    const transparencyLabel = document.createElement('label');
    transparencyLabel.textContent = ' Use basic theme and disable effects';
    transparencyLabel.style.display = 'block';
    transparencyLabel.style.marginTop = '10px';

    const transparencyCheckbox = document.createElement('input');
    transparencyCheckbox.type = 'checkbox';
    transparencyCheckbox.id = 'transparency-toggle';

    transparencyLabel.prepend(transparencyCheckbox);
    settingsContainer.appendChild(transparencyLabel);

    transparencyCheckbox.checked = localStorage.getItem('transparencyDisabled') === 'true';
    updateTransparencyEffects(); 

    transparencyCheckbox.addEventListener('change', () => {
        localStorage.setItem('transparencyDisabled', transparencyCheckbox.checked);
        updateTransparencyEffects();
        document.dispatchEvent(new CustomEvent('transparencyChanged', {
            detail: { isTransparent: !transparencyCheckbox.checked }
        }));
    });
    document.addEventListener('transparencyChanged', (e) => {
        transparencyCheckbox.checked = !e.detail.isTransparent;
        updateTransparencyEffects();
    });

    const rusearchModeLabel = document.createElement('label');
    rusearchModeLabel.textContent = ' Simplify Soybooru Search features';
    rusearchModeLabel.style.display = 'block';
    rusearchModeLabel.style.marginTop = '10px';

    const rusearchModeCheckbox = document.createElement('input');
    rusearchModeCheckbox.type = 'checkbox';
    rusearchModeCheckbox.id = 'searchmode-toggle';

    rusearchModeLabel.prepend(rusearchModeCheckbox);
    settingsContainer.appendChild(rusearchModeLabel);

    rusearchModeCheckbox.checked = localStorage.getItem('soybooruDirectSearch') === 'true';

    rusearchModeCheckbox.addEventListener('change', () => {
        localStorage.setItem('soybooruDirectSearch', rusearchModeCheckbox.checked);

        searchmodeToggle.textContent = rusearchModeCheckbox.checked ? '🌐' : '🔍';

    });
    searchmodeToggle.addEventListener('click', () => {
        rusearchModeCheckbox.checked = !rusearchModeCheckbox.checked;
        localStorage.setItem('soybooruDirectSearch', rusearchModeCheckbox.checked);
        searchmodeToggle.textContent = rusearchModeCheckbox.checked ? '🌐' : '🔍';

        rusearchModeCheckbox.dispatchEvent(new Event('change'));
    });

    const previewcountMode = document.createElement('label');
    previewcountMode.textContent = 'Select preview / character counter mode:';
    previewcountMode.style.display = 'block';
    previewcountMode.style.marginTop = '10px';
    function createLPDropdown(container) {
        const MODE_FLAGS = {
            nothing: { lp_attach: 'false', lp_enableCounter: 'false', lp_enablePreview: 'false' },
            counter: { lp_attach: 'true', lp_enableCounter: 'true', lp_enablePreview: 'false' },
            preview: { lp_attach: 'true', lp_enableCounter: 'false', lp_enablePreview: 'true' },
            both: { lp_attach: 'true', lp_enableCounter: 'true', lp_enablePreview: 'true' }
        };

        const root = typeof container === 'string' ? document.querySelector(container) : (container || document.body);
        if (!root) throw new Error('createLPDropdown: container not found');

        const EXISTING_ID = 'lp-mode-select';
        const prev = document.getElementById(EXISTING_ID);
        if (prev && prev.parentNode) prev.parentNode.removeChild(prev);

        const select = document.createElement('select');
        select.id = EXISTING_ID;

        [['nothing', 'Nothing'], ['counter', 'Only counter'], ['preview', 'Only preview'], ['both', 'Both']].forEach(([v, t]) => {
            const opt = document.createElement('option');
            opt.value = v;
            opt.textContent = t;
            select.appendChild(opt);
        });

        function currentMode() {
            if (localStorage.getItem('lp_attach') === 'false') return 'nothing';
            const c = localStorage.getItem('lp_enableCounter') === 'true';
            const p = localStorage.getItem('lp_enablePreview') === 'true';
            if (c && p) return 'both';
            if (c && !p) return 'counter';
            if (p && !c) return 'preview';
            return 'nothing';
        }

        function writeFlags(flags) {
            Object.keys(flags).forEach(k => localStorage.setItem(k, String(flags[k])));
            try { if (window.livePreview && typeof window.livePreview.setFlags === 'function') window.livePreview.setFlags(flags); } catch (e) { }
            try { document.dispatchEvent(new CustomEvent('livePreview:flagsChanged', { detail: flags })); } catch (e) { }
        }

        select.value = currentMode();

        select.addEventListener('change', () => {
            const flags = MODE_FLAGS[select.value] || MODE_FLAGS.nothing;
            writeFlags(flags);
        });

        root.appendChild(select);
        return select;
    }
    settingsContainer.appendChild(previewcountMode)
    createLPDropdown(settingsContainer);

    function updateTransparencyEffects() {
        const isDisabled = transparencyCheckbox.checked;

        if (isDisabled) {

            menuBox.style.backdropFilter = 'none';
            menuBox.style.WebkitBackdropFilter = 'none';
            menuBox.style.backgroundColor = '#ffffff';
            menuBox.style.fontFamily = 'monospace';
            menuBox.style.color = '#000000';

            document.querySelectorAll('#spe-extension button').forEach(btn => {
                btn.style.backdropFilter = 'none';
                btn.style.backgroundColor = '#f0f0f0';
                btn.style.fontFamily = 'monospace';
                btn.style.color = '#000000';
            });
        } else {
            menuBox.style.backdropFilter = 'blur(20px)';
            menuBox.style.WebkitBackdropFilter = 'blur(10px)';
            menuBox.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            menuBox.style.fontFamily = '';
            menuBox.style.color = '';

            document.querySelectorAll('#spe-extension button').forEach(btn => {
                btn.style.backdropFilter = 'blur(20px)';
                btn.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
                btn.style.fontFamily = '';
                btn.style.color = '';
            });
        }
    }

    //CUSTOM BACKGROUND IN MENU


    const settingsDivider3 = document.createElement('hr');
    settingsContainer.appendChild(settingsDivider3);

    const customBGLabel = document.createElement('label');
    customBGLabel.textContent = 'Upload custom background:';
    customBGLabel.style.flex = '1';

    const customBGInput = document.createElement('input');
    customBGInput.type = 'file';
    customBGInput.accept = 'image/*';
    customBGInput.style.flex = '2';

    const clearBGBtn = document.createElement('button');
    clearBGBtn.textContent = '🗑️';
    clearBGBtn.title = 'Remove custom sound';
    clearBGBtn.style.padding = '4px 8px';
    clearBGBtn.style.cursor = 'pointer';

    clearBGBtn.style.borderRadius = '4px';



    settingsContainer.appendChild(customBGLabel);
    settingsContainer.appendChild(customBGInput);
    settingsContainer.appendChild(clearBGBtn);

    customBGInput.addEventListener('change', e => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (ev) {
                const imageUrl = ev.target.result;
                
                document.body.style.backgroundImage = `url(${imageUrl})`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundPosition = 'center center';
                document.body.style.backgroundAttachment = 'fixed';

                
                localStorage.setItem('userBackground', imageUrl);
            };
            reader.readAsDataURL(file);
        }
    });

    clearBGBtn.addEventListener('click', () => {

        document.body.style.backgroundImage = '';
        document.body.style.backgroundSize = '';
        document.body.style.backgroundPosition = '';
        document.body.style.backgroundAttachment = '';

        localStorage.removeItem('userBackground');
        alert('(You) removed a custom background. Reverted to default.');
    });


    soundSelect.id = 'notif-sound-select';

    let customSoundURL = localStorage.getItem('customSound') || null;
    const savedSound = localStorage.getItem('selectedSound') || 'imrcv.mp3';
    soundSelect.value = savedSound;


    function updateAudioSrc() {
        if (customSoundURL) {
            audio.src = customSoundURL;
        } else {
            const defaultSound = soundSelect.value;
            audio.src = browser.runtime.getURL(`audio/${defaultSound}`);
        }
    }


    updateAudioSrc();

    soundSelect.addEventListener('change', () => {
        if (!customSoundURL) {
            updateAudioSrc();
        }
        localStorage.setItem('selectedSound', soundSelect.value);
    });

    customSoundInput.addEventListener('change', e => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(ev) {
                customSoundURL = ev.target.result;
                localStorage.setItem('customSound', customSoundURL);
                updateAudioSrc();
            };
            reader.readAsDataURL(file);
        }
    });

    clearSoundBtn.addEventListener('click', () => {
        customSoundURL = null;
        localStorage.removeItem('customSound');
        customSoundInput.value = '';
        updateAudioSrc();
        alert('(You) removed a custom sound. Reverted to default.');
    });
    soundSelect.addEventListener('change', () => {
        if (!customSoundURL) {
            updateAudioSrc();
        }
    });

    // USER-CUSTOM BOARD LINKS
    const settingsDivider4 = document.createElement('hr');
    settingsContainer.appendChild(settingsDivider4);

    const customLinkLabel = document.createElement('label');
    customLinkLabel.textContent = 'Add custom header boardlist link:';
    customLinkLabel.style.display = 'block';
    customLinkLabel.style.marginTop = '10px';
    settingsContainer.appendChild(customLinkLabel);

    const customLinkInput = document.createElement('input');
    customLinkInput.type = 'text';
    customLinkInput.placeholder = 'e.g. gem';
    customLinkInput.style.width = '70%';
    customLinkInput.style.marginRight = '5px';
    settingsContainer.appendChild(customLinkInput);

    const addLinkBtn = document.createElement('button');
    addLinkBtn.textContent = 'Add';
    addLinkBtn.style.padding = '4px 8px';
    addLinkBtn.style.cursor = 'pointer';

    addLinkBtn.style.borderRadius = '4px';
    settingsContainer.appendChild(addLinkBtn);

    const clearLinksBtn = document.createElement('button');
    clearLinksBtn.textContent = '🗑️';
    clearLinksBtn.title = 'Clear all custom links';
    clearLinksBtn.style.marginLeft = '8px';
    clearLinksBtn.style.padding = '4px 8px';
    clearLinksBtn.style.cursor = 'pointer';

    clearLinksBtn.style.borderRadius = '4px';
    settingsContainer.appendChild(clearLinksBtn);


    // FUNCTIONS OF FEATURES IN SETTINGS


    function renderCustomLinks() {
        const boardList = document.querySelector('.boardlist');
        if (!boardList) return;

        boardList.querySelectorAll('.custom-boardlink').forEach(el => el.remove());

        const saved = JSON.parse(localStorage.getItem('customBoardLinks') || '[]');
        if (saved.length === 0) return;

        const customSpan = document.createElement('span');
        customSpan.className = 'sub custom-boardlink';
        customSpan.innerHTML = '[ ' + saved.map(board => `<a href="https://www.soyjak.st/${board}" title="Custom board">${board}</a>`).join(' / ') + ' ]';
        

        const searchwiki = document.createElement("input");
        searchwiki.type = "text";
        searchwiki.placeholder = "Soyjak Wiki search...";
        searchwiki.style.width = "120px";
        searchwiki.style.padding = "2px";
        searchwiki.style.fontSize = "10px"

        boardList.appendChild(customSpan);
        boardList.appendChild(searchwiki);

        searchwiki.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                const query = searchwiki.value.trim();
                if (query) {

                    const url = "https://soyjakwiki.org/index.php?search=" + encodeURIComponent(query);


                    window.open(url, "_blank");
                }
            }
        });
    }

    addLinkBtn.addEventListener('click', () => {
        const val = customLinkInput.value.trim();
        if (!val || /[^a-z0-9]/i.test(val)) {
            alert('Invalid board name.');
            return;
        }
        const saved = JSON.parse(localStorage.getItem('customBoardLinks') || '[]');
        if (!saved.includes(val)) {
            saved.push(val);
            localStorage.setItem('customBoardLinks', JSON.stringify(saved));
            renderCustomLinks();
            customLinkInput.value = '';
        }
    });

    clearLinksBtn.addEventListener('click', () => {
        if (confirm('Do you really want to remove your custom links saar?')) {
            localStorage.removeItem('customBoardLinks');
            renderCustomLinks();
        }
    });



    renderCustomLinks();



    document.body.appendChild(menuBox);

    window.addEventListener('load', () => {
        const savedBackground = localStorage.getItem('userBackground');
        if (savedBackground) {
            document.body.style.backgroundImage = `url(${savedBackground})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center center';
            document.body.style.backgroundAttachment = 'fixed';
        }
    });




    toggleBtn.addEventListener('click', () => {
        const isOpening = menuBox.style.display === 'none';
        menuBox.style.display = isOpening ? 'block' : 'none';
        toggleBtn.textContent = visible ? '▼ SPE Menu' : '▲ SPE Menu';

        
    });


    function updateClocks() {
        TIMEZONES.forEach(({ zone, clockId, statusId }) => {
            const now = new Date().toLocaleString('en-US', { timeZone: zone });
            const date = new Date(now);
            const timeStr = date.toTimeString().split(' ')[0];
            const hour = date.getHours();

            const clockEl = document.getElementById(clockId);
            const statusEl = document.getElementById(statusId);

            if (clockEl) clockEl.textContent = timeStr;
            if (statusEl) statusEl.textContent = getActivityStatus(hour);
        });
    }

    updateClocks();
    setInterval(updateClocks, 1000);

    const refreshNote = document.createElement('div');
    refreshNote.textContent = 'Some changes can require a refresh to fully apply o algx';
    refreshNote.style.fontSize = '11px';

    refreshNote.style.marginTop = '10px';
    refreshNote.style.fontStyle = 'italic';

    expandBtn.addEventListener('click', () => {
        const isHidden = settingsContainer.style.display === 'none';
        settingsContainer.style.display = isHidden ? 'block' : 'none';
        expandBtn.textContent = isHidden ? '▲ Collapse Settings ⚙' : '▼ Expand Settings ⚙';
    });

    settingsContainer.appendChild(refreshNote);
    menuBox.appendChild(clocksSection);
    menuBox.appendChild(expandBtn);
    menuBox.appendChild(settingsContainer);

    applyActiveTheme(extensionHost);

    new MutationObserver(() => applyActiveTheme(extensionHost))
        .observe(document.head, { childList: true });


}

createSEClockMenu();

//BADGES

const capcodes = document.querySelectorAll('.capcode');

const badgeSources = {
  '## Admin': 'icons/admin-gemjak.png',
  '## Mod': 'icons/janny-badge.png',
  '## Unused': 'icons/approver-oalgo.png'
};

capcodes.forEach(capcode => {
  const text = capcode.innerText.trim();

  if (badgeSources[text]) {
    const badge = document.createElement('img');
    badge.src = browser.runtime.getURL(badgeSources[text]);
    badge.alt = `${text} Badge`;
    badge.classList.add('badge');

  
    badge.style.width = '20px';
    badge.style.height = '20px';
    badge.style.marginLeft = '5px';
    badge.style.verticalAlign = 'middle';


    capcode.appendChild(badge);
  }
});

// NOTIFICATION
let lastCount = 0;
let userInteracted = false;
['click', 'keydown', 'scroll'].forEach(evt =>
    window.addEventListener(evt, () => userInteracted = true, { once: true })
);
function getTitleCount() {
    const match = document.title.match(/^\((\d+)\)/);
    return match ? parseInt(match[1], 10) : 0;
}
setInterval(() => {
    const currentCount = getTitleCount();
    const notifEnabled = localStorage.getItem('notifEnabled') === 'true';
    if (
        notifEnabled &&
        currentCount > lastCount &&
        userInteracted &&
        document.hidden
    ) {
        audio.play().catch(e => {

        });
    }
    lastCount = currentCount;
}, 1000);

if (localStorage.getItem('GCPEnabled') === 'true') {
    if (window.top === window.self) {
        if (!document.getElementById('gcp-dot-iframe')) {
            const iframe = document.createElement('iframe');
            iframe.id = 'gcp-dot-iframe';
            iframe.src = "https://global-mind.org/gcpdot/gcp.html";
            iframe.scrolling = "no";
            iframe.style.overflow = "hidden";
            iframe.style.cssText = `
        position:fixed;
        top:25px;
        left:5px;
        width:50px;
        height:50px;
        z-index:10000;
        border:none;
        border-radius:8px;
      `;

            document.body.appendChild(iframe);
        }
    }
}

// quotey quotes
const enhancedButtons = new WeakSet();

const buttonConfigs = [
    { type: 'default', symbol: '>', color: '#789922', title: 'Quote (>)' },
    { type: 'angle', symbol: '<', color: '#f6750b', title: 'Quote (<)' },
    { type: 'caret', symbol: '^', color: '#6f7de4', title: 'Quote (^)' },
    { type: 'unquote', symbol: '×', color: '#ff6b6b', title: 'Remove quotes' }
];

function createSymbolButton(config) {
    const button = document.createElement('a');
    button.className = 'enhanced-quote';
    button.href = 'javascript:void(0);';
    button.title = config.title;
    button.dataset.quoteType = config.type;
    button.textContent = config.symbol;

    button.style.color = config.color;
    button.style.textDecoration = 'none';
    button.style.fontWeight = 'normal';
    button.style.padding = '0';
    button.style.margin = '0';
    button.style.background = 'none';
    button.style.border = 'none';
    button.style.cursor = 'pointer';

    return button;
}

function createButtonGroup(originalButton) {
    const group = document.createElement('span');
    group.className = 'enhanced-quote-group';
    group.style.marginLeft = '4px';
    group.style.letterSpacing = '-0.05em';
    buttonConfigs.forEach(config => {
        const button = createSymbolButton(config);
        button.addEventListener('click', handleQuoteClick);
        group.appendChild(button);

        
        if (config !== buttonConfigs[buttonConfigs.length - 1]) {
            group.appendChild(document.createTextNode(' '));
        }
    });

    return group;
}
function handleQuoteClick(event) {
    event.preventDefault();
    const button = event.currentTarget;

    if (typeof jQuery !== 'undefined') {
        jQuery(window).trigger('cite', [0, false]);
    }

    const post = button.closest('.post');
    if (!post) return;

    const body = post.querySelector('.body');
    if (!body) return;

    let originalText = body.innerText;
    let text = '';

    switch (button.dataset.quoteType) {
        case 'angle':
            text = "<" + originalText.split("\n").join("\n<");
            break;
        case 'caret':
            text = "^" + originalText.split("\n").join("\n^");
            break;
        case 'unquote':
            text = originalText.replace(/^[><^\s]+/gm, '');
            break;
        default:
            text = ">" + originalText.split("\n").join("\n>");
    }

    var textareas = document.getElementsByName("body");
    var scrollX = window.scrollX || window.pageXOffset;
    var scrollY = window.scrollY || window.pageYOffset;

    for (var i = 0; i < textareas.length; i++) {
        textareas[i].value = text;

        if (i + 1 == textareas.length) {

            if (typeof jQuery !== 'undefined') {
                jQuery(textareas[i]).trigger('focus');
            } else {
                textareas[i].focus();
            }
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
        const quoteButtons = document.querySelectorAll('a.post_quote:not(.enhanced-quote)');
        quoteButtons.forEach(enhanceQuoteButton);
        processing = false;
    }, 100);
}

function initExtension() {
    const observer = new MutationObserver(handleMutations);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });


    handleMutations();
}

if (document.readyState === 'complete') {
    initExtension();
} else {
    document.addEventListener('DOMContentLoaded', initExtension);
}


if (localStorage.getItem('GCPEnabled') === 'true') {
    const iframe = document.createElement('iframe');
    iframe.src = browser.runtime.getURL("gcpdot.html");
    iframe.style.position = 'fixed';
    iframe.style.top = '25px';
    iframe.style.left = '5px';
    iframe.style.width = '55px';
    iframe.style.height = '55px';
    iframe.style.zIndex = '10000';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '8px';

    document.body.appendChild(iframe);
}

window.addEventListener('storage', (event) => {
    if (event.key === 'transparencyDisabled') {
        if (typeof updateTransparencyEffects !== 'undefined') {
            updateTransparencyEffects();
        }
        if (typeof updateAllTransparencyEffects !== 'undefined') {
            updateAllTransparencyEffects();
        }
    }
});

// Update handling section

const updatePopup = document.createElement('div');
updatePopup.style.position = 'fixed';
updatePopup.style.top = '50%';
updatePopup.style.left = '50%';
updatePopup.style.transform = 'translate(-50%, -50%)';
updatePopup.style.zIndex = '100000';
updatePopup.style.background = 'white';
updatePopup.style.padding = '30px';
updatePopup.style.borderRadius = '10px';
updatePopup.style.boxShadow = '0 0 16px rgba(0,0,0,0.4)';
updatePopup.style.minWidth = '600px';
updatePopup.style.fontSize = '14px';
updatePopup.style.display = 'none';
updatePopup.style.textAlign = 'left';
updatePopup.style.fontFamily = 'sans-serif';
updatePopup.style.maxWidth = '120vw';
updatePopup.style.maxHeight = '100vh';
updatePopup.style.overflowY = 'auto';
updatePopup.style.backdropFilter = 'blur(20px)';
updatePopup.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
updatePopup.style.WebkitBackdropFilter = 'blur(10px)';

const titleEl = document.createElement('h2');
titleEl.textContent = 'Soyjak Party Enhanced';
titleEl.style.marginTop = '0';
titleEl.style.fontSize = '28px';
titleEl.style.fontWeight = 'bold';
titleEl.style.marginBottom = '12px';
titleEl.style.textAlign = 'left';

const udiv = document.createElement('hr');

const versionEl = document.createElement('div');
versionEl.textContent = `Current version: ${browser.runtime.getManifest().version}`;
versionEl.style.marginBottom = '10px';

const checkBtn = document.createElement('button');
checkBtn.textContent = 'Check for updates';
checkBtn.style.marginTop = '10px';
checkBtn.style.padding = '6px 10px';
checkBtn.style.borderRadius = '4px';
checkBtn.disabled = false;
checkBtn.style.cursor = 'pointer';
checkBtn.title = 'Click to check for updates';

checkBtn.addEventListener('click', async () => {
    checkForUpdates();
});

const githubLink = document.createElement('a');
githubLink.href = 'https://github.com/extteen/soyjakparty-enhanced';
githubLink.target = '_blank';
githubLink.textContent = 'GitHub Repo';
githubLink.style.display = 'block';
githubLink.style.marginTop = '10px';

const changelogLink = document.createElement('a');
changelogLink.href = 'https://github.com/extteen/soyjakparty-enhanced/releases';
changelogLink.target = '_blank';
changelogLink.textContent = 'Changelog';
changelogLink.style.display = 'block';

const closeBtn = document.createElement('button');
closeBtn.textContent = '✖ Close';
closeBtn.style.marginTop = '20px';
closeBtn.style.padding = '6px 10px';
closeBtn.style.cursor = 'pointer';
closeBtn.style.borderRadius = '4px';

const debuglink = document.createElement('a');
debuglink.href = '#';
debuglink.textContent = 'Debug Menu';
debuglink.style.display = 'block';
debuglink.style.fontSize = '12px';
debuglink.style.marginTop = '8px';
debuglink.addEventListener('click', (e) => {
    e.preventDefault();
    debugMenu.style.display = debugMenu.style.display === 'none' ? 'block' : 'none';
});

updatePopup.appendChild(titleEl);
updatePopup.appendChild(udiv);
updatePopup.appendChild(versionEl);
updatePopup.appendChild(checkBtn);
updatePopup.appendChild(githubLink);
updatePopup.appendChild(changelogLink);
updatePopup.appendChild(closeBtn);
updatePopup.appendChild(debuglink);
document.body.appendChild(updatePopup);

closeBtn.addEventListener('click', () => {
    updatePopup.style.display = 'none';
});

const GITHUB_REPO = "extteen/soyjakparty-enhanced";

function normalizeVersionTag(tag) {
    if (!tag) return "";
    return String(tag).replace(/^pr[-_]?v?/i, '').replace(/^v/i, '').trim();
}

const canProgrammaticUpdate =
    typeof browser?.runtime?.requestUpdateCheck === 'function' ||
    typeof chrome?.runtime?.requestUpdateCheck === 'function';

const updateActionSection = document.createElement('div');
updateActionSection.style.display = 'none';
updateActionSection.style.marginTop = '12px';
updateActionSection.style.paddingTop = '10px';
updateActionSection.style.borderTop = '1px solid rgba(0,0,0,0.08)';
updateActionSection.style.textAlign = 'center';

const updateMessage = document.createElement('div');
updateMessage.style.fontWeight = '600';
updateMessage.style.marginBottom = '8px';
updateActionSection.appendChild(updateMessage);

const doUpdateBtn = document.createElement('button');
doUpdateBtn.textContent = 'Update Now';
doUpdateBtn.style.padding = '6px 10px';
doUpdateBtn.style.borderRadius = '6px';
doUpdateBtn.style.marginRight = '8px';
doUpdateBtn.style.cursor = 'pointer';

const openReleaseBtn = document.createElement('button');
openReleaseBtn.textContent = 'Open Release';
openReleaseBtn.style.padding = '6px 10px';
openReleaseBtn.style.borderRadius = '6px';
openReleaseBtn.style.cursor = 'pointer';

updateActionSection.appendChild(doUpdateBtn);
updateActionSection.appendChild(openReleaseBtn);

updatePopup.appendChild(updateActionSection);

if (!canProgrammaticUpdate) {
    doUpdateBtn.disabled = true;
    doUpdateBtn.style.opacity = '0.45';
    doUpdateBtn.title = 'Programmatic update not supported in this environment';
} else {
    doUpdateBtn.title = 'Attempt programmatic update (if supported)';
}

async function fetchNewestReleaseFromGitHub(repo) {
    const url = `https://api.github.com/repos/${repo}/releases`;
    const res = await fetch(url, { headers: { Accept: 'application/vnd.github.v3+json' } });
    if (!res.ok) throw new Error(`GitHub API error ${res.status}`);
    const releases = await res.json();
    if (!Array.isArray(releases) || releases.length === 0) return null;
    releases.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
    return releases[0];
}

function showAutoNotification(version, releaseUrl) {
    const existing = document.getElementById('spe-update-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'spe-update-modal';
    modal.style.position = 'fixed';
    modal.style.left = '50%';
    modal.style.top = '20%';
    modal.style.transform = 'translateX(-50%)';
    modal.style.background = 'white';
    modal.style.padding = '18px';
    modal.style.borderRadius = '10px';
    modal.style.boxShadow = '0 8px 30px rgba(0,0,0,0.25)';
    modal.style.zIndex = 200000;
    modal.style.minWidth = '320px';
    modal.style.textAlign = 'center';
    modal.style.fontFamily = 'sans-serif';

    const msg = document.createElement('div');
    msg.innerHTML = `A new update for SPE is available: <strong>${version}</strong>`;
    msg.style.marginBottom = '12px';
    modal.appendChild(msg);

    const btnRow = document.createElement('div');
    btnRow.style.display = 'flex';
    btnRow.style.justifyContent = 'center';
    btnRow.style.gap = '8px';

    const remindBtn = document.createElement('button');
    remindBtn.textContent = 'Remind later';
    remindBtn.style.padding = '6px 10px';
    remindBtn.style.borderRadius = '6px';
    remindBtn.style.cursor = 'pointer';

    const ignoreBtn = document.createElement('button');
    ignoreBtn.textContent = 'Ignore';
    ignoreBtn.style.padding = '6px 10px';
    ignoreBtn.style.borderRadius = '6px';
    ignoreBtn.style.cursor = 'pointer';

    const openBtn = document.createElement('button');
    openBtn.textContent = 'Open release';
    openBtn.style.padding = '6px 10px';
    openBtn.style.borderRadius = '6px';
    openBtn.style.cursor = 'pointer';

    btnRow.appendChild(remindBtn);
    btnRow.appendChild(ignoreBtn);
    btnRow.appendChild(openBtn);

    modal.appendChild(btnRow);
    document.body.appendChild(modal);

    remindBtn.addEventListener('click', async () => {
        const untilDate = new Date();
        untilDate.setDate(untilDate.getDate() + 1);
        const untilStr = untilDate.toISOString().slice(0, 10);
        await browser.storage.local.set({ snoozedVersion: { version: version, until: untilStr } });
        modal.remove();
    });

    ignoreBtn.addEventListener('click', async () => {
        const st = await browser.storage.local.get('ignoredVersions');
        const arr = Array.isArray(st.ignoredVersions) ? st.ignoredVersions : [];
        if (!arr.includes(version)) arr.push(version);
        await browser.storage.local.set({ ignoredVersions: arr });
        modal.remove();
    });

    openBtn.addEventListener('click', () => {
        window.open(releaseUrl, '_blank');
        modal.remove();
    });
}
async function checkAndHandleUpdate({ auto = false } = {}) {
    const currentVersion = browser.runtime.getManifest().version;
    let newest;
    try {
        newest = await fetchNewestReleaseFromGitHub(GITHUB_REPO);
        if (!newest) {
            return { found: false };
        }
    } catch (err) {
        console.error('Update check failed:', err);
        const errEl = document.createElement('div');
        errEl.textContent = err.message;
        errEl.style.color = 'orange';
        errEl.style.marginTop = '10px';
        updatePopup.appendChild(errEl);
        return { found: false, error: err };
    }

    const latestTag = newest.tag_name || '';
    const latestNorm = normalizeVersionTag(latestTag);
    const currentNorm = normalizeVersionTag(currentVersion);

    if (latestNorm !== currentNorm) {
        const st = await browser.storage.local.get(['ignoredVersions', 'snoozedVersion']);
        const ignored = Array.isArray(st.ignoredVersions) ? st.ignoredVersions : [];
        const snoozed = st.snoozedVersion || null;
        const todayStr = new Date().toISOString().slice(0, 10);

        updateActionSection.style.display = 'block';
        updateMessage.textContent = `New version: ${latestTag}`;

        openReleaseBtn.onclick = () => window.open(newest.html_url, '_blank');

        if (canProgrammaticUpdate) {
            doUpdateBtn.disabled = false;
            doUpdateBtn.style.opacity = '1.0';
            doUpdateBtn.onclick = async () => {
                try {
                    const fn = browser?.runtime?.requestUpdateCheck || chrome?.runtime?.requestUpdateCheck;
                    if (typeof fn === 'function') {
                        fn((status) => {
                            console.log('requestUpdateCheck status:', status);
                            alert('Update check requested. If update did not install, open the release page.');
                        });
                    } else {
                        alert('Automatic update not supported in this browser BRAAAAP');
                        window.open(newest.html_url, '_blank');
                    }
                } catch (e) {
                    console.error(e);
                    alert('Update attempt FAILERALD');
                    window.open(newest.html_url, '_blank');
                }
            };
        } else {
            doUpdateBtn.disabled = true;
            doUpdateBtn.style.opacity = '0.45';
            doUpdateBtn.onclick = null;
        }

        let shouldNotify = auto;
        if (shouldNotify) {
            if (ignored.includes(latestTag) || ignored.includes(latestNorm)) shouldNotify = false;
            if (snoozed && snoozed.version === latestTag) {
                const until = snoozed.until || '';
                if (until >= todayStr) shouldNotify = false; 
            }
        }

        if (shouldNotify) {
            showAutoNotification(latestTag, newest.html_url);
        }

        return { found: true, latest: newest };
    } else {
        updateActionSection.style.display = 'none';
        return { found: false };
    }
}
checkBtn.disabled = false;
checkBtn.style.cursor = 'pointer';
checkBtn.title = 'Click to check for updates';

checkBtn.addEventListener('click', async () => {
    await checkAndHandleUpdate({ auto: false });
});

async function autoCheckOncePerDay() {
    const today = new Date().toISOString().slice(0, 10);
    const st = await browser.storage.local.get('lastCheckDate');
    if (st.lastCheckDate !== today) {
        await browser.storage.local.set({ lastCheckDate: today });
        await checkAndHandleUpdate({ auto: true });
    } else {

    }
}

autoCheckOncePerDay();

//debug tools

const debugMenu = document.createElement('div');
debugMenu.style.display = 'none';
debugMenu.style.position = 'fixed';
debugMenu.style.bottom = '10px';
debugMenu.style.right = '10px';
debugMenu.style.background = '#fff';
debugMenu.style.border = '1px solid #ccc';
debugMenu.style.fontSize = '12px';
debugMenu.style.zIndex = '100001';

const debugTitle = document.createElement('div');
debugTitle.textContent = 'Debug Menu';
debugTitle.style.fontWeight = 'bold';
debugTitle.style.marginBottom = '6px';
debugMenu.appendChild(debugTitle);

const clearAllDataLink = document.createElement('a');
clearAllDataLink.href = '#';
clearAllDataLink.textContent = 'Delete all site+extension data(excluding cookies)';
clearAllDataLink.style.display = 'block';
clearAllDataLink.addEventListener('click', async (e) => {
    e.preventDefault();
    await browser.storage.local.clear();
    localStorage.clear();
    alert('Your settings and data have been cleared or something');
});
debugMenu.appendChild(clearAllDataLink);
const clearCheckDateLink = document.createElement('a');
clearCheckDateLink.href = '#';
clearCheckDateLink.textContent = 'Reset daily update check';
clearCheckDateLink.style.display = 'block';
clearCheckDateLink.addEventListener('click', async (e) => {
    e.preventDefault();
    await browser.storage.local.remove('lastCheckDate');
    alert('Last check date cleared (SNCA)');
});
debugMenu.appendChild(clearCheckDateLink);
document.body.appendChild(debugMenu);