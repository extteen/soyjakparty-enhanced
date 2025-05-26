// MAIN FUNCTIONS O ALGO
// EXTTEEN RELEASE (CHANGE THIS COMMENT IF YOU MODDED)
//spaghetti code
console.log("Check 1");

const audio = new Audio();
audio.preload = "auto";
audio.crossOrigin = "anonymous";
audio.volume = 0.5;

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


    const getActivityStatus = (hour) => {
        if (hour >= 0 && hour < 6) return 'Sleeping';
        if (hour >= 6 && hour < 10) return 'Partially Inactive'; //maybe change this i am not a big fan
        if (hour >= 10 && hour < 18) return 'Mostly Active';
        if (hour >= 18 && hour < 23) return 'Fully Active';
        return 'Winding Down';
    };

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = 'Show SPE Menu';
    toggleBtn.style.position = 'fixed';
    toggleBtn.style.bottom = '40px'; 
    toggleBtn.style.right = '20px'; 
    toggleBtn.style.zIndex = '9999';
    toggleBtn.style.padding = '6px 12px';
    toggleBtn.style.border = '1px solid #888';
    toggleBtn.style.background = '#eee';
    toggleBtn.style.borderRadius = '5px';
    toggleBtn.style.cursor = 'pointer';
    toggleBtn.style.fontSize = '13px';

    document.body.appendChild(toggleBtn);

    const menuBox = document.createElement('div');
    menuBox.style.position = 'fixed';
    menuBox.style.bottom = '80px';  
    menuBox.style.right = '20px'; 
    menuBox.style.background = '#f8f9fa';
    menuBox.style.border = '1px solid #ccc';
    menuBox.style.borderRadius = '6px';
    menuBox.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
    menuBox.style.padding = '10px 15px';
    menuBox.style.fontFamily = 'monospace';
    menuBox.style.fontSize = '13px';
    menuBox.style.zIndex = '9999';
    menuBox.style.minWidth = '230px';
    menuBox.style.display = 'none';

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
            <span id="${statusId}" style="color: #666; font-size: 12px;">Checking...</span>
        `;

        row.appendChild(img);
        row.appendChild(textContainer);
        menuBox.appendChild(row);
    });

    const settingsDivider = document.createElement('hr');
    menuBox.appendChild(settingsDivider);

    const notifLabel = document.createElement('label');
    notifLabel.textContent = ' Enable Notifications';
    notifLabel.style.display = 'block';
    notifLabel.style.marginTop = '10px';

    const notifCheckbox = document.createElement('input');
    notifCheckbox.type = 'checkbox';
    notifCheckbox.id = 'notif-toggle';

    notifLabel.prepend(notifCheckbox);
    menuBox.appendChild(notifLabel);

    notifCheckbox.checked = localStorage.getItem('notifEnabled') === 'true';

    notifCheckbox.addEventListener('change', () => {
      localStorage.setItem('notifEnabled', notifCheckbox.checked);
    });
    const soundSelectLabel = document.createElement('label');
    soundSelectLabel.textContent = 'Select Sound:';
    soundSelectLabel.style.display = 'block';
    soundSelectLabel.style.marginTop = '10px';
    menuBox.appendChild(soundSelectLabel);

    //SOUND SELECT IN MENU

    const soundSelect = document.createElement('select');
    soundSelect.id = 'notif-sound-select';
    ['imrcv.mp3','cobgang.mp3', 'doit.mp3',"'cord.mp3",'yougotmail.mp3'].forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        soundSelect.appendChild(opt);
    });
    menuBox.appendChild(soundSelect);

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
    clearSoundBtn.style.border = '1px solid #888';
    clearSoundBtn.style.background = '#eee';
    clearSoundBtn.style.borderRadius = '4px';

    customSoundWrapper.appendChild(customSoundLabel);
    customSoundWrapper.appendChild(customSoundInput);
    customSoundWrapper.appendChild(clearSoundBtn);
    menuBox.appendChild(customSoundWrapper);

    //GCP IN MENU

    const settingsDivider2 = document.createElement('hr');
    menuBox.appendChild(settingsDivider2);

    const GCPLabel = document.createElement('label');
    GCPLabel.textContent = ' Enable GCP dot (refresh for change)';
    GCPLabel.style.display = 'block';
    GCPLabel.style.marginTop = '10px';

    const GCPCheckbox = document.createElement('input');
    GCPCheckbox.type = 'checkbox';
    GCPCheckbox.id = 'GCP-toggle';

    GCPLabel.prepend(GCPCheckbox);
    menuBox.appendChild(GCPLabel);

    GCPCheckbox.checked = localStorage.getItem('GCPEnabled') === 'true';

    GCPCheckbox.addEventListener('change', () => {
      localStorage.setItem('GCPEnabled', GCPCheckbox.checked);
    });

    //CUSTOM BACKGROUND IN MENU



    const settingsDivider3 = document.createElement('hr');
    menuBox.appendChild(settingsDivider3);

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
    clearBGBtn.style.border = '1px solid #888';
    clearBGBtn.style.background = '#eee';
    clearBGBtn.style.borderRadius = '4px';

    menuBox.appendChild(customBGLabel);
    menuBox.appendChild(customBGInput);
    menuBox.appendChild(clearBGBtn);

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
        const visible = menuBox.style.display === 'block';
        menuBox.style.display = visible ? 'none' : 'block';
        toggleBtn.textContent = visible ? 'Show SPE Menu' : 'Hide SPE Menu';
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
    refreshNote.style.color = '#888';
    refreshNote.style.marginTop = '10px';
    refreshNote.style.fontStyle = 'italic';

    menuBox.appendChild(refreshNote);
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

// GCP DOT

if (localStorage.getItem('GCPEnabled') === 'true') {
  const iframe = document.createElement('iframe');
  iframe.src = browser.runtime.getURL("gcpdot.html");
  iframe.style.position = 'fixed';
  iframe.style.top = '25px';
  iframe.style.right = '5px';
  iframe.style.width = '55px';
  iframe.style.height = '55px';
  iframe.style.zIndex = '10000';
  iframe.style.border = 'none';
  iframe.style.borderRadius = '8px';

  document.body.appendChild(iframe);
}
