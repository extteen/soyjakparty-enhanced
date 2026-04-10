const api = (typeof browser !== "undefined") ? browser : chrome;

const DEFAULTS_SYNC = {
    notifEnabled: false,
    selectedSound: "imrcv.mp3",
    transparencyDisabled: false,
    lp_attach: "true",
    lp_enablePreview: "true",
    lp_enableCounter: "false",
    customBoardLinks:  [],
    customHeaderLinks: [],
    headerWikiSearch:  false,
    spe_site_soyjak:   true,
    spe_site_soybooru: true,
    spe_site_wiki:     true,
    soybooruEnabled: true,
    textareaMinW: 400,
    textareaMinH: 120,
    textareaDesktopOnly: true,
};

const DEFAULTS_LOCAL = {
    customSound: null,
    userBackground: null,
};

const GITHUB_REPO = "extteen/soyjakparty-enhanced";
const el = (id) => document.getElementById(id);

const versionLine      = el("versionLine");
const statusLine       = el("statusLine");
const notifEnabled     = el("notifEnabled");
const soundSelect      = el("soundSelect");
const testSound        = el("testSound");
const customSoundFile  = el("customSoundFile");
const clearCustomSound = el("clearCustomSound");
const transparencyDisabled = el("transparencyDisabled");
const customBgFile     = el("customBgFile");
const clearCustomBg    = el("clearCustomBg");
const lpMode           = el("lpMode");
const boardLinkInput   = el("boardLinkInput");
const addBoardLink     = el("addBoardLink");
const clearAllLinks    = el("clearAllLinks");
const linksList        = el("linksList");
const linksEmpty       = el("linksEmpty");
const resetAll         = el("resetAll");
const headerWikiSearch  = el("headerWikiSearch");
const urlLinkInput      = el("urlLinkInput");
const addUrlLink        = el("addUrlLink");
const spe_site_soyjak   = el("spe_site_soyjak");
const spe_site_soybooru = el("spe_site_soybooru");
const spe_site_wiki     = el("spe_site_wiki");
const siteWarnNone      = el("siteWarnNone");
const siteWarnMain      = el("siteWarnMain");
const checkUpdateBtn   = el("checkUpdateBtn");
const updateResult     = el("updateResult");
const soybooruEnabled  = el("soybooruEnabled");
const textareaMinW       = el("textareaMinW");
const textareaMinH       = el("textareaMinH");
const textareaDesktopOnly = el("textareaDesktopOnly");

const audio = new Audio();
audio.preload = "auto";
audio.volume = 0.5;

function setStatus(msg, cls = "") {
    statusLine.textContent = msg;
    statusLine.className = "status" + (cls ? " " + cls : "");
}

function clampBoardName(s) {
    const v = String(s || "").trim();
    if (!v || /[^a-z0-9]/i.test(v)) return "";
    return v;
}

function computeLPMode(sync) {
    if (sync.lp_attach === "false") return "nothing";
    const c = sync.lp_enableCounter === "true";
    const p = sync.lp_enablePreview === "true";
    if (c && p) return "both";
    if (c)      return "counter";
    if (p)      return "preview";
    return "nothing";
}

function flagsFromLPMode(mode) {
    if (mode === "counter") return { lp_attach: "true", lp_enableCounter: "true",  lp_enablePreview: "false" };
    if (mode === "preview") return { lp_attach: "true", lp_enableCounter: "false", lp_enablePreview: "true"  };
    if (mode === "both")    return { lp_attach: "true", lp_enableCounter: "true",  lp_enablePreview: "true"  };
    return { lp_attach: "false", lp_enableCounter: "false", lp_enablePreview: "false" };
}

async function updateAudioSrc() {
    const local = await api.storage.local.get({ customSound: null });
    const sync  = await api.storage.sync.get({ selectedSound: "imrcv.mp3" });
    audio.src = local.customSound
        ? local.customSound
        : api.runtime.getURL(`audio/${sync.selectedSound}`);
}

function renderLinks(boardLinks, urlLinks) {
    linksList.innerHTML = "";
    const boards = Array.isArray(boardLinks) ? boardLinks : [];
    const urls   = Array.isArray(urlLinks)   ? urlLinks   : [];
    const total  = boards.length + urls.length;
    linksEmpty.style.display = total ? "none" : "block";

    function makeItem(labelText, typeLabel, onRemove) {
        const item = document.createElement("div");
        item.className = "link-item";

        const badge = document.createElement("span");
        badge.className = "link-type";
        badge.textContent = typeLabel;

        const name = document.createElement("span");
        name.textContent = labelText;
        name.style.flex = "1";

        const rm = document.createElement("button");
        rm.type = "button";
        rm.textContent = "remove";
        rm.addEventListener("click", onRemove);

        item.appendChild(badge);
        item.appendChild(name);
        item.appendChild(rm);
        linksList.appendChild(item);
    }

    for (const board of boards) {
        makeItem(board, "board", async () => {
            const got  = await api.storage.sync.get({ customBoardLinks: [] });
            const next = (got.customBoardLinks || []).filter(x => x !== board);
            await api.storage.sync.set({ customBoardLinks: next });
            renderLinks(next, urls);
            setStatus(`Removed: ${board}`, "warn");
        });
    }

    for (const { label, url } of urls) {
        makeItem(`${label} -> ${url}`, "url", async () => {
            const got  = await api.storage.sync.get({ customHeaderLinks: [] });
            const next = (got.customHeaderLinks || []).filter(x => x.label !== label || x.url !== url);
            await api.storage.sync.set({ customHeaderLinks: next });
            renderLinks(boards, next);
            setStatus(`Removed: ${label}`, "warn");
        });
    }
}
// updates

function normalizeVersionTag(tag) {
    return String(tag || "").replace(/^pr[-_]?v?/i, "").replace(/^v/i, "").trim();
}

async function fetchNewestRelease(repo) {
    const res = await fetch(`https://api.github.com/repos/${repo}/releases`, {
        headers: { Accept: "application/vnd.github.v3+json" },
    });
    if (!res.ok) throw new Error(`GitHub API error ${res.status}`);
    const releases = await res.json();
    if (!Array.isArray(releases) || !releases.length) return null;
    releases.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
    return releases[0];
}

async function checkForUpdates() {
    updateResult.textContent = "Checking…";
    updateResult.className = "update-result";
    checkUpdateBtn.disabled = true;

    try {
        const currentVersion = api.runtime.getManifest().version;
        const newest = await fetchNewestRelease(GITHUB_REPO);

        if (!newest) {
            updateResult.textContent = "No releases found.";
            return;
        }

        const latestTag  = newest.tag_name || "";
        const latestNorm = normalizeVersionTag(latestTag);
        const curNorm    = normalizeVersionTag(currentVersion);

        if (latestNorm !== curNorm) {
            updateResult.className = "update-result found";
            updateResult.innerHTML =
                `New version available: <strong>${latestTag}</strong> — ` +
                `<a href="${newest.html_url}" target="_blank" style="color:#7eb4ea;">Open release</a>`;
            const st = await api.storage.local.get(["ignoredVersions", "snoozedVersion"]);
            const ignored = Array.isArray(st.ignoredVersions) ? st.ignoredVersions : [];
            const snoozed = st.snoozedVersion || null;
            const todayStr = new Date().toISOString().slice(0, 10);

            const isSnoozed = snoozed && snoozed.version === latestTag && snoozed.until >= todayStr;
            if (!ignored.includes(latestTag) && !ignored.includes(latestNorm) && !isSnoozed) {
            }
        } else {
            updateResult.textContent = `Up to date (${currentVersion}).`;
        }
    } catch (err) {
        updateResult.className = "update-result bad";
        updateResult.textContent = `Update check failed: ${err.message}`;
        console.error("Update check failed:", err);
    } finally {
        checkUpdateBtn.disabled = false;
    }
}

async function autoCheckOncePerDay() {
    const today = new Date().toISOString().slice(0, 10);
    const st = await api.storage.local.get("lastCheckDate");
    if (st.lastCheckDate !== today) {
        await api.storage.local.set({ lastCheckDate: today });
        await checkForUpdates();
    }
}

function updateSiteWarnings() {
    const soyjak   = spe_site_soyjak.checked;
    const soybooru = spe_site_soybooru.checked;
    const wiki     = spe_site_wiki.checked;
    const noneSelected = !soyjak && !soybooru && !wiki;
    siteWarnNone.style.display = noneSelected ? "block" : "none";
    siteWarnMain.style.display = (!soyjak && !noneSelected) ? "block" : "none";
}

async function init() {
    try {
        const manifest = api.runtime.getManifest();
        versionLine.textContent = `version: ${manifest.version}`;
    } catch {
        versionLine.textContent = "version: ?";
    }

    const sync  = await api.storage.sync.get(DEFAULTS_SYNC);
    const local = await api.storage.local.get(DEFAULTS_LOCAL);

    notifEnabled.checked          = !!sync.notifEnabled;
    transparencyDisabled.checked  = !!sync.transparencyDisabled;
    soundSelect.value             = sync.selectedSound || "imrcv.mp3";
    lpMode.value                  = computeLPMode(sync);

    headerWikiSearch.checked  = !!sync.headerWikiSearch;

    spe_site_soyjak.checked   = !!sync.spe_site_soyjak;
    spe_site_soybooru.checked = !!sync.spe_site_soybooru;
    spe_site_wiki.checked     = !!sync.spe_site_wiki;
    updateSiteWarnings();

    soybooruEnabled.checked = !!sync.soybooruEnabled;

    textareaMinW.value        = sync.textareaMinW  ?? 400;
    textareaMinH.value        = sync.textareaMinH  ?? 120;
    textareaDesktopOnly.checked = !!sync.textareaDesktopOnly;

    renderLinks(sync.customBoardLinks, sync.customHeaderLinks);
    await updateAudioSrc();

    setStatus("Loaded.", "ok");

    autoCheckOncePerDay();
}
// events

notifEnabled.addEventListener("change", async () => {
    await api.storage.sync.set({ notifEnabled: notifEnabled.checked });
    setStatus(`Notification sounds: ${notifEnabled.checked ? "enabled" : "disabled"}`, notifEnabled.checked ? "ok" : "warn");
});

transparencyDisabled.addEventListener("change", async () => {
    await api.storage.sync.set({ transparencyDisabled: transparencyDisabled.checked });
    setStatus(`Transparency effects: ${transparencyDisabled.checked ? "disabled" : "enabled"}`, transparencyDisabled.checked ? "warn" : "ok");
});

soundSelect.addEventListener("change", async () => {
    await api.storage.sync.set({ selectedSound: soundSelect.value });
    await updateAudioSrc();
    setStatus(`Default sound: ${soundSelect.value}`, "ok");
});

testSound.addEventListener("click", async () => {
    await updateAudioSrc();
    audio.currentTime = 0;
    audio.play().catch(() => {});
});

customSoundFile.addEventListener("change", async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = async () => {
        await api.storage.local.set({ customSound: r.result });
        await updateAudioSrc();
        setStatus("Custom sound saved.", "ok");
    };
    r.readAsDataURL(file);
});

clearCustomSound.addEventListener("click", async () => {
    await api.storage.local.remove("customSound");
    customSoundFile.value = "";
    await updateAudioSrc();
    setStatus("Custom sound cleared.", "warn");
});

customBgFile.addEventListener("change", async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = async () => {
        await api.storage.local.set({ userBackground: r.result });
        setStatus("Custom background saved.", "ok");
    };
    r.readAsDataURL(file);
});

clearCustomBg.addEventListener("click", async () => {
    await api.storage.local.remove("userBackground");
    customBgFile.value = "";
    setStatus("Custom background cleared.", "warn");
});

lpMode.addEventListener("change", async () => {
    await api.storage.sync.set(flagsFromLPMode(lpMode.value));
    setStatus(`LP mode: ${lpMode.value}`, "ok");
});

addBoardLink.addEventListener("click", async () => {
    const v = clampBoardName(boardLinkInput.value);
    if (!v) return setStatus("Invalid board name (letters/numbers only).", "bad");

    const got = await api.storage.sync.get({ customBoardLinks: [] });
    const cur = Array.isArray(got.customBoardLinks) ? got.customBoardLinks : [];
    if (cur.includes(v)) return setStatus(`Already added: ${v}`, "warn");

    const next = [...cur, v];
    await api.storage.sync.set({ customBoardLinks: next });
    boardLinkInput.value = "";
    const gotUrl = await api.storage.sync.get({ customHeaderLinks: [] });
    renderLinks(next, gotUrl.customHeaderLinks);
    setStatus(`Added: ${v}`, "ok");
});

clearAllLinks.addEventListener("click", async () => {
    if (!confirm("Clear all header links?")) return;
    await api.storage.sync.set({ customBoardLinks: [], customHeaderLinks: [] });
    renderLinks([], []);
    setStatus("Cleared all links.", "warn");
});

soybooruEnabled.addEventListener("change", async () => {
    await api.storage.sync.set({ soybooruEnabled: soybooruEnabled.checked });
    setStatus(`Soybooru selector: ${soybooruEnabled.checked ? "enabled" : "disabled"}`, soybooruEnabled.checked ? "ok" : "warn");
});

function makeSiteToggle(checkbox, key) {
    checkbox.addEventListener("change", async () => {
        await api.storage.sync.set({ [key]: checkbox.checked });
        updateSiteWarnings();
        setStatus(`${key.replace('spe_site_', '')} menu: ${checkbox.checked ? "enabled" : "disabled"}`, checkbox.checked ? "ok" : "warn");
    });
}
makeSiteToggle(spe_site_soyjak,   "spe_site_soyjak");
makeSiteToggle(spe_site_soybooru, "spe_site_soybooru");
makeSiteToggle(spe_site_wiki,     "spe_site_wiki");

headerWikiSearch.addEventListener("change", async () => {
    await api.storage.sync.set({ headerWikiSearch: headerWikiSearch.checked });
    setStatus(`Wiki search bar: ${headerWikiSearch.checked ? "enabled" : "disabled"}`, headerWikiSearch.checked ? "ok" : "warn");
});

addUrlLink.addEventListener("click", async () => {
    const raw = urlLinkInput.value.trim();

    const colonIdx = raw.indexOf(":");
    if (colonIdx < 1) return setStatus("Format must be label:https://url", "bad");

    const label = raw.slice(0, colonIdx).trim();
    const url   = raw.slice(colonIdx + 1).trim();

    if (!label || /[^a-z0-9_-]/i.test(label))
        return setStatus("Label must be letters, numbers, _ or -", "bad");

    let parsedUrl;
    try { parsedUrl = new URL(url); } catch {
        return setStatus("Invalid URL, must start with https:// or http://", "bad");
    }
    if (!["https:", "http:"].includes(parsedUrl.protocol))
        return setStatus("URL must start with https:// or http://", "bad");

    const got  = await api.storage.sync.get({ customHeaderLinks: [], customBoardLinks: [] });
    const cur  = Array.isArray(got.customHeaderLinks) ? got.customHeaderLinks : [];
    if (cur.some(x => x.label === label))
        return setStatus(`Label already used: ${label}`, "warn");

    const next = [...cur, { label, url }];
    await api.storage.sync.set({ customHeaderLinks: next });
    urlLinkInput.value = "";
    renderLinks(got.customBoardLinks, next);
    setStatus(`Added URL link: ${label}`, "ok");
});

textareaDesktopOnly.addEventListener("change", async () => {
    await api.storage.sync.set({ textareaDesktopOnly: textareaDesktopOnly.checked });
    setStatus(`Textarea: desktop-only ${textareaDesktopOnly.checked ? "on" : "off"}`, "ok");
});

function saveTextareaSize() {
    const w = Math.max(0, parseInt(textareaMinW.value, 10) || 0);
    const h = Math.max(0, parseInt(textareaMinH.value, 10) || 0);
    textareaMinW.value = w;
    textareaMinH.value = h;
    api.storage.sync.set({ textareaMinW: w, textareaMinH: h });
    setStatus(`Textarea size: ${w || "default"} × ${h || "default"}px`, "ok");
}

textareaMinW.addEventListener("change", saveTextareaSize);
textareaMinH.addEventListener("change", saveTextareaSize);

resetAll.addEventListener("click", async () => {
    if (!confirm("Reset all SPE settings?")) return;
    await api.storage.sync.clear();
    await api.storage.local.clear();
    setStatus("Reset complete.", "warn");
    await init();
});

checkUpdateBtn.addEventListener("click", checkForUpdates);

api.storage.onChanged.addListener(() => {
    init().catch(() => {});
});

init().catch((e) => {
    console.error(e);
    setStatus("Failed to load settings.", "bad");
});