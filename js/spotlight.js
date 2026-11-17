var Duck = window.Duck || {};
window.Duck = Duck;

Duck.Spotlight = (function () {
    var GAP_PX = 24;
    var root;

    function textNode(tag, className, text) {
        var el = document.createElement(tag);
        el.className = className;
        el.appendChild(document.createTextNode(text));
        return el;
    }

    function buildCommand(command) {
        var item = document.createElement("li");
        item.className = "spot-cmd";
        var name = textNode("span", "spot-name", command[0]);
        name.appendChild(textNode("span", "spot-arg", " " + command[1]));
        item.appendChild(name);
        item.appendChild(textNode("span", "spot-desc", command[2]));
        return item;
    }

    function fits() {
        var card = root.getBoundingClientRect();
        var cloud = document.getElementById("rule-cloud").getBoundingClientRect();
        var polaroid = document.getElementById("polaroid").getBoundingClientRect();
        var clearOfCloud = cloud.left - card.right >= GAP_PX || card.bottom <= cloud.top;
        var clearOfPolaroid = polaroid.top - card.bottom >= GAP_PX / 2 || document.getElementById("polaroid").style.display === "none";
        return clearOfCloud && clearOfPolaroid;
    }

    function layout() {
        if (!root) return;
        var font = parseFloat(document.documentElement.style.fontSize) || 16;
        var below = Duck.Notice && Duck.Notice.ready ? Duck.Notice.bottomPx() : 0;
        root.style.visibility = "hidden";
        root.style.top = (below ? below + 0.9 * font : 8.5 * font) + "px";
        root.style.display = "block";
        var ok = fits();
        root.style.display = ok ? "block" : "none";
        root.style.visibility = "visible";
    }

    function start() {
        root = document.getElementById("spotlight");
        var data = Duck.Data.spotlight;
        if (!data || !data.commands || !data.commands.length) {
            root.style.display = "none";
            root = null;
            return;
        }
        document.getElementById("spotlight-title").appendChild(document.createTextNode(data.title));
        document.getElementById("spotlight-badge").appendChild(document.createTextNode(data.badge || "!"));
        var list = document.getElementById("spotlight-list");
        for (var i = 0; i < data.commands.length; i++) list.appendChild(buildCommand(data.commands[i]));
    }

    return { start: start, layout: layout };
})();
