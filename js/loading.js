var Duck = window.Duck || {};
window.Duck = Duck;

Duck.Loading = (function () {
    var Sprites = Duck.Sprites;

    var target = 2;
    var shown = 0;
    var filesTotal = 0;
    var finished = false;
    var fillEl, pctEl, statusEl, fileEl, duckCanvas, trackEl;
    var duckFrame = 0;

    var STATUS_TEXT = [
        [/retrieving server info/i, "Pegando informações do servidor..."],
        [/sending client info/i, "Enviando suas informações..."],
        [/workshop/i, "Baixando addons do Workshop..."],
        [/mounting/i, "Montando addons..."],
        [/lua/i, "Carregando scripts..."],
        [/spawn|active/i, "Prontinho, entrando!"]
    ];

    function friendlyStatus(status) {
        for (var i = 0; i < STATUS_TEXT.length; i++) {
            if (STATUS_TEXT[i][0].test(status)) return STATUS_TEXT[i][1];
        }
        return status;
    }

    function raiseTo(value) {
        if (value > target) target = Math.min(100, value);
    }

    function setStatus(status) {
        statusEl.innerHTML = "";
        statusEl.appendChild(document.createTextNode(friendlyStatus(status)));

        if (/workshop/i.test(status)) raiseTo(30);
        if (/lua/i.test(status)) raiseTo(92);
        if (/spawn|active/i.test(status)) complete();
    }

    function setFilesTotal(total) {
        filesTotal = Math.max(0, total);
    }

    function setFilesNeeded(needed) {
        if (filesTotal <= 0) return;
        var done = 1 - Math.max(0, needed) / filesTotal;
        raiseTo(10 + done * 80);
        if (needed <= 0) fileEl.innerHTML = "Downloads completos!";
    }

    function setDownloading(file) {
        var name = String(file).split("/").pop();
        fileEl.innerHTML = "";
        fileEl.appendChild(document.createTextNode("Baixando " + name));
    }

    function complete() {
        if (finished) return;
        finished = true;
        target = 100;
        statusEl.innerHTML = "Prontinho, entrando!";
        Duck.Scene.setCheering(true);
    }

    function paintDuck() {
        var name = finished ? "duck_cheer" : (duckFrame % 2 === 0 ? "duck_walk1" : "duck_walk2");
        var scale = Math.max(1, Math.floor(Duck.Scene.scale() / 2));
        Sprites.paintInto(duckCanvas, name, scale);
    }

    function tick() {
        shown += (target - shown) * 0.08;
        if (Math.abs(target - shown) < 0.05) shown = target;

        fillEl.style.width = shown + "%";
        pctEl.innerHTML = Math.floor(shown) + "%";

        var trackW = trackEl.offsetWidth;
        duckCanvas.style.left = Math.round(trackW * shown / 100 - duckCanvas.width * 0.55) + "px";
    }

    function walk() {
        duckFrame += 1;
        paintDuck();
    }

    function startDemo() {
        var files = ["materials/duck/patinho.png", "models/duck/lagoa.mdl", "sound/quack.wav", "maps/gm_ducks.bsp", "lua/autorun/duck.lua"];
        var step = 0;
        window.GameDetails("Duck's Server", "", "gm_construct", 40, "", "sandbox", 1);
        setStatus("Retrieving server info");
        setFilesTotal(files.length);

        var timer = setInterval(function () {
            if (step < files.length) {
                setDownloading(files[step]);
                setFilesNeeded(files.length - step - 1);
            } else if (step === files.length) {
                setStatus("Workshop Complete");
            } else if (step === files.length + 1) {
                setStatus("Starting Lua");
            } else {
                clearInterval(timer);
            }
            step += 1;
        }, 1800);
    }

    function start() {
        fillEl = document.getElementById("progress-fill");
        pctEl = document.getElementById("progress-pct");
        statusEl = document.getElementById("progress-status");
        fileEl = document.getElementById("progress-file");
        duckCanvas = document.getElementById("progress-duck");
        trackEl = document.getElementById("progress-track");

        paintDuck();
        setInterval(tick, 33);
        setInterval(walk, 180);

        setTimeout(function () {
            if (!Duck.Gmod.connected()) startDemo();
        }, 1500);
    }

    return {
        start: start,
        setStatus: setStatus,
        setFilesTotal: setFilesTotal,
        setFilesNeeded: setFilesNeeded,
        setDownloading: setDownloading,
        complete: complete,
        repaint: paintDuck
    };
})();
