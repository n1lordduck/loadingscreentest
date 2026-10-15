var Duck = window.Duck || {};
window.Duck = Duck;

Duck.Rules = (function () {
    var Sprites = Duck.Sprites;

    var PAGE_CHARS = 340;
    var PAGE_SECONDS = 8;
    var TEXT_BOX = { x: 28, y: 26, w: 130, h: 56 };

    var pages = [];
    var current = -1;
    var root, cloudCanvas, textBox, titleEl, itemsEl, dotsEl;
    var dotCanvases = [];

    function buildPages() {
        var rules = Duck.Data.rules;
        var list = [];

        for (var s = 0; s < rules.length; s++) {
            var section = rules[s];
            var chunks = [[]];
            var size = 0;

            for (var i = 0; i < section.items.length; i++) {
                var item = section.items[i];
                var len = item[1].length + 6;
                if (size + len > PAGE_CHARS && chunks[chunks.length - 1].length > 0) {
                    chunks.push([]);
                    size = 0;
                }
                chunks[chunks.length - 1].push(item);
                size += len;
            }

            for (var c = 0; c < chunks.length; c++) {
                list.push({
                    section: s,
                    number: s + 1,
                    title: section.title,
                    part: chunks.length > 1 ? (c + 1) + "/" + chunks.length : "",
                    items: chunks[c]
                });
            }
        }

        list.push({ section: -1, number: 0, title: "Lembre-se", part: "", items: [["", Duck.Data.footer]] });
        return list;
    }

    function escapeHtml(text) {
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    function renderPage(page) {
        titleEl.innerHTML = (page.number > 0 ? "<span class=\"rule-number\">" + page.number + "</span>" : "") +
            escapeHtml(page.title) +
            (page.part ? " <span class=\"rule-part\">" + page.part + "</span>" : "");

        var html = "";
        for (var i = 0; i < page.items.length; i++) {
            var item = page.items[i];
            html += "<p class=\"rule-item\">" +
                (item[0] ? "<span class=\"rule-tag\">§" + item[0] + "</span>" : "") +
                escapeHtml(item[1]) + "</p>";
        }
        itemsEl.innerHTML = html;
    }

    function updateDots(section) {
        for (var i = 0; i < dotCanvases.length; i++) {
            var dot = dotCanvases[i];
            dot.wrap.className = "rule-dot" + (i === section ? " rule-dot-active" : "");
        }
    }

    function show(index) {
        current = index % pages.length;
        var page = pages[current];
        root.className = "rule-cloud rule-cloud-out";

        setTimeout(function () {
            renderPage(page);
            updateDots(page.section);
            root.className = "rule-cloud rule-cloud-in";
        }, 320);
    }

    function next() {
        show(current + 1);
    }

    function layout(px) {
        var cloudScale = px + 1;
        Sprites.paintInto(cloudCanvas, "rule_cloud", cloudScale);
        root.style.width = cloudCanvas.width + "px";
        root.style.height = cloudCanvas.height + "px";
        root.style.marginLeft = -Math.floor(cloudCanvas.width / 2) + "px";

        textBox.style.left = TEXT_BOX.x * cloudScale + "px";
        textBox.style.top = TEXT_BOX.y * cloudScale + "px";
        textBox.style.width = TEXT_BOX.w * cloudScale + "px";
        textBox.style.height = TEXT_BOX.h * cloudScale + "px";
        textBox.style.fontSize = Math.round(cloudScale * 4.4) + "px";

        var dotScale = Math.max(1, Math.floor(px / 2));
        for (var i = 0; i < dotCanvases.length; i++) {
            Sprites.paintInto(dotCanvases[i].canvas, "cloud3", dotScale);
            Sprites.paintInto(dotCanvases[i].crown, "crown", dotScale);
        }
        dotsEl.style.fontSize = Math.round(px * 3.6) + "px";
        dotsEl.style.top = (root.offsetTop + cloudCanvas.height + px * 6) + "px";
    }

    function buildDots() {
        var count = Duck.Data.rules.length;
        for (var i = 0; i < count; i++) {
            var wrap = document.createElement("div");
            wrap.className = "rule-dot";
            var canvas = document.createElement("canvas");
            var crown = document.createElement("canvas");
            crown.className = "rule-dot-crown";
            var label = document.createElement("span");
            label.className = "rule-dot-label";
            label.innerHTML = String(i + 1);
            wrap.appendChild(crown);
            wrap.appendChild(canvas);
            wrap.appendChild(label);
            dotsEl.appendChild(wrap);
            dotCanvases.push({ wrap: wrap, canvas: canvas, crown: crown });
        }
    }

    function start() {
        root = document.getElementById("rule-cloud");
        cloudCanvas = document.getElementById("rule-cloud-sprite");
        textBox = document.getElementById("rule-text");
        titleEl = document.getElementById("rule-title");
        itemsEl = document.getElementById("rule-items");
        dotsEl = document.getElementById("rule-dots");

        pages = buildPages();
        buildDots();
        layout(Duck.Scene.scale());
        show(0);
        setInterval(next, PAGE_SECONDS * 1000);
    }

    return { start: start, layout: layout };
})();
