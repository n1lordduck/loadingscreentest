var Duck = window.Duck || {};
window.Duck = Duck;

(function () {
    var Sprites = Duck.Sprites;

    function paintStatic(px) {
        var small = Math.max(1, Math.floor(px / 2));
        Sprites.paintInto(document.getElementById("title-duck"), "duck_idle", px);
        Sprites.paintInto(document.getElementById("sound-icon"), Duck.Music.isMuted() ? "speaker_off" : "speaker_on", small);
        Sprites.paintInto(document.getElementById("anniversary-crown"), "crown", small);
        document.documentElement.style.fontSize = Math.round(px * 5) + "px";
    }

    function fillText(id, text) {
        var el = document.getElementById(id);
        el.innerHTML = "";
        el.appendChild(document.createTextNode(text));
    }

    function fillCommands() {
        var list = document.getElementById("command-list");
        var commands = Duck.Data.commands || [];
        for (var i = 0; i < commands.length; i++) {
            var item = document.createElement("li");
            var name = document.createElement("span");
            name.className = "command-name";
            name.appendChild(document.createTextNode(commands[i][0]));
            item.appendChild(name);
            item.appendChild(document.createTextNode(commands[i][1]));
            list.appendChild(item);
        }
    }

    function bindSound() {
        var button = document.getElementById("sound-button");
        button.onclick = function () {
            Duck.Music.toggleMute();
            paintStatic(Duck.Scene.scale());
        };
    }

    function unlockAudioOnInput() {
        var events = ["mousedown", "keydown", "mousemove", "touchstart"];
        function unlock() {
            Duck.Music.resume();
            for (var i = 0; i < events.length; i++) {
                document.removeEventListener(events[i], unlock);
            }
        }
        for (var i = 0; i < events.length; i++) {
            document.addEventListener(events[i], unlock);
        }
    }

    Duck.onScaleChanged = function (px) {
        paintStatic(px);
        if (Duck.Rules.ready) Duck.Rules.layout(px);
        if (Duck.Update.ready) Duck.Update.layout();
        if (Duck.Notice.ready) Duck.Notice.layout();
        if (Duck.Spotlight.ready) Duck.Spotlight.layout();
        if (Duck.Loading.ready) Duck.Loading.repaint();
    };

    function boot() {
        fillText("title-sub", Duck.Theme.current().subtitle);
        fillText("anniversary-text", Duck.Data.anniversary);
        fillText("discord", Duck.Data.discord);
        fillCommands();
        Duck.Scene.start(document.getElementById("scene"));
        Duck.Rules.start();
        Duck.Rules.ready = true;
        Duck.Update.start();
        Duck.Update.ready = true;
        Duck.Update.layout();
        Duck.Notice.start();
        Duck.Notice.ready = true;
        Duck.Notice.layout();
        Duck.Spotlight.start();
        Duck.Spotlight.ready = true;
        Duck.Spotlight.layout();
        Duck.Loading.start();
        Duck.Loading.ready = true;
        Duck.Gallery.start();
        Duck.Music.start();
        bindSound();
        unlockAudioOnInput();
        paintStatic(Duck.Scene.scale());
    }

    boot();

    Sprites.load(function () {
        Sprites.applyTints(Duck.Theme.current().tints);
        Sprites.applyAliases(Duck.Theme.current().aliases || {});
        Duck.onScaleChanged(Duck.Scene.scale());
    });
})();
