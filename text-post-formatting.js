//SOYMOJI, TEXT FORMAT AND OTHER RAISIN
// EXTTEEN RELEASE

function applyTransparencyEffects(element, isTransparent) {
    if (isTransparent) {
        element.style.backdropFilter = 'blur(20px)';
        element.style.WebkitBackdropFilter = 'blur(10px)';
        element.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        element.style.fontFamily = '';
    } else {
        element.style.backdropFilter = 'none';
        element.style.WebkitBackdropFilter = 'none';
        element.style.backgroundColor = '#ffffff';
        element.style.fontFamily = 'monospace';
        element.style.color = '#000000';
    }
}

async function updateAllTransparencyEffects() {
    const { transparencyDisabled } = await browser.storage.sync.get({ transparencyDisabled: false });
    const isTransparent = !transparencyDisabled;

    const formatMenu = document.getElementById('text-format-menu');
    if (formatMenu) applyTransparencyEffects(formatMenu, isTransparent);

    const soymojiMenu = document.querySelector('.soymoji-menu');
    if (soymojiMenu) applyTransparencyEffects(soymojiMenu, isTransparent);

    document.querySelectorAll('.format-button').forEach(button => {
        if (isTransparent) {
            button.style.backdropFilter = 'blur(20px)';
            button.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
            button.addEventListener('mouseenter', () => button.style.backgroundColor = 'rgba(255, 255, 255, 0.5)');
            button.addEventListener('mouseleave', () => button.style.backgroundColor = 'rgba(255, 255, 255, 0.4)');
        } else {
            button.style.backdropFilter = 'none';
            button.style.backgroundColor = '#f0f0f0';
            button.addEventListener('mouseenter', () => button.style.backgroundColor = '#e0e0e0');
            button.addEventListener('mouseleave', () => button.style.backgroundColor = '#f0f0f0');
        }
    });

    document.querySelectorAll('.soymoji-option').forEach(option => {
        if (isTransparent) {
            option.style.backgroundColor = 'transparent';
            option.addEventListener('mouseenter', () => option.style.backgroundColor = 'rgba(255, 255, 255, 0.35)');
            option.addEventListener('mouseleave', () => option.style.backgroundColor = 'transparent');
        } else {
            option.style.backgroundColor = '#ffffff';
            option.addEventListener('mouseenter', () => option.style.backgroundColor = '#f0f0f0');
            option.addEventListener('mouseleave', () => option.style.backgroundColor = '#ffffff');
        }
    });
}
browser.storage.onChanged.addListener((changes) => {
    if (changes.transparencyDisabled !== undefined) updateAllTransparencyEffects();
});

const formatTiers = [
    {
        title: 'Colors',
        formats: [
            { label: 'Red', open: '==', close: '==' },
            { label: 'Blue', open: '--', close: '--' },
            { label: 'Purple', open: '-=', close: '-=' },
            { label: 'Pink', open: '-~-', close: '-~-' }
        ]
    },
    {
        title: 'Text Formats',
        formats: [
            { label: 'Big', open: '+=', close: '=+' },
            { label: 'Spoiler', open: '**', close: '**' },
            { label: 'Bold', open: "'''", close: "'''" },
            { label: 'Italic', open: "''", close: "''" }
        ]
    },
    {
        title: '',
        formats: [
            { label: 'Strikethrough', open: '~~', close: '~~' },
            { label: 'Underline', open: '__', close: '__' },
            { label: 'Code', open: '```', close: '```' }
        ]
    },
    {
        title: 'Glows',
        formats: [
            { label: 'Red Glow*', open: '!!', close: '!!' },
            { label: 'Green Glow', open: '%%', close: '%%' },
            { label: 'Sneed Glow', open: '::', close: '::' },
            { label: 'Blue Glow', open: ';;', close: ';;' }
        ]
    },
    {
        title: 'Gradients',
        formats: [
            { label: 'Ruby', open: '~-~!!', close: '!!~-~' },
            { label: 'Gemerald', open: '~-~%%', close: '%%~-~' },
            { label: 'Gold', open: '~-~::', close: '::~-~' },
            { label: 'Gem', open: '~-~;;', close: ';;~-~' },
            { label: 'Rainbow', open: '~-~', close: '~-~' }
        ]
    },
    {
        title: 'Combinations',
        formats: [
            { label: 'Hacker', open: '**```~-~%%', close: '%%~-~```**' },
            { label: 'calm', open: '```--;;', close: ';;--```' },
            { label: 'RAGE', open: "'''==+=!!", close: "!!=+=='''" },
            { label: 'Brimstone', open: '==::', close: '::==' }
        ]
    },
    {
        title: 'Symbols and Other',
        formats: [
            { label: '>', open: '>', close: '' },
            { label: '<', open: '<', close: '' },
            { label: '^', open: '^', close: '' },
            { label: 'Ϫ', open: 'Ϫ', close: '' },
            { label: '(((Jew)))', open: '(((', close: ')))' },
            { label: "'ru embed", open: '[thumb]', close: '[/thumb]' }
        ]
    },
];

const formatMenu = document.createElement('div');
formatMenu.id = "text-format-menu";
formatMenu.style.display = 'none';
formatMenu.style.position = 'absolute';
formatMenu.style.zIndex = '9999';
formatMenu.style.padding = '5px';
formatMenu.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
browser.storage.sync.get({ transparencyDisabled: false }).then(({ transparencyDisabled }) => {
    applyTransparencyEffects(formatMenu, !transparencyDisabled);
});


formatTiers.forEach(tier => {
    const section = document.createElement('div');
    section.className = 'format-tier';
    section.style.marginBottom = '8px';

    const title = document.createElement('div');
    title.className = 'format-tier-title';
    title.innerText = tier.title;
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '5px';
    section.appendChild(title);

    const buttonRow = document.createElement('div');
    buttonRow.className = 'format-button-row';
    buttonRow.style.display = 'flex';
    buttonRow.style.flexWrap = 'wrap';
    buttonRow.style.gap = '5px';

    tier.formats.forEach(format => {
        const button = document.createElement('button');
        button.className = 'format-button';
        button.innerText = format.label;


        const rainbowText = '<span style="background: linear-gradient(to left, red, orange, yellow, green, cyan, blue, violet); -webkit-background-clip: text; -webkit-text-fill-color: transparent; pointer-events: none;">' + button.textContent + '</span>';
        // Colors
        if (format.label === 'Red') {
            button.innerHTML = '<span style="color: rgb(175, 10, 15); font-size: 11pt;font-weight: bold; pointer-events: none;">' + button.textContent + '</span>';
        } else if (format.label === 'Blue') {
            button.innerHTML = '<span style="color: rgb(36, 36, 173); font-size: 11pt;font-weight: bold; pointer-events: none;">' + button.textContent + '</span>';
        } else if (format.label === 'Pink') {
            button.style.color = '#fd3d98';
            button.style.fontWeight = 'bold'
        } else if (format.label === 'Purple') {
            button.style.color = '#720b98';
            button.style.fontWeight = 'bold'
            // Text Formats
        } else if (format.label === 'Big') {
            button.innerHTML = '<span style="font: 14.4px sans-serif; pointer-events: none;">' + button.textContent + '</span>';
        } else if (format.label === 'Spoiler') {
            button.innerHTML = '<span style="background:rgb(0, 0, 0); color: #ffffff; padding: 0 1px; pointer-events: none;">' + button.textContent + '</span>'
        } else if (format.label === 'Bold') {
            button.style.fontWeight = 'bold'
        } else if (format.label === 'Italic') {
            button.style.fontStyle = 'italic'
        } else if (format.label === 'Strikethrough') {
            button.innerHTML = '<span style="pointer-events: none; text-decoration: line-through;">' + button.textContent + '</span>';
        } else if (format.label === 'Underline') {
            button.innerHTML = '<span style="pointer-events: none; text-decoration: underline;">' + button.textContent + '</span>';
        } else if (format.label === 'Code') {
            button.style.fontFamily = 'monospace'
            // Glows
        } else if (format.label === 'Red Glow*') {
            button.style.textShadow = '0px 0px 40px #ff0000, 0px 0px 2px #ff0000'
        } else if (format.label === 'Green Glow') {
            button.style.textShadow = '0px 0px 40px #00fe20, 0px 0px 2px #00fe20'
        } else if (format.label === 'Sneed Glow') {
            button.style.textShadow = '0px 0px 40px #fffb00, 0px 0px 2px #fffb00'
        } else if (format.label === 'Blue Glow') {
            button.style.textShadow = '0px 0px 40px #36d7f7, 0px 0px 2px #36d7f7';
            // Gradients
        } else if (format.label === 'Ruby') {
            button.innerHTML = rainbowText;
            button.style.textShadow = '0px 0px 40px #ff0000, 0px 0px 2px #ff0000';
        } else if (format.label === 'Gemerald') {
            button.innerHTML = rainbowText;
            button.style.textShadow = '0px 0px 40px #00fe20, 0px 0px 2px #00fe20';
        } else if (format.label === 'Gold') {
            button.innerHTML = rainbowText;
            button.style.textShadow = '0px 0px 40px #fffb00, 0px 0px 2px #fffb00';
        } else if (format.label === 'Gem') {
            button.innerHTML = rainbowText;
            button.style.textShadow = '0px 0px 40px #36d7f7, 0px 0px 2px #36d7f7';
        } else if (format.label === 'Rainbow') {
            button.innerHTML = rainbowText;
            // Combinations
        } else if (format.label === 'Hacker') {
            button.innerHTML = '<span style="pointer-events: none; background: black; display: inline-block; padding: 0 1px;"><span style="background: linear-gradient(to left, red, orange, yellow, green, cyan, blue, violet); -webkit-background-clip: text; -webkit-text-fill-color: transparent; color: #ffffff; pointer-events: none;">' + button.textContent + '</span></span>';
            button.style.fontFamily = 'monospace'
            button.style.textShadow = '0px 0px 40px #00fe20, 0px 0px 2px #00fe20';
        } else if (format.label === 'calm') {
            button.innerHTML = '<span style="color: rgb(36, 36, 173); font-size: 11pt;font-weight: bold; pointer-events: none;">' + button.textContent + '</span>';
            button.style.fontFamily = 'monospace'
            button.style.textShadow = '0px 0px 40px #36d7f7, 0px 0px 2px #36d7f7';
        } else if (format.label === 'RAGE') {
            button.innerHTML = '<span style="font: 14.4px sans-serif; color: rgb(175, 10, 15); font-size: 11pt;font-weight: bold; pointer-events: none; text-shadow:0px 0px 40px #ff0000, 0px 0px 2px #ff0000">' + button.textContent + '</span>';
        } else if (format.label === 'Brimstone') {
            button.innerHTML = '<span style="color: rgb(175, 10, 15); font-size: 11pt;font-weight: bold; pointer-events: none;">' + button.textContent + '</span>';
            button.style.textShadow = '0px 0px 40px #fffb00, 0px 0px 2px #fffb00';
            // Symbols and other
        } else if (format.label === '>') {
            button.style.color = '#B8D962';
        } else if (format.label === '<') {
            button.style.color = '#f6750b';
        } else if (format.label === '^') {
            button.style.color = '#6577E6';
        } else if (format.label === '(((Jew)))') {
            button.innerHTML = '<span style="background:rgb(255,255,255); color: #3060a8; pointer-events: none;">' + button.textContent + '</span>'

            
        };


        
        button.style.padding = '5px 8px';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.style.borderRadius = '1px';
        button.style.fontSize = '12px';
        button.style.whiteSpace = 'nowrap';

        if (localStorage.getItem('transparencyDisabled') !== 'true') {
            button.style.backdropFilter = 'blur(20px)';
            button.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
        } else {
            button.style.backgroundColor = '#f0f0f0';
        }

        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = localStorage.getItem('transparencyDisabled') !== 'true'
                ? 'rgba(255, 255, 255, 0.5)'
                : '#e0e0e0';
        });
        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = localStorage.getItem('transparencyDisabled') !== 'true'
                ? 'rgba(255, 255, 255, 0.4)'
                : '#f0f0f0';
        });

        buttonRow.appendChild(button);
    });

    section.appendChild(buttonRow);
    formatMenu.appendChild(section);
});

const formatNote = document.createElement('div');
formatNote.style.fontSize = '11px';
formatNote.style.color = '#555';
formatNote.style.marginTop = '10px';
formatNote.style.fontStyle = 'italic';
formatNote.textContent = '*Use for each word.';
formatMenu.appendChild(formatNote);

document.body.appendChild(formatMenu);


const soymojiMenu = document.createElement('div');
soymojiMenu.classList.add("soymoji-menu");
soymojiMenu.style.display = 'none';
soymojiMenu.style.position = 'absolute';
soymojiMenu.style.zIndex = '9999';
soymojiMenu.style.padding = '5px';
soymojiMenu.style.gap = '2px';
soymojiMenu.style.width = 'min(480px, 90vw)';
soymojiMenu.style.gridTemplateColumns = 'repeat(auto-fill, minmax(56px, 1fr))';
soymojiMenu.style.maxHeight = '60vh';
soymojiMenu.style.overflowY = 'auto';
soymojiMenu.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
applyTransparencyEffects(soymojiMenu, localStorage.getItem('transparencyDisabled') !== 'true');


const soymojiFiles = [
    "a24.png", "ack.png", "amerimutt.png", "army.png", "army2.png","baby.png" ,"bernd.png", "chud.gif",
    "coal.png", "cob.png", "colorjak.png", "cry.png", "dancingswede.gif",
    "doctos.png", "euromutt.png", "fact.png", "feralrage.png", "feral_animated.gif",
    "gem.png", "gigachad.png","htsm.png", "impish.png", "jacobson.png", "jew.png", "jig.gif",
    "med.gif", "microjaklover.png", "neutralplier.png", "nojak.png", "over.png",
    "pepe.png", "pepetux.png", "pepetwerk.gif", "perrojak.png", "posteditagain.png",
    "sisa.png", "slf.gif", "smug.png", "smugsoyak.png", "soot.png",
    "soyak.png", "soyberg.png", "soytan.png", "sprokejak.png", "squirrel.png",
    "swede.png", "though.png", "transheart.png", "trio.png", "trvke.png",
    "wew.png", "wholesome.png", "wholesomegem.png", "wholesomeheart.png"
];

soymojiFiles.forEach(filename => {
    const shortcode = `${filename.split('.')[0]}`;
    const soymojiDiv = document.createElement('div');
    soymojiDiv.classList.add('soymoji-option');
    soymojiDiv.style.display = 'flex';
    soymojiDiv.style.flexDirection = 'column';
    soymojiDiv.style.alignItems = 'center';
    soymojiDiv.style.textAlign = 'center';
    soymojiDiv.style.cursor = 'pointer';
    soymojiDiv.style.padding = '2px';
    soymojiDiv.style.borderRadius = '0px';
    soymojiDiv.addEventListener('mouseenter', () => {
        soymojiDiv.style.backgroundColor = localStorage.getItem('transparencyDisabled') !== 'true'
            ? 'rgba(255, 255, 255, 0.35)'
            : '#f0f0f0';
    });
    soymojiDiv.addEventListener('mouseleave', () => {
        soymojiDiv.style.backgroundColor = localStorage.getItem('transparencyDisabled') !== 'true'
            ? 'transparent'
            : '#ffffff';
    });

    if (localStorage.getItem('transparencyDisabled') !== 'true') {
        soymojiDiv.style.backgroundColor = 'transparent';
    } else {
        soymojiDiv.style.backgroundColor = '#ffffff';
    }

    const img = document.createElement('img');
    img.src = browser.runtime.getURL(`icons/soymoji/${filename}`);
    img.alt = shortcode;
    img.style.maxHeight = '30px';
    img.style.maxWidth = '30px';

    const label = document.createElement('span');
    label.textContent = shortcode;
    label.style.fontSize = '10px'; 
    label.style.marginTop = '2px';
    label.style.wordBreak = 'break-all';

    soymojiDiv.appendChild(img);
    soymojiDiv.appendChild(label);
    soymojiMenu.appendChild(soymojiDiv);

    soymojiDiv.addEventListener('mouseenter', () => soymojiDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.35)');
    soymojiDiv.addEventListener('mouseleave', () => soymojiDiv.style.backgroundColor = 'transparent');
});
document.body.appendChild(soymojiMenu);

window.addEventListener('transparencyChanged', updateAllTransparencyEffects);
window.addEventListener('storage', (event) => {
    if (event.key === 'transparencyDisabled') {
        updateAllTransparencyEffects();
    }
});
updateAllTransparencyEffects();

(function hookQuoteFunctionsWhenDefined() {
    const patchFunction = (name) => {
        let originalFn;
        Object.defineProperty(window, name, {
            configurable: true,
            enumerable: true,
            get() {
                return originalFn;
            },
            set(fn) {

                originalFn = function (...args) {

                    const result = fn.apply(this, args);

                    requestAnimationFrame(tryEnhanceQuickReplyFields);
                    return result;
                };
            }
        });
    };

    patchFunction('doQuote');
    patchFunction('citeReply');
})();



function enhanceTextbox(textbox) {
    if (!textbox || textbox.dataset.enhanced === "true") return;
    
    const inst = attachToTextarea(textbox);
    if (inst) {
        textbox.dataset.enhanced = "true";
    }
    return inst;
}

function enhanceEmailTextbox(emailTextbox) {
    if (!emailTextbox) return;
    if (emailTextbox.dataset.enhanced === "true") return;

    const wrapper = document.createElement('div');
    wrapper.classList.add('email-textbox-wrapper');
    wrapper.style.position = 'relative';
    wrapper.style.display = 'inline-block';

    if (emailTextbox.parentNode) {
        emailTextbox.parentNode.insertBefore(wrapper, emailTextbox);
        wrapper.appendChild(emailTextbox);
    }

    emailTextbox.style.paddingRight = '30px';

    const dropdownBtn = document.createElement('button');
    dropdownBtn.classList.add('email-dropdown-button');
    dropdownBtn.type = 'button';
    dropdownBtn.textContent = '▾';
    dropdownBtn.style.position = 'absolute';
    dropdownBtn.style.right = '0px';
    dropdownBtn.style.top = '50%';
    dropdownBtn.style.transform = 'translateY(-50%)';
    dropdownBtn.style.border = 'none';
    dropdownBtn.style.background = 'transparent';
    dropdownBtn.style.cursor = 'pointer';
    dropdownBtn.style.padding = '2px';
    dropdownBtn.style.fontSize = '28px';
    dropdownBtn.style.zIndex = '10';
    wrapper.appendChild(dropdownBtn);

    const dropdownMenu = document.createElement('div');
    dropdownMenu.classList.add('email-dropdown-menu');
    dropdownMenu.style.position = 'absolute';
    dropdownMenu.style.top = '100%';
    dropdownMenu.style.left = '0';
    dropdownMenu.style.marginTop = '5px';
    dropdownMenu.style.background = '#fff';
    dropdownMenu.style.border = '1px solid #ccc';
    dropdownMenu.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
    dropdownMenu.style.display = 'none';
    dropdownMenu.style.zIndex = '9999';
    dropdownMenu.style.minWidth = '120px';
    dropdownMenu.style.padding = '0px 0';
    wrapper.appendChild(dropdownMenu);

    const options = [
        { label: '(none)', value: '' },
        { label: 'BUMP!', value: 'bump' },
        { label: 'SAGE!', value: 'sage' },
        { label: 'SUPERSAGE!', value: 'supersage' },
        { label: 'Anonymous', value: 'anonymous' },
        { label: 'Anonymous SAGE!', value: 'anonymous sage' },
        { label: 'Nonoko', value: 'nonoko' }
    ];

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = opt.label;
        btn.style.display = 'block';
        btn.style.width = '100%';
        btn.style.padding = '6px 10px';
        btn.style.border = 'none';
        btn.style.background = 'white';
        btn.style.textAlign = 'left';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '13px';

        btn.addEventListener('mouseenter', () => {
            btn.style.background = '#eee';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.background = 'white';
        });

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();

            emailTextbox.value = opt.value;
            emailTextbox.focus();

            const events = ['input', 'change', 'keydown', 'keyup'];
            events.forEach(eventType => {
                emailTextbox.dispatchEvent(new Event(eventType, { bubbles: true }));
            });
            
            dropdownMenu.style.display = 'none';
        });

        dropdownMenu.appendChild(btn);
    });

    dropdownBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const isOpening = dropdownMenu.style.display === 'none';
        dropdownMenu.style.display = isOpening ? 'block' : 'none';

        if (isOpening) {

            document.querySelectorAll('.email-dropdown-menu').forEach(menu => {
                if (menu !== dropdownMenu) menu.style.display = 'none';
            });
            emailTextbox.focus();
        }
    });
    const handleOutsideClick = (e) => {
        if (!wrapper.contains(e.target) &&
            !e.target.classList.contains('email-dropdown-button') &&
            !e.target.classList.contains('email-dropdown-menu')) {
            dropdownMenu.style.display = 'none';
        }
    };

    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('focusin', handleOutsideClick);

    emailTextbox.dataset.enhanced = "true";

    return () => {
        document.removeEventListener('click', handleOutsideClick);
        document.removeEventListener('focusin', handleOutsideClick);
    };
}


function tryEnhanceQuickReplyFields() {
    const quickReplyContainer = document.getElementById('quick-reply');

    if (quickReplyContainer) {
        setTimeout(() => {
            const body = quickReplyContainer.querySelector('textarea[name="body"]');
            const email = quickReplyContainer.querySelector('input[name="email"]');

            if (body && body.dataset.enhanced !== "true") {
                const inst = attachToTextarea(body);
                if (inst) {
                    applyFeatureState(inst);
                    body.dataset.enhanced = "true";
                    window.livePreview = window.livePreview || {};
                    window.livePreview._qrInstance = inst;
                }
            }

            if (email && email.dataset.enhanced !== "true") {
                enhanceEmailTextbox(email);
            }
        }, 50);
    }
}


//document.querySelectorAll('textarea[name="body"]:not([data-enhanced])').forEach(enhanceTextbox);
document.querySelectorAll('input[name="email"]:not([data-enhanced])').forEach(enhanceEmailTextbox);


const bodyObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        if (mutation.type === 'childList') {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    
                    if (node.id === 'quick-reply' && !node.dataset.observed) {
                        
                        node.dataset.observed = "true"; 
                        tryEnhanceQuickReplyFields();

                        
                        const qrStyleObserver = new MutationObserver((styleMutations) => {
                            for (const sMut of styleMutations) {
                                if (sMut.type === 'attributes' && sMut.attributeName === 'style') {
                                    const isVisible = window.getComputedStyle(sMut.target).display !== 'none' &&
                                        window.getComputedStyle(sMut.target).visibility !== 'hidden';
                                    if (isVisible) {
                                        
                                        tryEnhanceQuickReplyFields();
                                    }
                                }
                            }
                        });
                        qrStyleObserver.observe(node, { attributes: true, attributeFilter: ['style'] });
                    } else if (node.querySelector) {
                        node.querySelectorAll('textarea[name="body"]:not([data-enhanced])').forEach(enhanceTextbox);
                        node.querySelectorAll('input[name="email"]:not([data-enhanced])').forEach(enhanceEmailTextbox);
                    }
                }
            }
        }
        
        if (mutation.type === 'attributes' && mutation.attributeName === 'style' && mutation.target.id === 'quick-reply') {
            const isVisible = window.getComputedStyle(mutation.target).display !== 'none' &&
                window.getComputedStyle(mutation.target).visibility !== 'hidden';
            if (isVisible) {
               
                tryEnhanceQuickReplyFields();
            }
        }
    }
});

bodyObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class']
});



document.addEventListener('click', (event) => {

    if (event.target && event.target.classList.contains('soymoji-button')) {
        event.preventDefault();
        event.stopPropagation();
        
        const wrapper = event.target.closest('.live-preview-wrapper');
        const textbox = wrapper ? wrapper.querySelector('textarea[name="body"]') : null;

        if (textbox && soymojiMenu) {
            const rect = event.target.getBoundingClientRect();
            soymojiMenu.style.left = `${rect.right + 10}px`;
            soymojiMenu.style.top = `${rect.top + window.scrollY}px`;
            soymojiMenu.style.display = soymojiMenu.style.display === 'none' ? 'grid' : 'none';

            soymojiMenu.dataset.activeTextboxId = textbox.id || (textbox.id = `textbox-${Date.now()}`);
        }
    }
    if (event.target && event.target.classList.contains('format-button-toggle')) {
        event.preventDefault();
        event.stopPropagation();
        const formatMenu = document.getElementById('text-format-menu'); 

        if (formatMenu) {
            const rect = event.target.getBoundingClientRect();
            formatMenu.style.left = `${rect.right + 10}px`;
            formatMenu.style.top = `${rect.top + window.scrollY}px`;
            formatMenu.style.display = formatMenu.style.display === 'none' ? 'block' : 'none';
            const wrapper = event.target.closest('.live-preview-wrapper');
            const textbox = wrapper ? wrapper.querySelector('textarea[name="body"]') : null;
            
            if (textbox) {
                formatMenu.dataset.activeTextboxId = textbox.id || (textbox.id = `textbox-${Date.now()}`);
            }
        }
    }

    if (event.target && event.target.classList.contains('email-dropdown-button')) {
        event.preventDefault();
        event.stopImmediatePropagation();

        const wrapper = event.target.closest('.email-textbox-wrapper');
        if (!wrapper) return;

        const dropdownMenu = wrapper.querySelector('.email-dropdown-menu');
        const emailTextbox = wrapper.querySelector('input[name="email"]');

        if (!dropdownMenu || !emailTextbox) return;


        document.querySelectorAll('.email-dropdown-menu').forEach(menu => {
            if (menu !== dropdownMenu) menu.style.display = 'none';
        });

        const isOpening = dropdownMenu.style.display === 'none';
        dropdownMenu.style.display = isOpening ? 'block' : 'none';

        if (isOpening) {
            emailTextbox.focus();
        }
    }

    if (event.target && event.target.closest('.email-dropdown-menu button')) {
        event.preventDefault();
        event.stopImmediatePropagation();

        const optionButton = event.target.closest('button');
        const wrapper = optionButton.closest('.email-textbox-wrapper');
        if (!wrapper) return;

        const dropdownMenu = wrapper.querySelector('.email-dropdown-menu');
        const emailTextbox = wrapper.querySelector('input[name="email"]');

        if (!emailTextbox) return;

        const options = Array.from(dropdownMenu.querySelectorAll('button'));
        const index = options.indexOf(optionButton);
        if (index === -1) return;

        const values = ['', 'bump', 'sage', 'supersage', 'anonymous', 'anonymous sage', 'nonoko'];
        if (values[index] !== undefined) {
            emailTextbox.value = values[index];
            
            const inputEvent = new Event('input', { bubbles: true });
            const changeEvent = new Event('change', { bubbles: true });
            emailTextbox.dispatchEvent(inputEvent);
            emailTextbox.dispatchEvent(changeEvent);
        }

        dropdownMenu.style.display = 'none';
        emailTextbox.focus();
    }


    if (event.target && event.target.closest('.soymoji-option')) {
        event.preventDefault();
        event.stopPropagation();

        const soymojiDiv = event.target.closest('.soymoji-option');
        const shortcode = soymojiDiv.querySelector('span')?.textContent;
        const soymojiMenu = document.querySelector('.soymoji-menu');

        const activeTextboxId = soymojiMenu?.dataset.activeTextboxId;
        const textbox = activeTextboxId ? document.getElementById(activeTextboxId) : null;

        if (shortcode && textbox) {
            const start = textbox.selectionStart || 0;
            const end = textbox.selectionEnd || 0;
            const text = textbox.value;
            textbox.value = text.slice(0, start) + `[${shortcode}]` + text.slice(end);
            textbox.focus();
            window.livePreview.updateCounter();
 
            textbox.selectionStart = textbox.selectionEnd = start + `[${shortcode}]`.length;

        } else {
            
        }
    }


    if (event.target && event.target.classList.contains('format-button')) {
        const button = event.target;
        const formatMenu = document.getElementById('text-format-menu');

        const activeTextboxId = formatMenu?.dataset.activeTextboxId;
        let textbox = activeTextboxId ? document.getElementById(activeTextboxId) : null;


        if (!textbox || textbox.tagName !== 'TEXTAREA' || textbox.name !== 'body') {
            textbox = document.activeElement;
            if (!textbox || textbox.tagName !== 'TEXTAREA' || textbox.name !== 'body') {
                textbox = document.querySelector('#quick-reply textarea[name="body"]');
            }
            if (!textbox) {
                textbox = document.querySelector('textarea[name="body"]');
            }
        }

        if (!textbox) {
           
            return;
        }

        let formatDetails = null;
        for (const tier of formatTiers) {
            formatDetails = tier.formats.find(f => f.label === button.innerText);
            if (formatDetails) break;
        }

        if (formatDetails) {
            const start = textbox.selectionStart;
            const end = textbox.selectionEnd;
            const selectedText = textbox.value.slice(start, end);

            const formatted = formatDetails.open + selectedText + formatDetails.close;
            textbox.value = textbox.value.slice(0, start) + formatted + textbox.value.slice(end);

            const cursorPos = selectedText
                ? start + formatDetails.open.length + selectedText.length
                : start + formatDetails.open.length;

            textbox.selectionStart = textbox.selectionEnd = cursorPos;
            textbox.focus();
            window.livePreview.updateCounter();
        } else {
           
        }
    }
});

document.addEventListener('click', (e) => {

    const formatMenu = document.getElementById('text-format-menu');
    if (formatMenu && formatMenu.style.display !== 'none' && !formatMenu.contains(e.target) && !e.target.classList.contains('format-button-toggle')) {
        formatMenu.style.display = 'none';
    }


    const soymojiMenu = document.querySelector('.soymoji-menu');
    if (soymojiMenu && soymojiMenu.style.display !== 'none' && !soymojiMenu.contains(e.target) && !e.target.classList.contains('soymoji-button')) {
        soymojiMenu.style.display = 'none';
    }


    document.querySelectorAll('.email-textbox-wrapper').forEach(wrapper => {
        const dropdownMenu = wrapper.querySelector('.email-dropdown-menu');
        const dropdownBtn = wrapper.querySelector('.email-dropdown-button');
        if (dropdownMenu && dropdownMenu.style.display !== 'none' && !wrapper.contains(e.target) && e.target !== dropdownBtn) {
            dropdownMenu.style.display = 'none';
        }
    });
});
// Text Previews from a random soyteen's modified userscript. thanks

const DEFAULTS = {
    lp_attach: 'true',
    lp_enablePreview: 'true',
    lp_enableCounter: 'false',
    lp_forcePreviewText: 'false'
};
const flags = new Map(Object.entries(DEFAULTS));

browser.storage.sync.get({
    lp_attach: DEFAULTS.lp_attach,
    lp_enablePreview: DEFAULTS.lp_enablePreview,
    lp_enableCounter: DEFAULTS.lp_enableCounter,
    lp_forcePreviewText: DEFAULTS.lp_forcePreviewText,
}).then(vals => {
    Object.entries(vals).forEach(([k, v]) => flags.set(k, String(v)));
    if (window.livePreview && window.livePreview._instance) {
        applyFeatureState(window.livePreview._instance);
    }
    if (window.livePreview && window.livePreview._qrInstance) {
        applyFeatureState(window.livePreview._qrInstance);
    }
});
browser.storage.onChanged.addListener((changes) => {
    const lpKeys = ['lp_attach', 'lp_enablePreview', 'lp_enableCounter', 'lp_forcePreviewText'];
    let changed = false;
    lpKeys.forEach(k => {
        if (changes[k] !== undefined) {
            flags.set(k, String(changes[k].newValue));
            changed = true;
        }
    });
    if (changed) {
        if (window.livePreview && window.livePreview._instance) {
            applyFeatureState(window.livePreview._instance);
        }
        if (window.livePreview && window.livePreview._qrInstance) {
            applyFeatureState(window.livePreview._qrInstance);
        }
    }
});

const ATTACH_ATTR = 'data-live-preview-attached';

const state = {
    textarea: null,
    wrapper: null,
    previewBox: null,
    previewBtn: null,
    resizeObserver: null,
    soymojiAvailable: (typeof soymojiFiles !== 'undefined'),
    codeToFile: {},
    destroyed: false
};

function buildSoyMap() {
    if (!state.soymojiAvailable) return;
    const soymojiBasePath = 'icons/soymoji';
    state.codeToFile = {};
    soymojiFiles.forEach(fn => {
        if (typeof fn !== 'string') return;
        const name = fn.replace(/\.[^/.]+$/, '').toLowerCase();
        if (!state.codeToFile[name]) state.codeToFile[name] = fn;
    });
    if (state.codeToFile['baby'] && !state.codeToFile['babyjak']) state.codeToFile['babyjak'] = state.codeToFile['baby'];
    if (state.codeToFile['slf'] && !state.codeToFile['selfish']) state.codeToFile['selfish'] = state.codeToFile['slf'];
}

function extUrlFor(pathInsideExt) {
    try {
        if (typeof chrome !== 'undefined' && chrome.runtime && typeof chrome.runtime.getURL === 'function') {
            return chrome.runtime.getURL(pathInsideExt);
        }
        if (typeof browser !== 'undefined' && browser.runtime && typeof browser.runtime.getURL === 'function') {
            return browser.runtime.getURL(pathInsideExt);
        }
    } catch (e) {  }
    return pathInsideExt;
}

function soymojiImgHTML(codeRaw) {
    if (!state.soymojiAvailable) return null;
    const code = String(codeRaw).toLowerCase();
    const file = state.codeToFile[code];
    if (!file) return null;
    const src = extUrlFor('icons/soymoji/' + file);
    return `<img src="${src}" alt="[${codeRaw}]" title="${codeRaw}" decoding="async"
            style="height:auto; width:auto; image-rendering:pixelated; display:inline; margin:0; padding:0;" />`;
}


function applyFormatting(text) {
    const temp = document.createElement('div');
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let span = document.createElement('span');
        let arrowPrefix = '';

        if (line.startsWith('>')) {
            arrowPrefix = '>';
            line = line.substring(1);
            span.style.color = '#789922';
        } else if (line.startsWith('<')) {
            arrowPrefix = '<';
            line = line.substring(1);
            span.style.color = '#F6750B';
        } else if (line.startsWith('^')) {
            arrowPrefix = '^';
            line = line.substring(1);
            span.style.color = '#6577E6';
        }

        line = line.replace(/~-~(.*?)~-~/g, function (match, p1) {
            let inner = p1;
            inner = inner.replace(/==([^=]+)==/g, '<span style="font-weight:bold">$1</span>');
            inner = inner.replace(/--([^-]+)--/g, '<span style="font-weight:bold">$1</span>');
            inner = inner.replace(/-=([^-]+)-=/g, '<span style="font-weight:bold">$1</span>');
            inner = inner.replace(/%%(.*?)%%/g, '<span style="text-shadow:0 0 5px #0f0">$1</span>');
            inner = inner.replace(/::(.*?)::/g, '<span style="text-shadow:0 0 5px #ff0">$1</span>');
            inner = inner.replace(/!!(.*?)!!/g, '<span style="text-shadow:0 0 5px #f00">$1</span>');
            inner = inner.replace(/;;(.*?);;/g, '<span style="text-shadow:0 0 5px #0ff">$1</span>');
            return `<span style="background:linear-gradient(90deg,violet,blue,cyan,green,yellow,orange,red);-webkit-background-clip:text;color:transparent;display:inline-block">${inner}</span>`;
        });

        line = line.replace(/==([^=]+)==/g, '<span style="color:#AF0A0F;font-weight:bold">$1</span>');
        line = line.replace(/--([^-]+)--/g, '<span style="color:#2424AD;font-weight:bold">$1</span>');
        line = line.replace(/-=([^-]+)-=/g, '<span style="color:#720B98;font-weight:bold">$1</span>');

        line = line.replace(/==\+=(.+?)=\+==/g, '<span style="color:#AF0A0F;font-weight:bold;font-size:115%">$1</span>');
        line = line.replace(/--\+=(.+?)=\+--/g, '<span style="color:#2424AD;font-weight:bold;font-size:115%">$1</span>');
        line = line.replace(/-=\+=(.+?)=\+-=/g, '<span style="color:#720B98;font-weight:bold;font-size:115%">$1</span>');

        line = line.replace(/\+=([^+]+)=\+/g, '<span style="font-size:115%">$1</span>');
        line = line.replace(/\(\(\(([^)]+)\)\)\)/g, '<span style="color:#3060A8;background:white">((($1)))</span>');
        line = line.replace(/-~-([^-]+)-~-/g, '<span style="color:#FD3D98">$1</span>');

        line = line.replace(/%%([^%]+)%%/g, '<span style="text-shadow:0 0 5px #0f0">$1</span>');
        line = line.replace(/::([^:]+)::/g, '<span style="text-shadow:0 0 5px #ff0">$1</span>');
        line = line.replace(/!!([^!]+)!!/g, '<span style="text-shadow:0 0 5px #f00">$1</span>');
        line = line.replace(/;;([^;]+);;/g, '<span style="text-shadow:0 0 5px #0ff">$1</span>');

        line = line.replace(/'''([^']+)'''/g, '<b>$1</b>');
        line = line.replace(/''([^']+)''/g, '<i>$1</i>');
        line = line.replace(/~~([^~]+)~~/g, '<s>$1</s>');
        line = line.replace(/\*\*([^*]+)\*\*/g, '<span style="background:black;color:black" onmouseover="this.style.color=\'white\'" onmouseout="this.style.color=\'black\'">$1</span>');
        line = line.replace(/__([^_]+)__/g, '<u>$1</u>');
        line = line.replace(/```([^`]+)```/g, '<code>$1</code>');

        line = line.replace(/\[([^\]]+)\]/g, function (match, p1) {
            const img = soymojiImgHTML(p1);
            return img ? img : `[${p1}]`;
        });

        if (arrowPrefix) {
            const arrowSpan = document.createElement('span');
            arrowSpan.textContent = arrowPrefix;
            arrowSpan.style.color = span.style.color;
            temp.appendChild(arrowSpan);
        }

        span.innerHTML = line || '&nbsp;';
        temp.appendChild(span);
        if (i < lines.length - 1) temp.appendChild(document.createElement('br'));
    }

    return temp.innerHTML;
}

function attachToTextarea(textarea) {
    if (!textarea || textarea.hasAttribute(ATTACH_ATTR)) return null;

    browser.storage.sync.get({
        textareaMinW:        400,
        textareaMinH:        120,
        textareaDesktopOnly: true,
    }).then(({ textareaMinW, textareaMinH, textareaDesktopOnly }) => {
        const isMobile = textareaDesktopOnly && window.innerWidth < 600;
        if (isMobile) return;
     
        if (textareaMinW > 0) textarea.style.minWidth  = textareaMinW  + 'px';
        if (textareaMinH > 0) textarea.style.minHeight = textareaMinH + 'px';
    });

    const wrapper = document.createElement('div');
    wrapper.className = 'live-preview-wrapper';
    wrapper.style.position = 'relative';
    wrapper.style.display = 'inline-block';

    textarea.parentNode.replaceChild(wrapper, textarea);
    wrapper.appendChild(textarea);

    textarea.style.display = 'block';
    textarea.style.boxSizing = 'border-box';
    textarea.style.position = 'relative';
    textarea.style.zIndex = '1';

    const buttonContainer = document.createElement('div');
    Object.assign(buttonContainer.style, {
        position: 'absolute',
        right: '9px',
        bottom: '9px',
        display: 'flex',
        gap: '5px',
        zIndex: '32'
    });

    // === der soymoji button
    const soymojiButton = document.createElement('button');
    soymojiButton.classList.add("soymoji-button");
    soymojiButton.type = "button";
    soymojiButton.tabIndex = 0;
    soymojiButton.title = "Soymoji Menu";

    let currentSoymojiIndex = Math.floor(Math.random() * soymojiFiles.length);

    function getRandomSoymoji(excludeIndex = -1) {
        if (!soymojiFiles || soymojiFiles.length < 2) return 0;
        
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * soymojiFiles.length);
        } while (newIndex === excludeIndex && soymojiFiles.length > 1);
        
        return newIndex;
    }

    function updateSoymojiButton(index) {
        if (!soymojiFiles || !soymojiFiles[index]) {
            soymojiButton.textContent = "S";
            return;
        }
        
        const filename = soymojiFiles[index];
        const shortcode = filename.split('.')[0];

        soymojiButton.innerHTML = '';

        const img = document.createElement('img');
        img.src = browser.runtime.getURL(`icons/soymoji/${filename}`);
        img.alt = shortcode;
        img.title = shortcode;
        img.style.height = '24px';
        img.style.width = '24px';
        img.style.objectFit = 'contain';
        img.style.verticalAlign = 'middle';
        img.style.imageRendering = 'pixelated';
        img.style.pointerEvents = 'none';
        img.style.filter = 'drop-shadow(0px 1px 1px rgba(0,0,0,0.3))';
        
        soymojiButton.appendChild(img);
    }

    updateSoymojiButton(currentSoymojiIndex);

    soymojiButton.addEventListener('mouseenter', () => {
        currentSoymojiIndex = getRandomSoymoji(currentSoymojiIndex);
        updateSoymojiButton(currentSoymojiIndex);
    });

    soymojiButton.addEventListener('focus', () => {
        currentSoymojiIndex = getRandomSoymoji(currentSoymojiIndex);
        updateSoymojiButton(currentSoymojiIndex);
    });

    Object.assign(soymojiButton.style, {
        padding: '2px 6px',
        border: '1px solid rgba(0,0,0,0.2)',
        background: 'white',
        backdropFilter: 'blur(4px)',
        cursor: 'pointer',
        fontSize: '11px',
        color: '#222',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        maxWidth: '26px',
        height: '26px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    });

    // === format button
    const formatButton = document.createElement('button');
    formatButton.classList.add("format-button-toggle");
    formatButton.type = "button";
    formatButton.tabIndex = 0;
    formatButton.title = "Text Formatting";
    const formatColors = [
        '#000000', // Black
        '#af0a0f', // Red
        '#2424ad', // Blue  
        '#720b98', // Purple
        '#FD3D98', // Pink
    ];

    const fontWeightOptions = ['normal', 'bold'];
    const fontStyleOptions = ['normal', 'italic'];
    const textDecorationOptions = ['none', 'underline', 'line-through'];
    const textShadowOptions = [
        'none',
        '0 0 3px #ff0000, 0 0 5px #ff0000', // Red glow
        '0 0 3px #00fe20, 0 0 5px #00fe20', // Green glow
        '0 0 3px #ffff00, 0 0 5px #fffb00', // Yellow glow
        '0 0 3px #36d7f7, 0 0 5px #36d7f7'  // Blue glow
    ];

    function getRandomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function generateRandomFormat() {
        return {
            label: 'A',
            style: {
                color: getRandomItem(formatColors),
                textDecoration: getRandomItem(textDecorationOptions),
                fontWeight: getRandomItem(fontWeightOptions),
                fontStyle: getRandomItem(fontStyleOptions),
                textShadow: getRandomItem(textShadowOptions)
            }
        };
    }

    function updateFormatButtonWithStyle(style) {
        formatButton.innerHTML = '';

        const labelSpan = document.createElement('span');
        labelSpan.textContent = 'A';
        labelSpan.style.pointerEvents = 'none';

        Object.assign(labelSpan.style, style);

        labelSpan.style.fontSize = '16px';
        labelSpan.style.display = 'inline-block';
        labelSpan.style.lineHeight = '1';
        
        formatButton.appendChild(labelSpan);
    }

    const defaultStyle = {
        color: '#2424ad',
        textDecoration: 'underline',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textShadow: 'none'
    };
    updateFormatButtonWithStyle(defaultStyle);

    let currentFormatStyle = { ...defaultStyle };

    formatButton.addEventListener('mouseenter', () => {
        const randomFormat = generateRandomFormat();
        currentFormatStyle = randomFormat.style;
        updateFormatButtonWithStyle(currentFormatStyle);
    });

    formatButton.addEventListener('focus', () => {
        const randomFormat = generateRandomFormat();
        currentFormatStyle = randomFormat.style;
        updateFormatButtonWithStyle(currentFormatStyle);
    });

    formatButton.addEventListener('mouseleave', () => {
        updateFormatButtonWithStyle(defaultStyle);
        currentFormatStyle = { ...defaultStyle };
    });

    formatButton.addEventListener('blur', () => {
        updateFormatButtonWithStyle(defaultStyle);
        currentFormatStyle = { ...defaultStyle };
    });

    Object.assign(formatButton.style, {
        padding: '2px 6px',
        border: '1px solid rgba(0,0,0,0.2)',
        background: 'white',
        backdropFilter: 'blur(4px)',
        cursor: 'pointer',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        minWidth: '26px',
        height: '26px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    });

    const previewBtn = document.createElement('button');
    previewBtn.id = 'preview-button';
    previewBtn.type = 'button';
    previewBtn.tabIndex = 0;

    Object.assign(previewBtn.style, {
        padding: '2px 6px',
        border: '1px solid rgba(0,0,0,0.2)',
        background: 'white', 
        backdropFilter: 'blur(4px)',
        cursor: 'pointer',
        fontSize: '11px',
        color: '#222',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
    });

    buttonContainer.appendChild(soymojiButton);
    buttonContainer.appendChild(formatButton);
    buttonContainer.appendChild(previewBtn);
    wrapper.appendChild(buttonContainer);

    const previewBox = document.createElement('div');
    previewBox.id = 'live-preview';
    Object.assign(previewBox.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        overflowY: 'auto',
        background: 'rgba(255,255,255,0.95)',
        border: '1px solid #999',
        padding: '6px',
        boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
        zIndex: '16',
        display: 'none',
        boxSizing: 'border-box'
    });

    wrapper.appendChild(previewBox);

    textarea.setAttribute(ATTACH_ATTR, 'true');

    function syncPreviewSize() {
        const h = textarea.offsetHeight;
        previewBox.style.height = h + 'px';
        previewBox.style.top = '0';
    }
    syncPreviewSize();

    let ro;
    if (typeof ResizeObserver !== 'undefined') {
        try {
            ro = new ResizeObserver(syncPreviewSize);
            ro.observe(textarea);
            ro.observe(wrapper);
        } catch (e) {
            window.addEventListener('resize', syncPreviewSize);
        }
    } else {
        window.addEventListener('resize', syncPreviewSize);
    }

    function showPreviewLocal() {
        syncPreviewSize();
        previewBox.style.display = 'block';
        renderPreview();
    }
    function hidePreviewLocal() {
        previewBox.style.display = 'none';
    }
    previewBtn.addEventListener('mouseleave', function () {
        setTimeout(() => {
            if (!previewBtn.matches(':hover') && document.activeElement !== previewBtn) {
                hidePreviewLocal();
            }
        }, 50);
    });

    previewBtn.addEventListener('blur', function () {
        setTimeout(() => {
            if (!previewBtn.matches(':hover') && document.activeElement !== previewBtn) {
                hidePreviewLocal();
            }
        }, 50);
    });

    previewBox.tabIndex = -1;
    previewBox.addEventListener('keydown', function (ev) {
        if (ev.key === 'Escape') {
            hidePreviewLocal();
            previewBtn.focus();
        }
    });

    function renderPreview() {
        const text = textarea.value;
        previewBox.innerHTML = text ? applyFormatting(text) : '<i>Text preview...</i>';
    }

    return {
        wrapper,
        textarea,
        previewBtn,
        soymojiButton,
        formatButton,
        previewBox,
        syncPreviewSize,
        renderPreview,
        resizeObserver: ro,
        showPreview: showPreviewLocal,
        hidePreview: hidePreviewLocal
    };
}

function computeCounts(text) {
    const chars = text.length;

    const lines = text.length === 0 ? 0 : text.split('\n').length;
    return { chars, lines };
}

function updateLabelFor(inst) {
    if (!inst || !inst.previewBtn || !inst.textarea) return;
    const enablePreview = flags.get('lp_enablePreview') === 'true';
    const enableCounter = flags.get('lp_enableCounter') === 'true';
    const forcePreviewText = flags.get('lp_forcePreviewText') === 'true';

    const text = inst.textarea.value || '';
    const { chars, lines } = computeCounts(text);

    if (forcePreviewText) {
        inst.previewBtn.textContent = 'Preview';
    } else if (enableCounter && !enablePreview) {
        inst.previewBtn.textContent = `${chars} | ${lines}`;
    } else if (enableCounter && enablePreview) {
        inst.previewBtn.textContent = `${chars} | ${lines}`;
    } else {
        inst.previewBtn.textContent = 'Preview';
    }
}

function applyFeatureState(inst) {
    if (!inst) return;

    const enablePreview = flags.get('lp_enablePreview') === 'true';
    const enableCounter = flags.get('lp_enableCounter') === 'true';

    if (!enablePreview && !enableCounter) {
        inst.previewBtn.style.display = 'none';
        inst.previewBox.style.display = 'none';
        return;
    } else {
        inst.previewBtn.style.display = '';
    }

    if (enableCounter && !enablePreview) {
        inst.previewBtn.style.background = 'transparent';
        inst.previewBtn.style.border = 'none';
        inst.previewBtn.style.boxShadow = 'none';
    } else {
        inst.previewBtn.style.background = 'white';
        inst.previewBtn.style.border = '1px solid rgba(0,0,0,0.2)';
        inst.previewBtn.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
    }

    if (enablePreview) {
        if (!inst._previewHandlersAttached) {
            const handler = function () {
                if (typeof inst.showPreview === 'function') inst.showPreview();
                else {
                    inst.syncPreviewSize();
                    inst.previewBox.style.display = 'block';
                    inst.renderPreview();
                }
            };
            inst._previewHandlerFunc = handler;
            inst.previewBtn.addEventListener('mouseenter', handler);
            inst.previewBtn.addEventListener('focus', handler);
            inst._previewHandlersAttached = true;
        }
    } else {
        if (inst._previewHandlersAttached) {
            try {
                inst.previewBtn.removeEventListener('mouseenter', inst._previewHandlerFunc);
                inst.previewBtn.removeEventListener('focus', inst._previewHandlerFunc);
            } catch (e) { }
            inst._previewHandlersAttached = false;
            inst._previewHandlerFunc = null;
        }
        inst.previewBox.style.display = 'none';
    }

    updateLabelFor(inst);

    if (!inst._inputHandlerAttached) {
        const onInput = function () {
            updateLabelFor(inst);
            if (flags.get('lp_enablePreview') === 'true' && inst.previewBox.style.display !== 'none') {
                inst.renderPreview();
            }
        };
        inst.textarea.addEventListener('input', onInput);
        inst._inputHandlerAttached = true;
        inst._onInput = onInput;
    }

    inst.updateCounter = function () {
        updateLabelFor(inst);
    };
    inst.updateLabel = function () {
        updateLabelFor(inst);
    };
}


function init() {
    if (localStorage.getItem('noPreviewText') === 'true') {
        return;
    }

    if (flags.get('lp_attach') !== 'true') return;

    const textarea = document.querySelector('#body');
    if (!textarea) return;

    buildSoyMap();

    const inst = attachToTextarea(textarea);
    if (!inst) return;

    state.textarea = inst.textarea;
    state.wrapper = inst.wrapper;
    state.previewBtn = inst.previewBtn;
    state.previewBox = inst.previewBox;
    state.resizeObserver = inst.resizeObserver;

    applyFeatureState(inst);

    const updateHandler = function () {
        if (inst.updateCounter) inst.updateCounter();
        if (inst.previewBox.style.display !== 'none') inst.renderPreview();
    };
    inst.textarea.addEventListener('livePreview:update', updateHandler);

    window.livePreview = window.livePreview || {};
    window.livePreview._instance = inst;
    window.livePreview.updateCounter = function () {
        updateHandler();
    };
    window.livePreview.setFlags = function (newFlags = {}) {
        Object.keys(newFlags).forEach(k => {
            if (k in DEFAULTS) {
                flags.set(k, String(newFlags[k]));
            }
        });
        applyFeatureState(inst);
    };
    window.livePreview.destroy = function () {
        destroy();
    };
    window.livePreview.init = function () {
        applyFeatureState(inst);
    };

    window.livePreview.triggerUpdateEvent = function () {
        const ev = new Event('livePreview:update');
        if (inst && inst.textarea) inst.textarea.dispatchEvent(ev);
    };
}

function destroy() {
    const inst = window.livePreview && window.livePreview._instance;
    if (!inst || state.destroyed) return;
    try { inst.textarea.removeAttribute(ATTACH_ATTR); } catch (e) { }
    if (inst.wrapper && inst.textarea) {
        try {
            inst.wrapper.parentNode.replaceChild(inst.textarea, inst.wrapper);
        } catch (e) {}
    }
    try { if (inst.previewBtn && inst.previewBtn.parentNode) inst.previewBtn.parentNode.removeChild(inst.previewBtn); } catch (e) { }
    try { if (inst.previewBox && inst.previewBox.parentNode) inst.previewBox.parentNode.removeChild(inst.previewBox); } catch (e) { }
    if (inst.resizeObserver) {
        try { inst.resizeObserver.disconnect(); } catch (e) { }
    }
    if (inst._inputHandlerAttached && inst._onInput) {
        try { inst.textarea.removeEventListener('input', inst._onInput); } catch (e) { }
    }
    state.destroyed = true;
    window.livePreview = null;
}

try {
    const existing = document.querySelector('#preview-button');
    if (!existing) init();
} catch (e) {
    console.error('live-preview init failed', e);
}

window.livePreview = window.livePreview || {};
window.livePreview.setFlags = window.livePreview.setFlags || function (newFlags = {}) {
    Object.keys(newFlags).forEach(k => {
        if (k in DEFAULTS) flags.set(k, String(newFlags[k]));
    });
    if (window.livePreview._instance) {
        applyFeatureState(window.livePreview._instance);
    }
    if (window.livePreview._qrInstance) {
        applyFeatureState(window.livePreview._qrInstance);
    }
};