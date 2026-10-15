var Duck = window.Duck || {};
window.Duck = Duck;

(function () {
    var Sprites = Duck.Sprites;

    function paintStatic(px) {
        var small = Math.max(1, Math.floor(px / 2));
        Sprites.paintInto(document.getElementById("title-duck"), "duck_idle", px);
        Sprites.paintInto(document.getElementById("sound-icon"), Duck.Music.isMuted() ? "speaker_off" : "speaker_on", small);
        document.documentElement.style.fontSize = Math.round(px * 4) + "px";
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
        if (Duck.Loading.ready) Duck.Loading.repaint();
    };

    function boot() {
        Duck.Scene.start(document.getElementById("scene"));
        Duck.Rules.start();
        Duck.Rules.ready = true;
        Duck.Loading.start();
        Duck.Loading.ready = true;
        Duck.Gallery.start();
        Duck.Music.start();
        bindSound();
        unlockAudioOnInput();
        paintStatic(Duck.Scene.scale());
        document.body.className = "ready";
    }

    Sprites.load(boot);
})();
