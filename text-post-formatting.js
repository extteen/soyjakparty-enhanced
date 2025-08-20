//SOYMOJI, TEXT FORMAT AND OTHER RAISIN
// EXTTEEN PRERELEASE 



async function fetchHtmlContent(url) {

    try {
        const response = await fetch(url);
        if (!response.ok) {

            const error = new Error(`HTTP error! Status: ${response.status} for URL: ${url}`);
            error.status = response.status;
            throw error;
        }
        const htmlContent = await response.text();
        return htmlContent;
    } catch (error) {
        console.error('Error fetching HTML content:', error);
        throw error;
    }
}

function parseAndExtractSoybooruThumbnails(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    const thumbnailContainer = doc.querySelector('section#image-list div.navside.tab div.shm-image-list');
    const extractedThumbnails = [];

    if (thumbnailContainer) {
        const postLinks = thumbnailContainer.querySelectorAll('a.shm-thumb-link');

        postLinks.forEach(linkElement => {
            const postId = linkElement.dataset.postId;
            const tags = linkElement.dataset.tags || linkElement.querySelector('img')?.title?.split(' // ')[0] || 'N/A';

            const imgElement = linkElement.querySelector('img');
            let rawThumbnailSrc = imgElement ? imgElement.getAttribute('src') : null;

            let thumbnailUrl = null;
            let fullImageUrl = null;

            if (rawThumbnailSrc && postId) {
                if (rawThumbnailSrc.startsWith('http://') || rawThumbnailSrc.startsWith('https://')) {
                    if (rawThumbnailSrc.includes('soybooru.com')) {
                        thumbnailUrl = rawThumbnailSrc;
                    } else {
                        console.warn("Found absolute thumbnail URL not from soybooru.com:", rawThumbnailSrc);
                        return;
                    }
                } else if (rawThumbnailSrc.startsWith('//')) {
                    thumbnailUrl = `https:${rawThumbnailSrc}`;
                } else if (rawThumbnailSrc.startsWith('/')) {
                    thumbnailUrl = `https://soybooru.com${rawThumbnailSrc}`;
                } else {
                    thumbnailUrl = `https://soybooru.com/${rawThumbnailSrc}`;
                }

                const thumbUrlParts = thumbnailUrl.split('/');
                const hash = thumbUrlParts[thumbUrlParts.length - 2];

                const originalMime = linkElement.dataset.mime;
                let originalExt = 'jpg';
                if (originalMime) {
                    const mimeParts = originalMime.split('/');
                    if (mimeParts.length > 1) {
                        originalExt = mimeParts[1].toLowerCase();
                        if (originalExt === 'jpeg') originalExt = 'jpg';
                        if (originalExt === 'mp4') originalExt = 'webm';
                    }
                } else if (imgElement && imgElement.src.includes('.')) {
                    originalExt = imgElement.src.split('.').pop();
                }

                const filenameTitlePart = 'SoyBooru';
                const encodedFilenameTitle = encodeURIComponent(filenameTitlePart);

                fullImageUrl = `https://soybooru.com/_images/${hash}/${postId}%20-%20${encodedFilenameTitle}.${originalExt}`;
            }

            if (postId && thumbnailUrl && fullImageUrl) {
                extractedThumbnails.push({
                    postId: postId,
                    thumbnailUrl: thumbnailUrl,
                    fullImageUrl: fullImageUrl,
                    tags: tags
                });
            } else {
                console.warn(`Skipping post due to missing crucial data. PostId: ${postId}, Thumbnail: ${thumbnailUrl}, Full Image: ${fullImageUrl}`);
            }
        });
    } else {
        console.warn('Soybooru thumbnail container (section#image-list div.navside.tab div.shm-image-list) not found.');
    }

    return extractedThumbnails;
}

const soybooruDirectSearch = localStorage.getItem('soybooruDirectSearch') === 'true';
let currentSearchTags = '';
let currentPageNumber = 1;

const soybooruFloatingWindow = document.createElement('div');
soybooruFloatingWindow.id = 'soybooru-floating-window';
soybooruFloatingWindow.style.display = 'none';
soybooruFloatingWindow.style.position = 'fixed';
soybooruFloatingWindow.style.top = '100px';
soybooruFloatingWindow.style.left = '100px';
soybooruFloatingWindow.style.width = '400px';
soybooruFloatingWindow.style.maxHeight = '500px';
soybooruFloatingWindow.style.background = '#fff';
soybooruFloatingWindow.style.border = '1px solid #ccc';
soybooruFloatingWindow.style.borderRadius = '8px';
soybooruFloatingWindow.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
soybooruFloatingWindow.style.zIndex = '10000';
soybooruFloatingWindow.style.resize = 'both';
soybooruFloatingWindow.style.minWidth = '250px';
soybooruFloatingWindow.style.minHeight = '150px';
soybooruFloatingWindow.style.flexDirection = 'column'; 
soybooruFloatingWindow.style.boxSizing = 'border-box';

document.body.appendChild(soybooruFloatingWindow);

const windowHeader = document.createElement('div');
windowHeader.style.padding = '8px 10px';
windowHeader.style.background = '#f0f0f0';
windowHeader.style.borderBottom = '1px solid #ddd';
windowHeader.style.cursor = 'grab';
windowHeader.style.display = 'flex';
windowHeader.style.justifyContent = 'space-between';
windowHeader.style.alignItems = 'center';
windowHeader.style.fontWeight = 'bold';
windowHeader.textContent = 'Soybooru Search';
windowHeader.style.flexShrink = '0';
soybooruFloatingWindow.appendChild(windowHeader);

const closeButton = document.createElement('button');
closeButton.textContent = '✖';
closeButton.style.background = 'none';
closeButton.style.border = 'none';
closeButton.style.fontSize = '16px';
closeButton.style.cursor = 'pointer';
closeButton.style.color = '#888';
closeButton.style.marginLeft = 'auto';
closeButton.addEventListener('click', () => {
    soybooruFloatingWindow.style.display = 'none';
});
windowHeader.appendChild(closeButton);

const windowContent = document.createElement('div');
windowContent.style.padding = '10px';
windowContent.style.display = 'flex';
windowContent.style.flexDirection = 'column';
windowContent.style.gap = '8px';
windowContent.style.flexGrow = '1';
windowContent.style.minHeight = '0';
windowContent.style.overflow = 'hidden'; 
soybooruFloatingWindow.appendChild(windowContent);

const floatingSearchInput = document.createElement('input');
floatingSearchInput.type = 'text';
floatingSearchInput.classList.add('soybooru-search-input-floating');
floatingSearchInput.placeholder = 'Enter tags...(space between each tag)';
floatingSearchInput.style.width = '100%';
floatingSearchInput.style.padding = '5px';
floatingSearchInput.style.boxSizing = 'border-box';
floatingSearchInput.style.borderRadius = '4px';
floatingSearchInput.style.border = '1px solid #ddd';
windowContent.appendChild(floatingSearchInput);

const floatingLoadingIndicator = document.createElement('div');
floatingLoadingIndicator.classList.add('soybooru-loading-indicator-floating');
floatingLoadingIndicator.textContent = 'Loading...';
floatingLoadingIndicator.style.display = 'none';
floatingLoadingIndicator.style.textAlign = 'center';
floatingLoadingIndicator.style.padding = '10px';
floatingLoadingIndicator.style.color = '#888';
windowContent.appendChild(floatingLoadingIndicator);

const floatingSearchResultsDisplay = document.createElement('div');
floatingSearchResultsDisplay.classList.add('soybooru-search-results-floating');
floatingSearchResultsDisplay.style.display = 'grid';
floatingSearchResultsDisplay.style.gridTemplateColumns = 'repeat(auto-fill, minmax(100px, 1fr))';
floatingSearchResultsDisplay.style.gap = '5px';
floatingSearchResultsDisplay.style.overflowY = 'auto';
floatingSearchResultsDisplay.style.overflowX = 'hidden';
floatingSearchResultsDisplay.style.flexGrow = '1';
floatingSearchResultsDisplay.style.minHeight = '0';
floatingSearchResultsDisplay.style.padding = '5px';
floatingSearchResultsDisplay.style.borderRadius = '4px';
windowContent.appendChild(floatingSearchResultsDisplay);

const paginationControls = document.createElement('div');
paginationControls.style.display = 'flex';
paginationControls.style.justifyContent = 'center';
paginationControls.style.alignItems = 'center';
paginationControls.style.gap = '10px';
paginationControls.style.padding = '8px 0';
paginationControls.style.borderTop = '1px solid #eee';
paginationControls.style.flexShrink = '0';
windowContent.appendChild(paginationControls);

const prevPageButton = document.createElement('button');
prevPageButton.textContent = 'Previous';
prevPageButton.classList.add('soybooru-pagination-button');
prevPageButton.disabled = true;
paginationControls.appendChild(prevPageButton);

const pageNumberInput = document.createElement('input');
pageNumberInput.type = 'number';
pageNumberInput.min = '1';
pageNumberInput.value = '1';
pageNumberInput.style.width = '50px';
pageNumberInput.style.textAlign = 'center';
pageNumberInput.style.padding = '3px';
pageNumberInput.style.borderRadius = '4px';
pageNumberInput.style.border = '1px solid #ddd';
paginationControls.appendChild(pageNumberInput);

const nextPageButton = document.createElement('button');
nextPageButton.textContent = 'Next';
nextPageButton.classList.add('soybooru-pagination-button');
nextPageButton.disabled = true;
paginationControls.appendChild(nextPageButton);

let isDragging = false;
let offsetX, offsetY;

windowHeader.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - soybooruFloatingWindow.getBoundingClientRect().left;
    offsetY = e.clientY - soybooruFloatingWindow.getBoundingClientRect().top;
    soybooruFloatingWindow.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    soybooruFloatingWindow.style.left = `${e.clientX - offsetX}px`;
    soybooruFloatingWindow.style.top = `${e.clientY - offsetY}px`;
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    soybooruFloatingWindow.style.cursor = 'grab';
});


const thumbnailContextMenu = document.createElement('div');
thumbnailContextMenu.id = 'soybooru-thumbnail-context-menu';
thumbnailContextMenu.style.display = 'none';
thumbnailContextMenu.style.position = 'absolute';
thumbnailContextMenu.style.background = '#fff';
thumbnailContextMenu.style.border = '1px solid #ccc';
thumbnailContextMenu.style.borderRadius = '4px';
thumbnailContextMenu.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
thumbnailContextMenu.style.zIndex = '10001';
thumbnailContextMenu.style.padding = '5px 0';

document.body.appendChild(thumbnailContextMenu);

function addContextMenuItem(text, action, postData, targetTextbox) {
    const item = document.createElement('div');
    item.textContent = text;
    item.style.padding = '5px 10px';
    item.style.cursor = 'pointer';
    item.style.whiteSpace = 'nowrap';
    item.addEventListener('mouseenter', () => item.style.backgroundColor = '#f0f0f0');
    item.addEventListener('mouseleave', () => item.style.backgroundColor = 'transparent');
    item.addEventListener('click', () => {
        if (!targetTextbox) {
            floatingSearchResultsDisplay.innerHTML = '<p style="text-align: center; color: #F44336; grid-column: 1 / -1;">Error: No active textbox detected. Please click on a text input before searching.</p>';
            floatingLoadingIndicator.style.display = 'none';
            setTimeout(() => soybooruFloatingWindow.style.display = 'none', 2500);
            thumbnailContextMenu.style.display = 'none'; 
            return; 
        }
        action(postData, targetTextbox);
        thumbnailContextMenu.style.display = 'none';
    });
    thumbnailContextMenu.appendChild(item);
}

document.addEventListener('click', (e) => {
    if (!thumbnailContextMenu.contains(e.target)) {
        thumbnailContextMenu.style.display = 'none';
    }
});
document.addEventListener('contextmenu', (e) => {
    if (!thumbnailContextMenu.contains(e.target) && !e.target.closest('.soybooru-thumb-item')) {
        thumbnailContextMenu.style.display = 'none';
    }
});


function insertTextIntoTextbox(textbox, textToInsert) {
    if (!textbox) return; 


    if (document.activeElement !== textbox) {
        textbox.focus();
    }

    if (textbox.tagName === 'TEXTAREA' || textbox.tagName === 'INPUT') {
        const start = textbox.selectionStart || 0;
        const end = textbox.selectionEnd || 0;
        const currentText = textbox.value;
        textbox.value = currentText.slice(0, start) + textToInsert + currentText.slice(end);
        textbox.selectionStart = textbox.selectionEnd = start + textToInsert.length;
    } else if (textbox.isContentEditable) {
        
        document.execCommand('insertText', false, textToInsert);
    }
}


async function performSoybooruSearch(tags, page) {
    floatingLoadingIndicator.style.display = 'block';
    floatingSearchResultsDisplay.innerHTML = '';
    prevPageButton.disabled = true;
    nextPageButton.disabled = true; 

    const htmlUrl = `https://soybooru.com/post/list/${encodeURIComponent(tags)}/${page}`;
    let htmlText = null;
    let is404 = false;

    try {
        htmlText = await fetchHtmlContent(htmlUrl);
    } catch (error) {
        if (error.status === 404) {
            is404 = true;
        }
        console.error('Error during search:', error);
    }

    if (htmlText) {
        const posts = parseAndExtractSoybooruThumbnails(htmlText);

        if (posts.length > 0) {
            renderSoybooruResults(posts, floatingSearchResultsDisplay, soybooruFloatingWindow.currentTextbox);
            nextPageButton.disabled = false;
        } else {
            floatingSearchResultsDisplay.innerHTML = '<p style="text-align: center; color: #888; grid-column: 1 / -1;">No results found for these tags on this page.</p>';
            nextPageButton.disabled = true;
        }
    } else {

        if (is404) {
            floatingSearchResultsDisplay.innerHTML = '<p style="text-align: center; color: #888; grid-column: 1 / -1;">No results found for these tags.</p>';
        } else {
            floatingSearchResultsDisplay.innerHTML = '<p style="text-align: center; color: #888; grid-column: 1 / -1;">Failed to load Soybooru content (try completing McChallenge).</p>';
        }
        nextPageButton.disabled = true;
    }
    floatingLoadingIndicator.style.display = 'none';


    prevPageButton.disabled = (currentPageNumber <= 1);
}


floatingSearchInput.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        const soybooruDirectSearch = localStorage.getItem('soybooruDirectSearch') === 'true';
        const query = floatingSearchInput.value.trim();
        if (!query) return;

        if (soybooruDirectSearch) {
            window.open(`https://soybooru.com/post/list/${encodeURIComponent(query)}/1`, '_blank');
            soybooruFloatingWindow.style.display = 'none';
        } else {
            currentSearchTags = query;
            currentPageNumber = 1;
            pageNumberInput.value = currentPageNumber;
            await performSoybooruSearch(currentSearchTags, currentPageNumber);
        }
    }
});

prevPageButton.addEventListener('click', async () => {
    if (currentPageNumber > 1 && currentSearchTags) {
        currentPageNumber--;
        pageNumberInput.value = currentPageNumber;
        await performSoybooruSearch(currentSearchTags, currentPageNumber);
    }
});

nextPageButton.addEventListener('click', async () => {
    if (currentSearchTags && !nextPageButton.disabled) {
        currentPageNumber++;
        pageNumberInput.value = currentPageNumber;
        await performSoybooruSearch(currentSearchTags, currentPageNumber);
    }
});

pageNumberInput.addEventListener('change', async () => {
    const newPage = parseInt(pageNumberInput.value, 10);
    if (!isNaN(newPage) && newPage >= 1 && currentSearchTags) {
        currentPageNumber = newPage;
        await performSoybooruSearch(currentSearchTags, currentPageNumber);
    } else {
        pageNumberInput.value = currentPageNumber;
    }
});

pageNumberInput.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const newPage = parseInt(pageNumberInput.value, 10);
        if (!isNaN(newPage) && newPage >= 1 && currentSearchTags) {
            currentPageNumber = newPage;
            await performSoybooruSearch(currentSearchTags, currentPageNumber);
        } else {
            pageNumberInput.value = currentPageNumber;
        }
    }
});

function renderSoybooruResults(posts, resultsDisplayElement, targetTextbox) {
    resultsDisplayElement.innerHTML = '';

    posts.forEach(post => {
        const thumbWrapper = document.createElement('div');
        thumbWrapper.classList.add('soybooru-thumb-item');
        thumbWrapper.style.textAlign = 'center';
        thumbWrapper.style.cursor = 'pointer';
        thumbWrapper.style.padding = '3px';
        thumbWrapper.style.border = '1px solid transparent';
        thumbWrapper.style.borderRadius = '3px';
        thumbWrapper.style.transition = 'all 0.1s ease';
        thumbWrapper.style.width = '100%';
        thumbWrapper.style.boxSizing = 'border-box';

        const img = document.createElement('img');
        img.src = post.thumbnailUrl;
        img.alt = `Post ID: ${post.postId}`;
        img.title = `ID: ${post.postId}\nTags: ${post.tags}`;
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';
        img.style.margin = '0 auto';
        
        thumbWrapper.appendChild(img);
        resultsDisplayElement.appendChild(thumbWrapper);

        thumbWrapper.addEventListener('contextmenu', (e) => {
            e.preventDefault();

            thumbnailContextMenu.innerHTML = '';

              

            addContextMenuItem('Download', async (data, textbox) => {
                fetch(post.fullImageUrl)
                    .then(response => response.blob())
                    .then(blob => {
                        const url = URL.createObjectURL(blob);
                        const fallbackA = document.createElement('a');
                        fallbackA.href = url;
                        fallbackA.download = post.fullImageUrl.split('/').pop() || `soybooru_${post.postId}`;
                        document.body.appendChild(fallbackA);
                        fallbackA.click();
                        setTimeout(() => {
                            document.body.removeChild(fallbackA);
                            URL.revokeObjectURL(url);
                        }, 100);
                    })
                    .catch(fetchError => {
                        console.error('Fetch download failed:', fetchError);
                        window.open(post.fullImageUrl, '_blank');
                    });
            }, post, targetTextbox);


            addContextMenuItem('Embed Thumbnail', (data, textbox) => {

                insertTextIntoTextbox(textbox, `[thumb]${post.postId}[/thumb]`);
                soybooruFloatingWindow.style.display = 'none'; 
            }, post, targetTextbox);

            addContextMenuItem('Open in New Tab', (data) => {
                window.open(`https://soybooru.com/post/view/${data.postId}`, '_blank');
                
                soybooruFloatingWindow.style.display = 'none'; 
            }, post, targetTextbox);

            thumbnailContextMenu.style.left = `${e.clientX}px`;
            thumbnailContextMenu.style.top = `${e.clientY}px`;
            thumbnailContextMenu.style.display = 'block';
        });

        thumbWrapper.addEventListener('mouseenter', () => {
            thumbWrapper.style.borderColor = '#aaa';
            thumbWrapper.style.backgroundColor = '#f5f5f5';
        });
        thumbWrapper.addEventListener('mouseleave', () => {
            thumbWrapper.style.borderColor = 'transparent';
            thumbWrapper.style.backgroundColor = 'transparent';
        });
    });
}


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

function updateAllTransparencyEffects() {
    const isTransparent = localStorage.getItem('transparencyDisabled') !== 'true';

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

//character and line counters
//MEDS!!!!!!!!!! Not working well so nothing burger, don't worry next updatearino


document.addEventListener('transparencyChanged', () => {
    updateAllTransparencyEffects();
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
formatMenu.style.zIndex = '9999';
formatMenu.style.padding = '5px';
formatMenu.style.borderRadius = '5px';
formatMenu.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
applyTransparencyEffects(formatMenu, localStorage.getItem('transparencyDisabled') !== 'true');


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

            
        };


        
        button.style.padding = '5px 8px';
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
soymojiMenu.style.gridTemplateColumns = 'repeat(7, 1fr)';
soymojiMenu.style.gap = '2px';
soymojiMenu.style.width = '620px';
soymojiMenu.style.borderRadius = '5px';
soymojiMenu.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
applyTransparencyEffects(soymojiMenu, localStorage.getItem('transparencyDisabled') !== 'true');


const soymojiFiles = [
    "a24.png", "ack.png", "amerimutt.png", "army.png", "army2.png","baby.png" ,"bernd.png", "chud.gif",
    "coal.png", "cob.png", "colorjak.png", "cry.png", "dancingswede.gif",
    "doctos.png", "euromutt.png", "fact.png", "feralrage.png", "feral_animated.gif",
    "gem.png", "gigachad.png", "impish.png", "jacobson.png", "jew.png", "jig.gif",
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
    img.style.height = '30px';
    img.style.width = 'auto';

    const label = document.createElement('span');
    label.textContent = shortcode;
    label.style.fontSize = '10px'; 
    //label.style.fontWeight = 'bold';
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


    searchButton.addEventListener('click', () => {

        const targetTextbox = document.getElementById('body');

        if (targetTextbox && (targetTextbox.tagName === 'TEXTAREA' || targetTextbox.tagName === 'INPUT' || targetTextbox.isContentEditable)) {
            soybooruFloatingWindow.currentTextbox = targetTextbox;
        } else {
            soybooruFloatingWindow.currentTextbox = document.activeElement;
            if (soybooruFloatingWindow.currentTextbox && !(soybooruFloatingWindow.currentTextbox.tagName === 'TEXTAREA' || soybooruFloatingWindow.currentTextbox.tagName === 'INPUT' || soybooruFloatingWindow.currentTextbox.isContentEditable)) {
                soybooruFloatingWindow.currentTextbox = document.querySelector('textarea, input[type="text"], input[type="search"], [contenteditable="true"]');
            }
            if (!soybooruFloatingWindow.currentTextbox) {
                console.warn("No suitable text input or contenteditable element found on the page, even after trying to target #body.");
            }
        }

        soybooruFloatingWindow.style.display = 'flex';
        soybooruFloatingWindow.offsetHeight;

        floatingSearchInput.value = '';
        if (soybooruFloatingWindow.currentTextbox) {
            let targetName = soybooruFloatingWindow.currentTextbox.id || soybooruFloatingWindow.currentTextbox.name || soybooruFloatingWindow.currentTextbox.tagName.toLowerCase();
            floatingSearchResultsDisplay.innerHTML = `<p style="text-align: center; color: #888; grid-column: 1 / -1;">Enter tags and press Enter to search.`;
        } else {
            floatingSearchResultsDisplay.innerHTML = '<p style="text-align: center; color: #F44336; grid-column: 1 / -1;">No text input detected. Embed/Insert features may not work. Please click a text box before searching.</p>';
        }

        floatingLoadingIndicator.style.display = 'none';
        floatingSearchInput.focus();

        currentSearchTags = '';
        currentPageNumber = 1;
        pageNumberInput.value = currentPageNumber;
        prevPageButton.disabled = true;
        nextPageButton.disabled = true;
    });



    textbox.dataset.enhanced = "true";
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


// Text Previews from a random soyteen's modified userscript. thanks

(function () {
    'use strict';

    const textarea = document.querySelector('#body');
    if (!textarea) return;

    if (typeof soymojiFiles === 'undefined') {
        console.warn('soymojiFiles is not defined. Preview image replacement will be skipped.');
        return;
    }
    const soymojiBasePath = 'icons/soymoji';
    const codeToFile = {};
    soymojiFiles.forEach(fn => {
        if (typeof fn !== 'string') return;
        const name = fn.replace(/\.[^/.]+$/, '').toLowerCase();
        if (!codeToFile[name]) codeToFile[name] = fn;
    });
    function extUrlFor(pathInsideExt) {
        try {
            if (typeof chrome !== 'undefined' && chrome.runtime && typeof chrome.runtime.getURL === 'function') {
                return chrome.runtime.getURL(pathInsideExt);
            }
            if (typeof browser !== 'undefined' && browser.runtime && typeof browser.runtime.getURL === 'function') {
                return browser.runtime.getURL(pathInsideExt);
            }
        } catch (e) {
        }
        return pathInsideExt;
    }
    if (codeToFile['baby'] && !codeToFile['babyjak']) codeToFile['babyjak'] = codeToFile['baby'];
    if (codeToFile['slf'] && !codeToFile['selfish']) codeToFile['selfish'] = codeToFile['slf'];

    function soymojiImgHTML(codeRaw) {
        const code = String(codeRaw).toLowerCase();
        const file = codeToFile[code];
        if (!file) return null;
        const hEm = 1.2;
        const src = extUrlFor(soymojiBasePath + '/' + file);
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

    const previewBtn = document.createElement('button');
    previewBtn.id = 'preview-button';
    previewBtn.type = 'button';
    previewBtn.innerText = 'Preview';
    previewBtn.title = 'Hover to preview';
    previewBtn.tabIndex = 0;
    Object.assign(previewBtn.style, {
        position: 'absolute',
        right: '9px',
        bottom: '9px',
        padding: '2px 4px',
        borderRadius: '4px',
        border: '1px solid rgba(0,0,0,0.2)',
        background: 'rgba(255,255,255,0.6)',
        backdropFilter: 'blur(4px)',
        cursor: 'pointer',
        zIndex: '32',
        fontSize: '10px',
        color: '#222',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
    });
    wrapper.appendChild(previewBtn);

    const previewBox = document.createElement('div');
    previewBox.id = 'live-preview';
    Object.assign(previewBox.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        overflowY: 'auto',
        background: 'rgba(255,255,255,0.9)',
        border: '1px solid #999',
        padding: '6px',
        boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
        zIndex: '16',
        display: 'none',
        boxSizing: 'border-box'
    });
    wrapper.appendChild(previewBox);

    function syncPreviewSize() {
        const h = textarea.offsetHeight;
        previewBox.style.height = h + 'px';
        previewBox.style.top = '0';
    }

    syncPreviewSize();

    if (typeof ResizeObserver !== 'undefined') {
        try {
            const ro = new ResizeObserver(syncPreviewSize);
            ro.observe(textarea);
            ro.observe(wrapper);
        } catch (e) {
            window.addEventListener('resize', syncPreviewSize);
        }
    } else {
        window.addEventListener('resize', syncPreviewSize);
    }

    function showPreview() {
        syncPreviewSize();
        previewBox.style.display = 'block';
        renderPreview();
    }
    function hidePreview() {
        previewBox.style.display = 'none';
    }

    previewBtn.addEventListener('mouseenter', showPreview);
    previewBtn.addEventListener('focus', showPreview);

    previewBtn.addEventListener('mouseleave', function () {
        setTimeout(() => {
            if (!previewBtn.matches(':hover') && document.activeElement !== previewBtn) {
                hidePreview();
            }
        }, 50);
    });

    previewBtn.addEventListener('blur', function () {
        setTimeout(() => {
            if (!previewBtn.matches(':hover') && document.activeElement !== previewBtn) {
                hidePreview();
            }
        }, 50);
    });


    previewBox.tabIndex = -1;
    previewBox.addEventListener('keydown', function (ev) {
        if (ev.key === 'Escape') {
            hidePreview();
            previewBtn.focus();
        }
    });

    function renderPreview() {
        const text = textarea.value;
        previewBox.innerHTML = text ? applyFormatting(text) : '<i>Text formatting preview...</i>';
    }

    textarea.addEventListener('input', () => {
        syncPreviewSize();
        if (previewBox.style.display !== 'none') renderPreview();
    });

    textarea.addEventListener('focus', syncPreviewSize);

    renderPreview();
})();
