//SOYMOJI, TEXT FORMAT AND OTHER RAISIN
// EXTTEEN RELEASE (CHANGE THIS COMMENT IF YOU MODDED)

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
        title: 'Text Formats 2',
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
formatMenu.style.background = '#fff';
formatMenu.style.border = '1px solid #ccc';
formatMenu.style.zIndex = '9999';
formatMenu.style.padding = '5px';
formatMenu.style.borderRadius = '5px';
formatMenu.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)'; 


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
            // Text Formats 2
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

            button.style.pointerEvents = 'none'
        };


        button.type = 'button';
        button.style.padding = '5px 8px';
        button.style.border = '1px solid #ddd';
        button.style.borderRadius = '3px';
        button.style.background = '#f9f9f9';
        button.style.cursor = 'pointer';
        button.style.fontSize = '12px';
        button.style.whiteSpace = 'nowrap'; 

        button.addEventListener('mouseenter', () => button.style.background = '#e0e0e0');
        button.addEventListener('mouseleave', () => button.style.background = '#f9f9f9');

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
soymojiMenu.style.background = '#fff';
soymojiMenu.style.border = '1px solid #ccc';
soymojiMenu.style.zIndex = '9999';
soymojiMenu.style.padding = '5px';
soymojiMenu.style.gridTemplateColumns = 'repeat(7, 1fr)'; 
soymojiMenu.style.gap = '12px';
soymojiMenu.style.width = '620px'; 
soymojiMenu.style.borderRadius = '5px';
soymojiMenu.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';


const soymojiFiles = [
    "a24.png", "ack.png", "amerimutt.png", "army.png", "army2.png", "chud.gif",
    "coal.png", "cob.png", "colorjak.png", "cry.png", "dancingswede.gif",
    "doctos.png", "euromutt.png", "fact.png", "feralrage.png", "feral_animated.gif",
    "gem.png", "gigachad.png", "impish.png", "jacobson.png", "jew.png", "jig.gif",
    "med.gif", "microjaklover.png", "neutralplier.png", "nojak.png", "over.png",
    "pepe.png", "pepetux.png", "pepetwerk.gif", "perrojak.png", "posteditagain.png",
    "selfish.png", "sisa.png", "slf.gif", "smug.png", "smugsoyak.png", "soot.png",
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
    soymojiDiv.style.padding = '3px';
    soymojiDiv.style.borderRadius = '3px';
    soymojiDiv.style.transition = 'background-color 0.1s ease';

    const img = document.createElement('img');
    img.src = browser.runtime.getURL(`icons/soymoji/${filename}`);
    img.alt = shortcode;
    img.style.width = '30px';
    img.style.height = 'auto';

    const label = document.createElement('span');
    label.textContent = shortcode;
    label.style.fontSize = '10px';
    label.style.marginTop = '2px';
    label.style.wordBreak = 'break-all';

    soymojiDiv.appendChild(img);
    soymojiDiv.appendChild(label);
    soymojiMenu.appendChild(soymojiDiv);

    soymojiDiv.addEventListener('mouseenter', () => soymojiDiv.style.backgroundColor = '#f0f0f0');
    soymojiDiv.addEventListener('mouseleave', () => soymojiDiv.style.backgroundColor = 'transparent');
});
document.body.appendChild(soymojiMenu); 


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
    if (!textbox) {
        
        return;
    }
    if (textbox.dataset.enhanced === "true") {
        
        return;
    }



    const wrapper = document.createElement('div');
    wrapper.classList.add('textbox-wrapper');
    textbox.parentNode.insertBefore(wrapper, textbox);
    wrapper.appendChild(textbox);
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.alignItems = 'flex-start';
    wrapper.style.gap = '0px';

    const buttonColumn = document.createElement('div');
    buttonColumn.classList.add('button-column');
    buttonColumn.style.display = 'flex';
    buttonColumn.style.flexDirection = 'row';
    buttonColumn.style.gap = '10px';
    buttonColumn.style.width = '425px';
    wrapper.appendChild(buttonColumn);

    const soymojiButton = document.createElement('button');
    soymojiButton.classList.add("soymoji-button");
    soymojiButton.innerText = "☰ Soymoji";
    soymojiButton.type = "button";
    buttonColumn.appendChild(soymojiButton);

    const formatButton = document.createElement('button');
    formatButton.classList.add("format-button-toggle");
    formatButton.innerText = "☰ Text Format";
    formatButton.type = "button";
    buttonColumn.appendChild(formatButton);

    const searchButton = document.createElement('button');
    searchButton.classList.add("booru-search-button");
    searchButton.innerText = "🔎︎ Soybooru Search";
    searchButton.type = "button";
    buttonColumn.appendChild(searchButton);

    const searchContainer = document.createElement('div');
    searchContainer.classList.add('soybooru-search-container');
    searchContainer.style.display = 'none';
    searchContainer.style.marginTop = '0px';
    searchContainer.style.position = 'relative';
    searchContainer.style.flexDirection = 'column';
    searchContainer.style.gap = '4px';
    searchContainer.style.width = '100%';
    wrapper.appendChild(searchContainer);

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.classList.add('soybooru-search-input');
    searchInput.placeholder = 'Enter tags...(space between each tag)';
    searchInput.value = '';
    searchInput.style.width = '100%';
    searchInput.style.padding = '4px';
    searchInput.style.fontSize = '13px';
    searchInput.style.boxSizing = 'border-box';
    
    searchInput.autocomplete = 'off';
    searchInput.name = 'soybooru-search-input-unique';
    searchInput.form = 'no-form';
    searchContainer.appendChild(searchInput);

    
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();e

            const query = searchInput.value.trim();
            if (query) {
                const url = `https://booru.soyjak.st/post/list/${encodeURIComponent(query)}/1`;
                window.open(url, '_blank');
                searchInput.value = '';
            }
            
            searchContainer.style.display = 'none';
        }
    });

    textbox.dataset.enhanced = "true";
}


function enhanceEmailTextbox(emailTextbox) {
    if (!emailTextbox) {
        
        return;
    }
    if (emailTextbox.dataset.enhanced === "true") {
        
        return;
    }

    

    const wrapper = document.createElement('div');
    wrapper.classList.add('email-textbox-wrapper');
    wrapper.style.position = 'relative';
    wrapper.style.display = 'inline-block';
    emailTextbox.parentNode.insertBefore(wrapper, emailTextbox);
    wrapper.appendChild(emailTextbox);

    emailTextbox.style.paddingRight = '30px';

    const dropdownBtn = document.createElement('button');
    dropdownBtn.classList.add('email-dropdown-button');
    dropdownBtn.type = 'button';
    dropdownBtn.textContent = '▼';
    dropdownBtn.style.position = 'absolute';
    dropdownBtn.style.right = '5px';
    dropdownBtn.style.top = '50%';
    dropdownBtn.style.transform = 'translateY(-50%)';
    dropdownBtn.style.border = 'none';
    dropdownBtn.style.background = 'transparent';
    dropdownBtn.style.cursor = 'pointer';
    dropdownBtn.style.padding = '2px';
    dropdownBtn.style.fontSize = '14px';
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
    dropdownMenu.style.borderRadius = '4px';
    dropdownMenu.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
    dropdownMenu.style.display = 'none';
    dropdownMenu.style.zIndex = '9999';
    dropdownMenu.style.minWidth = '120px';
    dropdownMenu.style.padding = '5px 0';
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
        btn.addEventListener('mouseout', () => {
            btn.style.background = 'white';
        });

        
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const currentWrapper = e.target.closest('.email-textbox-wrapper');
            const currentEmailTextbox = currentWrapper?.querySelector('input[name="email"]');
            const currentDropdownMenu = currentWrapper?.querySelector('.email-dropdown-menu');

            if (currentEmailTextbox) {
                currentEmailTextbox.value = opt.value;
                currentEmailTextbox.focus(); 
                
                const inputEvent = new Event('input', { bubbles: true });
                currentEmailTextbox.dispatchEvent(inputEvent);
            } else {
                
            }
            if (currentDropdownMenu) {
                currentDropdownMenu.style.display = 'none';
            }
        });

        dropdownMenu.appendChild(btn);
    });

    
    dropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.style.display = dropdownMenu.style.display === 'none' ? 'block' : 'none';
        
        if (dropdownMenu.style.display === 'block') {
            emailTextbox.focus();
        }
    });

    
    emailTextbox.addEventListener('input', () => {
        dropdownMenu.style.display = 'none';
    });

    emailTextbox.dataset.enhanced = "true";
}



function tryEnhanceQuickReplyFields() {
    const quickReplyContainer = document.getElementById('quick-reply');

    if (quickReplyContainer) {
        
        setTimeout(() => {
            const body = quickReplyContainer.querySelector('textarea[name="body"]');
            const email = quickReplyContainer.querySelector('input[name="email"]');

            if (body && body.dataset.enhanced !== "true") {
                
                enhanceTextbox(body);
            } else if (body) {
                
            }

            if (email && email.dataset.enhanced !== "true") {
                
                enhanceEmailTextbox(email);
            } else if (email) {
                
            }
        }, 50); 
    } else {
        
    }
}


document.querySelectorAll('textarea[name="body"]:not([data-enhanced])').forEach(enhanceTextbox);
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
        const textbox = event.target.closest('.textbox-wrapper')?.querySelector('textarea[name="body"]');

        if (textbox && soymojiMenu) {
            const rect = event.target.getBoundingClientRect();
            soymojiMenu.style.left = `${rect.right + 10}px`;
            soymojiMenu.style.top = `${rect.top + window.scrollY}px`;
            soymojiMenu.style.display = soymojiMenu.style.display === 'none' ? 'grid' : 'none';


            soymojiMenu.dataset.activeTextboxId = textbox.id || (textbox.id = `textbox-${Date.now()}`);
        } else {
           
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

            
            const textbox = event.target.closest('.textbox-wrapper')?.querySelector('textarea[name="body"]');
            if (textbox) {
                formatMenu.dataset.activeTextboxId = textbox.id || (textbox.id = `textbox-${Date.now()}-main`);
            } else {
                
            }
        } else {
            
        }
    }

    if (event.target && event.target.classList.contains('booru-search-button')) {
        event.preventDefault();
        event.stopPropagation();

        const searchContainer = event.target.closest('.textbox-wrapper')?.querySelector('.soybooru-search-container');
        const searchInput = searchContainer?.querySelector('.soybooru-search-input');

        if (searchContainer && searchInput) {
            let searchUIVisible = searchContainer.style.display !== 'none';
            searchUIVisible = !searchUIVisible;

            if (searchUIVisible) {
                searchContainer.style.display = 'flex';
                searchInput.focus();
            } else {
                searchContainer.style.display = 'none';
            }
        } else {
            
        }
    }


    if (event.target && event.target.classList.contains('email-dropdown-button')) {
        event.preventDefault();
        event.stopPropagation();
        const wrapper = event.target.closest('.email-textbox-wrapper');
        const dropdownMenu = wrapper?.querySelector('.email-dropdown-menu');
        const emailTextbox = wrapper?.querySelector('input[name="email"]');

        if (dropdownMenu && emailTextbox) {
            dropdownMenu.style.display = dropdownMenu.style.display === 'none' ? 'block' : 'none';

            emailTextbox.focus();
        } else {
            
        }
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