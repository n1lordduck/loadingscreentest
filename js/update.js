var Duck = window.Duck || {};
window.Duck = Duck;

Duck.Update = (function () {
    var PAGE_COST = 320;
    var ITEM_EXTRA = 14;
    var TAG_COST = 28;
    var PAGE_SECONDS = 8;
    var MIN_BODY_REM = 9;
    var CARD_GAP_PX = 24;

    var pages = [];
    var current = -1;
    var timer = null;
    var root, titleEl, pageEl, dotsEl, dots = [];

    function sentences(text) {
        return text.match(/[^.]+\.?\s*/g) || [text];
    }

    function unitsOf(block) {
        var units = [];
        var i;
        if (block.text) {
            var parts = sentences(block.text);
            for (i = 0; i < parts.length; i++) units.push({ kind: "text", value: parts[i], cost: parts[i].length });
        }
        if (block.items) {
            for (i = 0; i < block.items.length; i++) units.push({ kind: "item", value: block.items[i], cost: block.items[i].length + ITEM_EXTRA });
        }
        if (block.tags) {
            for (i = 0; i < block.tags.length; i++) units.push({ kind: "tag", value: block.tags[i], cost: TAG_COST });
        }
        return units;
    }

    function buildPages() {
        var sections = Duck.Data.update.sections;
        var list = [];

        for (var s = 0; s < sections.length; s++) {
            var units = [];
            for (var b = 0; b < sections[s].blocks.length; b++) {
                units = units.concat(unitsOf(sections[s].blocks[b]));
            }

            var chunks = [[]];
            var size = 0;
            for (var u = 0; u < units.length; u++) {
                if (size + units[u].cost > PAGE_COST && chunks[chunks.length - 1].length > 0) {
                    chunks.push([]);
                    size = 0;
                }
                chunks[chunks.length - 1].push(units[u]);
                size += units[u].cost;
            }

            for (var c = 0; c < chunks.length; c++) {
                list.push({
                    title: sections[s].title,
                    part: chunks.length > 1 ? (c + 1) + "/" + chunks.length : "",
                    units: chunks[c]
                });
            }
        }
        return list;
    }

    function escapeHtml(text) {
        var safe = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return safe.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    }

    function itemHtml(value) {
        var match = /^([+-])\s+(.*)$/.exec(value);
        if (!match) return "<li class=\"update-item\">" + escapeHtml(value) + "</li>";
        var sign = match[1] === "+" ? "update-add" : "update-remove";
        return "<li class=\"update-item update-signed\"><span class=\"update-sign " + sign + "\">" + match[1] + "</span>" + escapeHtml(match[2]) + "</li>";
    }

    function renderUnits(units) {
        var html = "";
        var open = "";
        for (var i = 0; i < units.length; i++) {
            var kind = units[i].kind;
            if (kind !== open) {
                if (open === "item") html += "</ul>";
                if (open === "tag") html += "</div>";
                if (kind === "item") html += "<ul class=\"update-list\">";
                if (kind === "tag") html += "<div class=\"update-tags\">";
                open = kind;
            }
            if (kind === "text") html += "<span class=\"update-text\">" + escapeHtml(units[i].value) + "</span>";
            if (kind === "item") html += itemHtml(units[i].value);
            if (kind === "tag") html += "<span class=\"update-tag\">" + escapeHtml(units[i].value) + "</span> ";
        }
        if (open === "item") html += "</ul>";
        if (open === "tag") html += "</div>";
        return html;
    }

    function renderPage(page) {
        var title = document.getElementById("update-page-title");
        title.innerHTML = escapeHtml(page.title) + (page.part ? " <span class=\"update-part\">" + page.part + "</span>" : "");
        pageEl.innerHTML = renderUnits(page.units);
    }

    function updateDots(index) {
        for (var i = 0; i < dots.length; i++) {
            dots[i].className = "update-dot" + (i === index ? " update-dot-active" : "");
        }
    }

    function show(index) {
        current = index % pages.length;
        var page = pages[current];
        root.className = "update-out";

        setTimeout(function () {
            renderPage(page);
            updateDots(current);
            root.className = "update-in";
        }, 300);
    }

    function next() {
        show(current + 1);
    }

    function buildDots() {
        for (var i = 0; i < pages.length; i++) {
            var dot = document.createElement("span");
            dot.className = "update-dot";
            dotsEl.appendChild(dot);
            dots.push(dot);
        }
    }

    function rootFontPx() {
        return parseFloat(document.documentElement.style.fontSize) || 16;
    }

    function fits() {
        var cloud = document.getElementById("rule-cloud").getBoundingClientRect();
        var card = root.getBoundingClientRect();
        var body = document.getElementById("update-body");
        var clearOfCloud = card.left - cloud.right >= CARD_GAP_PX || card.top >= cloud.bottom;
        var tallEnough = body.offsetHeight >= MIN_BODY_REM * rootFontPx();
        return clearOfCloud && tallEnough;
    }

    function layout() {
        if (!root) return;
        root.style.visibility = "hidden";
        root.style.display = "block";
        var ok = fits();
        root.style.display = ok ? "block" : "none";
        root.style.visibility = "visible";
        if (ok && !timer) timer = setInterval(next, PAGE_SECONDS * 1000);
        if (!ok && timer) {
            clearInterval(timer);
            timer = null;
        }
    }

    function start() {
        root = document.getElementById("update");
        var data = Duck.Data.update;
        if (!data || !data.sections || !data.sections.length) {
            root.style.display = "none";
            root = null;
            return;
        }
        titleEl = document.getElementById("update-title");
        pageEl = document.getElementById("update-page");
        dotsEl = document.getElementById("update-dots");

        document.getElementById("update-version").appendChild(document.createTextNode(data.version));
        titleEl.appendChild(document.createTextNode(data.title));

        pages = buildPages();
        buildDots();
        show(0);
    }

    return { start: start, layout: layout };
})();
