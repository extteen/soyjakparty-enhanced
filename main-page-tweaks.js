
(function () {
    'use strict';

    if (window.location.hostname === 'www.soyjak.st' && window.location.pathname === '/') {
        createSoyspherePanel();
        removeSisterSites();
        addHappeningsLink()
    }

    function removeSisterSites() {
        const sisterSitesElem = document.querySelector('li.sister-sites');
        if (sisterSitesElem) {
            sisterSitesElem.remove();
        }
    }

    function addHappeningsLink() {
        const currentYear = new Date().getFullYear();
        const linkUrl = `https://wiki.soyjak.st/Happenings/${currentYear}`;

        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';
        container.style.marginTop = '10px';

        const title = document.createElement('div');
        title.textContent = `Happenings of ${currentYear}`;
        title.style.color = 'black';
        title.style.fontSize = '10px';
        title.style.marginBottom = '2px';
        title.style.textAlign = 'center';
        title.style.userSelect = 'none';    

        const link = document.createElement('a');
        link.href = linkUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';

        const img = document.createElement('img');
        img.src = browser.runtime.getURL('icons/happenings.webp');
        img.alt = `Happenings ${currentYear}`;
        img.style.width = 'auto';
        img.style.height = '50px';
        img.style.cursor = 'pointer';


        container.appendChild(title);
        link.appendChild(img);
        container.appendChild(link);

        const panel = document.getElementById('soysphere-panel-ext-simple');
        if (panel) {
            panel.appendChild(container);
        } else {
            document.body.appendChild(container);
        }
    }


    function createSoyspherePanel() {

        const panel = document.createElement('div');
        panel.id = 'soysphere-panel-ext-simple';


        const imageTextContainer = document.createElement('div');
        imageTextContainer.id = 'soysphere-image-text-container-ext-simple';


        const sphereImage = document.createElement('img');
        try {


            sphereImage.src = browser.runtime.getURL('icons/mainpage/sphere.png');
        } catch (e) {

            sphereImage.src = '';
            sphereImage.alt = 'Sphere image not loaded';
        }
        sphereImage.alt = 'Soysphere';
        sphereImage.id = 'soysphere-image-ext-simple';

        const soysphereText = document.createElement('div');
        soysphereText.id = 'soysphere-text-ext-simple';
        soysphereText.textContent = 'The Soysphere';

        imageTextContainer.appendChild(sphereImage);
        imageTextContainer.appendChild(soysphereText);
        panel.appendChild(imageTextContainer);

        const linksContainer = document.createElement('div');
        linksContainer.id = 'soysphere-links-container-ext-simple';


        const links = [
            { text: 'Soybooru', href: 'https://soybooru.com/', icon: 'icons/mainpage/booru.png' },
            { text: 'Soyjak Wiki', href: 'https://wiki.soyjak.st/', icon: 'icons/mainpage/wiki.png' },
            { text: 'The Soysylum', href: 'https://soysylum.org/Main_Page', icon: 'icons/mainpage/soysylum.png' },
            { text: 'The Dailyjak', href: 'https://t.me/thedailyjak', icon: 'icons/mainpage/dailyjak.jpg' }
        ];

        links.forEach(linkInfo => {
            const linkElement = document.createElement('a');
            linkElement.href = linkInfo.href;
            if (linkInfo.href !== '#') { 
                linkElement.target = '_blank';
                linkElement.rel = 'noopener noreferrer';
            }


            const iconElement = document.createElement('img');
            try {
                iconElement.src = browser.runtime.getURL(linkInfo.icon);
            } catch (e) {

                iconElement.src = '';
                iconElement.alt = 'icon';
            }
            iconElement.classList.add('soysphere-link-icon');

            const textSpan = document.createElement('span');
            textSpan.textContent = linkInfo.text;

            linkElement.appendChild(iconElement);
            linkElement.appendChild(textSpan);
            linksContainer.appendChild(linkElement);
        });

        panel.appendChild(linksContainer);


        document.body.appendChild(panel);


        const css = `
            #soysphere-panel-ext-simple {
                position: fixed;
                top: 40px;
                right: 200px;
                width: auto;
                background-color: transparent;
                border: none;
                box-shadow: none;
                padding: 0;
                z-index: 20000;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 5px;
            }

            #soysphere-image-text-container-ext-simple {
                position: relative;
                display: flex;
                flex-direction: row;
                align-items: center; 
                gap: 5px;
                width: auto; 
                height: auto;
                flex-shrink: 0;
            }

            #soysphere-image-ext-simple {
                width: 50px;
                height: 50px;
                object-fit: contain;
                /* border-radius: 50%; (kept removed as per previous request) */
            }

            #soysphere-text-ext-simple {
                position: static;
                transform: none;
                top: auto;
                left: auto;
                color: white;
                font-size: 20px;
                font-weight: bold;
                text-shadow: 1px 1px 2px black, 0 0 3px black;
                text-align: right;
                white-space: nowrap;
                pointer-events: auto;
                width: auto;
            }

            #soysphere-links-container-ext-simple {
                display: flex;
                flex-direction: column;
                align-items: flex-end; 
            }

            #soysphere-links-container-ext-simple a {
                background-color: transparent;
                border: none;
                padding: 1px 0;
                margin-bottom: 4px;
                font-size: 15px;
                text-decoration: underline;
                
                display: flex;
                align-items: center;
                gap: 5px;
            }

            .soysphere-link-icon {
                width: 16px;
                height: 16px;
                object-fit: contain;
                flex-shrink: 0;
            }

            #soysphere-links-container-ext-simple a:hover {
                /* color: #0056b3; */
                /* text-decoration: none; */
            }

            #soysphere-links-container-ext-simple a:last-child {
                margin-bottom: 0;
            }
        `;

        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = css;
        document.head.appendChild(styleSheet);

        
    }
})();