var Duck = window.Duck || {};
window.Duck = Duck;

Duck.Notice = (function () {
    var GAP_PX = 24;
    var QUIET_MODULES = 2;
    var QR_REM = 6.4;
    var root, data;

    function rootFontPx() {
        return parseFloat(document.documentElement.style.fontSize) || 16;
    }

    function fillRich(el, text) {
        var parts = text.split("**");
        for (var i = 0; i < parts.length; i++) {
            if (i % 2 === 1) {
                var strong = document.createElement("strong");
                strong.appendChild(document.createTextNode(parts[i]));
                el.appendChild(strong);
            } else {
                el.appendChild(document.createTextNode(parts[i]));
            }
        }
    }

    function drawQr() {
        var rows = data.qr;
        var holder = document.getElementById("notice-qr");
        if (!rows || !rows.length) {
            holder.style.display = "none";
            return;
        }
        var canvas = document.getElementById("notice-qr-canvas");
        var total = rows.length + QUIET_MODULES * 2;
        var cell = Math.max(2, Math.floor(QR_REM * rootFontPx() / total));
        canvas.width = canvas.height = total * cell;
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#101828";
        for (var y = 0; y < rows.length; y++) {
            for (var x = 0; x < rows[y].length; x++) {
                if (rows[y].charAt(x) === "1") ctx.fillRect((x + QUIET_MODULES) * cell, (y + QUIET_MODULES) * cell, cell, cell);
            }
        }
        holder.style.display = "block";
    }

    function place(topPx) {
        root.style.top = topPx + "px";
        root.style.display = "block";
    }

    function fits() {
        var card = root.getBoundingClientRect();
        var cloud = document.getElementById("rule-cloud").getBoundingClientRect();
        var polaroid = document.getElementById("polaroid");
        var photo = polaroid.getBoundingClientRect();
        var clearOfCloud = cloud.left - card.right >= GAP_PX || card.bottom <= cloud.top;
        var clearOfPolaroid = polaroid.style.display === "none" || photo.top - card.bottom >= GAP_PX / 2;
        return clearOfCloud && clearOfPolaroid;
    }

    function layout() {
        if (!root) return;
        drawQr();
        root.style.visibility = "hidden";
        place(8.5 * rootFontPx());
        if (!fits()) root.style.display = "none";
        root.style.visibility = "visible";
    }

    function bottomPx() {
        if (!root || root.style.display === "none") return 0;
        return root.offsetTop + root.offsetHeight;
    }

    function start() {
        root = document.getElementById("notice");
        data = Duck.Data.notice;
        if (!data || !data.text) {
            root.style.display = "none";
            root = null;
            return;
        }
        document.getElementById("notice-badge").appendChild(document.createTextNode(data.badge || "!"));
        document.getElementById("notice-title").appendChild(document.createTextNode(data.title));
        fillRich(document.getElementById("notice-text"), data.text);
    }

    return { start: start, layout: layout, bottomPx: bottomPx };
})();
